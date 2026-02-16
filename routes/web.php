<?php

use App\Http\Controllers\ProfileController;
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

    // Driver routes
    Route::get('/driver/dashboard', function () {
        return Inertia::render('Driver/DriverDashboard');
    })->middleware('auth')->name('driver.dashboard');

    // Profile routes (accessible by both)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';