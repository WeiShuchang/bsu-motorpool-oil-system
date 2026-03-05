<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DriverModel extends Model
{
    protected $table = 'driver_models';

    protected $fillable = [
        'driver_image',
        'driver_full_name',
        'contact_number',
        'license_number',
        'address',
        'email',
        'status'
    ];

    public function vehicles()
    {
        return $this->belongsToMany(
            VehicleModel::class,
            'vehicle_assignments',
            'driver_id',
            'vehicle_id'
        );
    }
}