<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleModel extends Model
{
    protected $table = 'vehicle_models';
    
    protected $fillable = [
        'driver_images',
        'make',
        'model',
        'seat_capacity',
        'coolant',
        'status',
        'transmission',
        'break_cleaner',
        'wiper_washer',
        'engine_flush',
        'penetrating_oil',
        'plate_number',
        'current_oil_in_engine',
        'overall_oil_engine_capacity',
    ];

    public function drivers()
    {
        return $this->belongsToMany(
            DriverModel::class,
            'vehicle_assignments',
            'vehicle_id',
            'driver_id'
        );
    }
}