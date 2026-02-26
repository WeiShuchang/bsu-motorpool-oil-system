<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
      public function showVehiclePage(): Response
    {
        return Inertia::render('Admin/Vehicles');
    }
}
