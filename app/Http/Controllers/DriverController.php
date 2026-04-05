<?php

namespace App\Http\Controllers;

use App\Models\DriverModel;
use App\Models\VehicleModel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\DriverRequest;
use App\Http\Resources\DriverResource;
use App\Models\AccountDriverModel;
use App\Models\ServiceRecordModel;
use App\Models\User;
use App\Models\VehicleAssignment;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;


class DriverController extends Controller
{
    
public function showDriverPage(Request $request)
{
    $drivers = DriverModel::with('vehicles') // Add this line
        ->when($request->search, function ($query, $search) {
            $query->where('driver_full_name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('contact_number', 'like', "%{$search}%");
        })
        ->orderBy('id', 'desc')
        ->paginate(10)
        ->withQueryString();
        
    $vehicles = VehicleModel::where('status', 'available')->get(['id', 'make', 'model', 'plate_number', 'status', 'driver_images']);

    return Inertia::render('Admin/Drivers', [
        'drivers' => DriverResource::collection($drivers),
        'filters' => $request->only(['search']),
        'availableVehicles' => $vehicles
    ]);
}

 /**
     * Store a newly created driver.
     */
    public function store(DriverRequest $request)
    {
        $validated = $request->validated();
        
        if ($request->hasFile('driver_image')) {
            $path = $request->file('driver_image')->store('drivers', 'public');
            $validated['driver_image'] = $path;
        }

        $driver = DriverModel::create($validated);

        if ($request->has('vehicle_ids')) {
            $driver->vehicles()->sync($request->vehicle_ids); 
        }

        // Generate password (5 capital letters + 5 numbers)
        $password = $this->generateDriverPassword();
        
        // Create user account
        $user = User::create([
            'name' => $validated['driver_full_name'],
            'email' => $validated['email'],
            'password' => Hash::make($password),
            'user_type' => 'driver',
            'email_verified_at' => now(), // Auto verify
        ]);

        // Create account driver link
        AccountDriverModel::create([
            'user_id' => $user->id,
            'driver_id' => $driver->id,
        ]);

        // Send welcome email with credentials
        try {
            $this->sendWelcomeEmail($validated['email'], $validated['driver_full_name'], $password);
        } catch (\Exception $e) {

        }

        return redirect()->back()->with('success', 'Driver created successfully. Login credentials have been sent to their email.');
    }

    /**
     * Generate password: 5 capital letters + 5 numbers
     */
    private function generateDriverPassword()
    {
        $letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        $numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        
        // Get 5 random capital letters
        $letterPart = '';
        for ($i = 0; $i < 5; $i++) {
            $letterPart .= $letters[array_rand($letters)];
        }
        
        // Get 5 random numbers
        $numberPart = '';
        for ($i = 0; $i < 5; $i++) {
            $numberPart .= $numbers[array_rand($numbers)];
        }
        
        return $letterPart . $numberPart;
    }

    /**
     * Send welcome email with credentials
     */
        private function sendWelcomeEmail($email, $name, $password)
        {
            $logoPath = public_path('storage/icons/bsu_motorpool-removebg-preview.png');
            $logoUrl = file_exists($logoPath) 
                ? url('/storage/icons/bsu_motorpool-removebg-preview.png') 
                : null;

            $companyInfo = [
                'name' => "BSU Motorpool",
                'logo' => 'https://bsumotorpoolsystem.com/storage/icons/bsu_motorpool-removebg-preview.png',
                'website' => "https://bsumotorpoolsystem.com/",
            ];

            Mail::send('emails.driver-welcome', [
                'username' => $email,
                'password' => $password,
                'name' => $name,
                'parentCompanyInfo' => $companyInfo
            ], function ($message) use ($email, $name) {
                $message->to($email, $name)
                        ->subject('Your Driver Account Has Been Created')
                        ->from(config('mail.from.address'), config('mail.from.name'));
            });
        }


      /**
 * Update the specified driver.
 */
public function update(DriverRequest $request, DriverModel $driver)
{
    $validated = $request->validated();
    
    if ($request->hasFile('driver_image')) {
        // Delete old image
        if ($driver->driver_image) {
            Storage::disk('public')->delete($driver->driver_image);
        }
        
        $path = $request->file('driver_image')->store('drivers', 'public');
        $validated['driver_image'] = $path;
    } else {
        unset($validated['driver_image']);
    }
    
    // Update driver main attributes
    $driver->update($validated);
    
    // Update the associated user account
    $accountDriver = AccountDriverModel::where('driver_id', $driver->id)->first();
    if ($accountDriver && $accountDriver->user) {
        $accountDriver->user->update([
            'name' => $validated['driver_full_name'],
            'email' => $validated['email']
        ]);
    }
    
    // Handle vehicle assignments
    if ($request->has('vehicle_ids')) {
        $newVehicleIds = $request->vehicle_ids;
        
        // Get current assignments
        $currentAssignments = VehicleAssignment::where('driver_id', $driver->id)
            ->pluck('vehicle_id')
            ->toArray();
        
        // Find vehicles to remove (in current but not in new)
        $vehiclesToRemove = array_diff($currentAssignments, $newVehicleIds);
        
        // Find vehicles to add (in new but not in current)
        $vehiclesToAdd = array_diff($newVehicleIds, $currentAssignments);
        
        // Remove assignments
        if (!empty($vehiclesToRemove)) {
            VehicleAssignment::where('driver_id', $driver->id)
                ->whereIn('vehicle_id', $vehiclesToRemove)
                ->delete();
        }
        
        // Add new assignments
        foreach ($vehiclesToAdd as $vehicleId) {
            VehicleAssignment::create([
                'driver_id' => $driver->id,
                'vehicle_id' => $vehicleId
            ]);
        }
    } else {
        // If no vehicle_ids in request, remove all assignments
        VehicleAssignment::where('driver_id', $driver->id)->delete();
    }
    
    return redirect()->back()->with('success', 'Driver updated successfully.');
}

    public function destroy(DriverModel $driver)
    {
        // Delete image
        if ($driver->driver_image) {
            Storage::disk('public')->delete($driver->driver_image);
        }

        // Detach vehicles
        $driver->vehicles()->detach();
        
        // Find and delete the associated user account
        $accountDriver = AccountDriverModel::where('driver_id', $driver->id)->first();
        
        if ($accountDriver) {
            // Delete the user
            $user = User::find($accountDriver->user_id);
            if ($user) {
                $user->delete();
            }
            
            // Delete the account driver record
            $accountDriver->delete();
        }
        
        $driver->delete();

        return redirect()->back()->with('success', 'Driver and associated user account deleted successfully.');
    }

    /**
     * Get available vehicles for assignment.
     */
    public function getAvailableVehicles()
    {
        return VehicleModel::where('status', 'available')
            ->orWhereHas('drivers', function ($query) {
                $query->where('driver_id', request('driver_id'));
            })
            ->get(['id', 'make', 'model', 'plate_number', 'status']);
    }


    public function getAssignedVehicles()
    {
        try {
            // Get the currently authenticated user
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            // Get the driver record associated with the user
            $accountDriver = AccountDriverModel::where('user_id', $user->id)->first();
            
            if (!$accountDriver) {
                return response()->json(['error' => 'Driver record not found'], 404);
            }

            // Get vehicles assigned to this driver
            $vehicles = VehicleModel::whereHas('drivers', function($query) use ($accountDriver) {
                $query->where('driver_id', $accountDriver->driver_id);
            })
            ->select('id', 'make', 'model', 'seat_capacity', 'plate_number', 'status', 'driver_images')
            ->get();

            // Transform the data to include image URL
            $formattedVehicles = $vehicles->map(function($vehicle) {
                return [
                    'id' => $vehicle->id,
                    'plate_number' => $vehicle->plate_number,
                    'make' => $vehicle->make,
                    'model' => $vehicle->model,
                    'seat_capacity' => $vehicle->seat_capacity,
                    'status' => $vehicle->status ?? 'On Track',
                    'image' => $vehicle->driver_images ?? $this->getDefaultImage($vehicle->make)
                ];
            });

            return response()->json($formattedVehicles);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch vehicles: ' . $e->getMessage()], 500);
        }
    }

    private function getDefaultImage($make)
    {
        // Return default images based on vehicle make
        $images = [
            'Toyota' => 'https://images.unsplash.com/photo-1648197323414-4255ea82d86b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUb3lvdGElMjBIaWFjZSUyMHZhbiUyMHdoaXRlfGVufDF8fHx8MTc3MDk3OTAxNHww&ixlib=rb-4.1.0&q=80&w=1080',
            'Mitsubishi' => 'https://images.unsplash.com/photo-1715372028845-f7cd49a7ed99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNaXRzdWJpc2hpJTIwTDMwMCUyMHZhbiUyMHNpbHZlcnxlbnwxfHx8fDE3NzA5NzkwMTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
            'Nissan' => 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YW58ZW58MHx8fHwxNzcwOTc5MDE0&ixlib=rb-4.1.0&q=80&w=1080',
        ];

        return $images[$make] ?? 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
    }

    public function showVehicleDetails(Request $request, $id)
    {
        $vehicle = VehicleModel::with('drivers')->find($id);
        
        if (!$vehicle) {
            return redirect()->back()->with('error', 'Vehicle not found');
        }

        $serviceRecords = ServiceRecordModel::with('driver')
            ->where('vehicle_id', $id)
            ->orderBy('service_date', 'desc')
            ->get();

        $totalCost = $serviceRecords->sum('cost');
        $avgCost = $serviceRecords->count() > 0 ? $totalCost / $serviceRecords->count() : 0;
        $lastService = $serviceRecords->first()?->service_date;
        $totalMileage = $serviceRecords->max('mileage');

        return Inertia::render('Driver/VehicleDetails', [
            'vehicle' => $vehicle,
            'serviceRecords' => $serviceRecords,
            'stats' => [
                'total_services' => $serviceRecords->count(),
                'total_maintenance_cost' => number_format($totalCost, 2),
                'avg_cost' => round($avgCost, 2),
                'last_service' => $lastService ? \Carbon\Carbon::parse($lastService)->format('M d, Y') : null,
                'total_mileage' => $totalMileage ? number_format($totalMileage) : null,
            ]
        ]);
    }


        public function addServiceRecord($id)
    {
        $vehicle = VehicleModel::find($id);
        
        if (!$vehicle) {
            return redirect()->back()->with('error', 'Vehicle not found');
        }



        return Inertia::render('Driver/AddServiceRecord', [
            'vehicle' => $vehicle
        ]);
    }


     
    public function fetchAdminDrivers()
    {
        $drivers = DriverModel::select([
                'id',
                'driver_image',
                'driver_full_name',
                'contact_number',
                'email',
                'status',
            ])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($driver) {
                $assignedVehicles = VehicleAssignment::where('driver_id', $driver->id)->count();
 
                return [
                    'id'               => $driver->id,
                    'image'            => $driver->driver_image
                                            ? asset('storage/' . $driver->driver_image)
                                            : null,
                    'name'             => $driver->driver_full_name,
                    'contactNumber'    => $driver->contact_number,
                    'email'            => $driver->email,
                    'vehicles'         => $assignedVehicles,
                    'status'           => $driver->status,
                    'statusColor'      => match (strtolower($driver->status)) {
                        'active'   => 'green',
                        'inactive' => 'red',
                        default    => 'green',
                    },
                ];
            });
 
        return response()->json([
            'drivers' => $drivers,
        ]);
    }

}
