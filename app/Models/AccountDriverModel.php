<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccountDriverModel extends Model
{
    protected $table = 'account_driver_models';

    protected $fillable = [
        'user_id',
        'driver_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function driver()
    {
        return $this->belongsTo(DriverModel::class, 'driver_id');
    }
}