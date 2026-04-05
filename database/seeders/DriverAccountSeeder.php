<?php

namespace Database\Seeders;

use App\Models\AccountDriverModel;
use App\Models\DriverModel;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DriverAccountSeeder extends Seeder
{
    public function run(): void
    {
        foreach (range(1, 10) as $i) {
            // 1. Create the User account
            $user = User::firstOrCreate(
                ['email' => "driver{$i}@bsumotorpool.edu"],
                [
                    'name'      => "Driver {$i}",
                    'password'  => Hash::make('motorpooldriver@123'),
                    'user_type' => 'driver',
                ]
            );

            // 2. Create the Driver profile
            $driver = DriverModel::firstOrCreate(
                ['email' => "driver{$i}@bsumotorpool.edu"],
                [
                    'driver_full_name' => "Driver {$i}",
                    'contact_number'   => '09' . str_pad($i, 9, '0', STR_PAD_LEFT),
                    'license_number'   => 'LIC-2024-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                    'address'          => "Address {$i}, Benguet State University",
                    'status'           => 'active',
                    'driver_image'     => null,
                ]
            );

            // 3. Link User ↔ Driver (only if not already linked)
            AccountDriverModel::firstOrCreate([
                'user_id'   => $user->id,
                'driver_id' => $driver->id,
            ]);

            $this->command->info("✓ driver{$i}@bsumotorpool.edu (User #{$user->id} → Driver #{$driver->id})");
        }

        $this->command->newLine();
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('  10 driver accounts seeded successfully');
        $this->command->info('  Password: motorpooldriver@123');
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
}