<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceRecordModel extends Model
{
    protected $table = 'service_records';

    protected $fillable = [
        'vehicle_id',
        'driver_id',
        'service_date',
        'mileage',
        'lubrication_type',
        'oil_type',
        'quantity',
        'cost',
        'service_provider',
        'notes',
        'coolant',
        'break_cleaner',
        'wiper_washer',
        'engine_flush',
        'penetrating_oil',
    ];

    public function vehicle()
    {
        return $this->belongsTo(VehicleModel::class, 'vehicle_id');
    }

    public function driver()
    {
        return $this->belongsTo(DriverModel::class, 'driver_id');
    }
}