<?php

use App\Http\Controllers\Controller;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ServiceRecordsController;
use App\Http\Controllers\VehicleController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    return Inertia::render('Homepage');
})->name('home');

// Remove or comment out the default dashboard route
// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// Authenticated routes
Route::middleware('auth')->group(function () {
    
    // Redirect based on user type
    Route::get('/dashboard', function () {
        $user = Auth::user();
        
        if ($user->user_type === 'admin') {
            return redirect()->route('admin.dashboard');
        } else {
            return redirect()->route('driver.dashboard');
        }
    })->name('dashboard');

    // Admin routes
    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/AdminDashboard');
    })->middleware('auth')->name('admin.dashboard');

    Route::get('/admin/drivers', [DriverController::class, 'showDriverPage'])
        ->middleware('auth')
        ->name('admin.drivers');

    Route::get('/admin/vehicles', [VehicleController::class, 'showVehiclePage'])
        ->middleware('auth')
        ->name('admin.vehicles');

    // Driver routes
    Route::get('/driver/dashboard', function () {
        return Inertia::render('Driver/DriverDashboard');
    })->middleware('auth')->name('driver.dashboard');
   // Display drivers page (GET)
    Route::get('/drivers', [DriverController::class, 'showDriverPage'])->name('drivers.index');
    Route::post('/drivers', [DriverController::class, 'store'])->name('drivers.store');
    Route::put('/drivers/{driver}', [DriverController::class, 'update'])->name('drivers.update');
    Route::patch('/drivers/{driver}', [DriverController::class, 'update']);
    Route::delete('/drivers/{driver}', [DriverController::class, 'destroy'])->name('drivers.destroy');

    Route::prefix('admin')->group(function () {
        Route::get('/vehicles', [VehicleController::class, 'showVehiclePage'])->name('admin.vehicles.index');
        Route::get('/vehicles/data', [VehicleController::class, 'index'])->name('admin.vehicles.data'); // Add this line
        Route::post('/vehicles/store', [VehicleController::class, 'store'])->name('admin.vehicles.store');
        Route::post('/vehicles/{vehicle}/update', [VehicleController::class, 'update'])->name('admin.vehicles.update');
        Route::delete('/vehicles/{vehicle}/delete', [VehicleController::class, 'destroy'])->name('admin.vehicles.destroy');
    });


    Route::prefix('driver')->group(function () {
        Route::get('/get-assigned-vehicles', [DriverController::class, 'getAssignedVehicles'])->name('driver.get-vehicles');

    });

    Route::get('/vehicle/{id}/add-service', [DriverController::class, 'addServiceRecord'])->name('driver.vehicle.add-service');


    // Profile routes (accessible by both)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/driver/vehicle/{id}', [DriverController::class, 'showVehicleDetails'])->name('driver.vehicle.details');

    Route::post('/vehicles/{vehicle}/service-record', [ServiceRecordsController::class, 'store'])->name('service-record.store');
    
    Route::get('/admin/dashboard/vehicles', [VehicleController::class, 'fetchAdminVehicles'])->name('admin.vehicles');
    Route::get('/admin/dashboard/drivers', [DriverController::class, 'fetchAdminDrivers'])->name('admin.drivers');
    Route::get('/admin/dashboard/records', [ServiceRecordsController::class, 'fetchAdminServiceRecords'])->name('admin.records');
    Route::get('/admin/dashboard/stats', [VehicleController::class, 'fetchAdminStats'])->name('admin.stats');

    Route::get('/service-records', [ServiceRecordsController::class, 'index'])->name('service-records.index');
//  Route::post('/service-records/{vehicle_id}', [ServiceRecordsController::class, 'store'])->name('service-records.store');
//  Route::delete('/service-records/{id}', [ServiceRecordsController::class, 'destroy'])->name('service-records.destroy');


});

require __DIR__.'/auth.php';