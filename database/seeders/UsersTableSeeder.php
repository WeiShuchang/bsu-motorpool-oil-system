<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    public function run(): void
    {
        // Create 1 admin
        User::create([
            'name' => 'Admin',
            'email' => 'admin@bsumotorpool.edu',
            'password' => Hash::make('password'),
            'user_type' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create 3 drivers
        User::create([
            'name' => 'Driver 1',
            'email' => 'driver1@bsumotorpool.edu',
            'password' => Hash::make('password'),
            'user_type' => 'driver',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Driver 2',
            'email' => 'driver2@bsumotorpool.edu',
            'password' => Hash::make('password'),
            'user_type' => 'driver',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Driver 3',
            'email' => 'driver3@bsumotorpool.edu',
            'password' => Hash::make('password'),
            'user_type' => 'driver',
            'email_verified_at' => now(),
        ]);
    }
}