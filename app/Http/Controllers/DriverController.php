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
        ->latest()
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

        return redirect()->back()->with('success', 'Driver created successfully.');
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
            // IMPORTANT: Remove driver_image from validated if it exists
            // This ensures we don't accidentally set it to null
            unset($validated['driver_image']);

        }

        
        $driver->update($validated);

        return redirect()->back()->with('success', 'Driver updated successfully.');
    }

    /**
     * Remove the specified driver.
     */
    public function destroy(DriverModel $driver)
    {
        // Delete image
        if ($driver->driver_image) {
            Storage::disk('public')->delete($driver->driver_image);
        }

        // Detach vehicles

        
        $driver->delete();

        return redirect()->back()->with('success', 'Driver deleted successfully.');
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
}
