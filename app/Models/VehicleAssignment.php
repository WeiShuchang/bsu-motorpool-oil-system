<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleAssignment extends Model
{
    protected $fillable = ['driver_id', 'vehicle_id'];

    public function driver()
    {
        return $this->belongsTo(DriverModel::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(VehicleModel::class, 'vehicle_id'); // Add foreign key explicitly
    }
}