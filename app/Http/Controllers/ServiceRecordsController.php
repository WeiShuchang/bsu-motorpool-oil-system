<?php

namespace App\Http\Controllers;

use App\Models\AccountDriverModel;
use App\Models\DriverModel;
use Illuminate\Http\Request;
use App\Models\ServiceRecordModel;
use App\Models\VehicleModel;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ServiceRecordsController extends Controller
{

   public function store(Request $request, $vehicle_id)
{
    $request->validate([
        'driver_id'        => 'required|exists:driver_models,id',   // add this
        'service_date'     => 'required|date',
        'mileage'          => 'required|integer|min:0',
        'lubrication_type' => 'required|string',
        'oil_type'         => 'required|string',
        'quantity'         => 'required|numeric|min:0.1',
        'cost'             => 'required|numeric|min:0',
        'service_provider' => 'required|string',
        'notes'            => 'nullable|string',
        'coolant'          => 'nullable|numeric',
        'break_cleaner'    => 'nullable|boolean',
        'wiper_washer'     => 'nullable|boolean',
        'engine_flush'     => 'nullable|boolean',
        'penetrating_oil'  => 'nullable|boolean',
    ]);

    ServiceRecordModel::create([
        'vehicle_id'       => $vehicle_id,
        'driver_id'        => $request->driver_id,   // ← from request, not Auth lookup
        'service_date'     => $request->service_date,
        'mileage'          => $request->mileage,
        'lubrication_type' => $request->lubrication_type,
        'oil_type'         => $request->oil_type,
        'quantity'         => $request->quantity,
        'cost'             => $request->cost,
        'service_provider' => $request->service_provider,
        'notes'            => $request->notes,
        'coolant'          => $request->coolant,
        'break_cleaner'    => $request->boolean('break_cleaner'),
        'wiper_washer'     => $request->boolean('wiper_washer'),
        'engine_flush'     => $request->boolean('engine_flush'),
        'penetrating_oil'  => $request->boolean('penetrating_oil'),
    ]);

    return response()->json(['success' => true]);
}

        public function fetchAdminServiceRecords()
    {
        $records = ServiceRecordModel::with(['vehicle', 'driver'])
            ->orderBy('service_date', 'desc')
            ->get()
            ->map(function ($record) {
                $images = json_decode($record->vehicle?->driver_images, true);
                $firstImage = collect($images)->first(fn($path) => !empty($path));
 
                return [
                    'id'          => $record->id,
                    'image'       => $firstImage ? asset('storage/' . $firstImage) : null,
                    'vehicle'     => $record->vehicle?->plate_number ?? '—',
                    'driver'      => $record->driver?->driver_full_name ?? '—',
                    'serviceDate' => $record->service_date
                                        ? \Carbon\Carbon::parse($record->service_date)->format('M d, Y')
                                        : '—',
                    'note'        => $record->notes ?? '—',
                    'status'      => 'Completed',
                ];
            });
 
        return response()->json([
            'records' => $records,
        ]);
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
 
        $records = ServiceRecordModel::with(['vehicle', 'driver'])
            ->when($search, function ($query) use ($search) {
                $query->whereHas('vehicle', fn($q) => $q->where('plate_number', 'like', "%{$search}%"))
                      ->orWhereHas('driver',  fn($q) => $q->where('driver_full_name', 'like', "%{$search}%"));
            })
            ->orderBy('service_date', 'desc')
            ->paginate(15)
            ->through(function ($record) {
                // Resolve first vehicle image from JSON array
                $images     = json_decode($record->vehicle?->driver_images, true);
                $firstImage = collect($images)->first(fn($p) => !empty($p));
 
                return [
                    'id'             => $record->id,
                    'vehicle_image'  => $firstImage ? asset('storage/' . $firstImage) : null,
                    'plate_number'   => $record->vehicle?->plate_number,
                    'driver_image'   => $record->driver?->driver_image
                                            ? asset('storage/' . $record->driver->driver_image)
                                            : null,
                    'driver_name'    => $record->driver?->driver_full_name,
                    'service_date'   => $record->service_date
                                            ? \Carbon\Carbon::parse($record->service_date)->format('M d, Y')
                                            : null,
                    'lubrication_type' => $record->lubrication_type,
                    'oil_type'       => $record->oil_type,
                    'quantity'       => $record->quantity,
                    'cost'           => $record->cost,
                    'service_provider' => $record->service_provider,
                    'notes'          => $record->notes,
                    'mileage'        => $record->mileage,
                    'coolant'        => $record->coolant,
                    'break_cleaner'  => $record->break_cleaner,
                    'wiper_washer'   => $record->wiper_washer,
                    'engine_flush'   => $record->engine_flush,
                    'penetrating_oil'=> $record->penetrating_oil,
                ];
            });
 
        return Inertia::render('Admin/ServiceRecord', [
            'records' => $records,
            'filters' => ['search' => $search],
            'vehicles' => VehicleModel::select('id', 'plate_number', 'make', 'model')->get(),
            'drivers'  => DriverModel::select('id', 'driver_full_name')->where('status', 'active')->get(),
        ]);
    }

        public function destroy($id)
    {
        $serviceRecord = ServiceRecordModel::findOrFail($id);
        $serviceRecord->delete();

        return response()->json([
            'success' => true,
            'message' => 'Service record deleted successfully.'
        ], 200);
    }

}