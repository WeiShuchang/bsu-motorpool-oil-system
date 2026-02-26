<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DriverController extends Controller
{
       public function showDriverPage(): Response
    {
        return Inertia::render('Admin/Drivers');
    }
}
