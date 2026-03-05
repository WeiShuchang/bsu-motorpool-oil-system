<?php

namespace App\Http\Controllers;

use App\Models\VehicleModel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;


class VehicleController extends Controller
{
      public function showVehiclePage(): Response
    {
        return Inertia::render('Admin/Vehicles');
    }

    public function index()
    {
        $vehicles = VehicleModel::latest()->get();
        return response()->json($vehicles);
    }

      public function store(Request $request)
    {
     $validated = $request->validate([
        'make' => 'required|string|max:255',
        'model' => 'required|string|max:255',
        'seat_capacity' => 'required|integer|min:1',
        'plate_number' => 'required|string|unique:vehicle_models,plate_number', // Add this line
        'transmission' => 'required|string',
        'status' => 'required|string',
        'images' => 'nullable|array',
        'images.*' => 'image|mimes:jpeg,png,jpg'
    ]);

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('vehicles', 'public');
                $imagePaths[] = $path;
            }
        }

    $vehicle = VehicleModel::create([
        'driver_images' => json_encode($imagePaths),
        'make' => $validated['make'],
        'model' => $validated['model'],
        'seat_capacity' => $validated['seat_capacity'],
        'plate_number' => $validated['plate_number'], // Add this line
        'transmission' => $validated['transmission'],
        'status' => $validated['status']
    ]);

        return response()->json($vehicle, 201);
    }
public function update(Request $request, VehicleModel $vehicle)
{
    $validated = $request->validate([
        'make' => 'required|string|max:255',
        'model' => 'required|string|max:255',
        'seat_capacity' => 'required|integer|min:1',
        'transmission' => 'required|string',
        'status' => 'required|string',
        'images' => 'nullable|array',
        'images.*' => 'image|mimes:jpeg,png,jpg|max:2048'
    ]);

    // Handle images
    $imagePaths = [];

    // Keep existing images that weren't removed
    if ($request->has('existing_images')) {
        $imagePaths = $request->input('existing_images');
    }

    // Add new images
    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $image) {
            $path = $image->store('vehicles', 'public');
            $imagePaths[] = $path;
        }
    }

    // Delete old images that are no longer needed
    if ($vehicle->driver_images) {
        $oldImages = json_decode($vehicle->driver_images, true) ?? [];
        $imagesToDelete = array_diff($oldImages, $imagePaths);
        foreach ($imagesToDelete as $image) {
            Storage::disk('public')->delete($image);
        }
    }

    $validated['driver_images'] = json_encode($imagePaths);
    $vehicle->update($validated);

    return response()->json($vehicle);
}

    public function destroy(VehicleModel $vehicle)
    {
        // Delete images
        if ($vehicle->driver_images) {
            $images = json_decode($vehicle->driver_images, true) ?? [];
            foreach ($images as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        $vehicle->delete();

        return response()->json(['message' => 'Vehicle deleted successfully']);
    }
}
