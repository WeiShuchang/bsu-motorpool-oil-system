<?php

namespace Database\Seeders;

use App\Models\VehicleModel;
use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {
        $vehicles = [
            [
                'make'  => 'Yutong',
                'model' => 'Bus',
                'plate_number' => 'SAB 5997',
                'transmission' => 'automatic',
                'seat_capacity' => 45,
                'status' => 'available',
            ],
            [
                'make'  => 'Yutong',
                'model' => 'Coaster',
                'plate_number' => 'SAB 5998',
                'transmission' => 'automatic',
                'seat_capacity' => 30,
                'status' => 'available',
            ],
            [
                'make'  => 'Toyota',
                'model' => 'Coaster',
                'plate_number' => 'P5 P942',
                'transmission' => 'manual',
                'seat_capacity' => 30,
                'status' => 'available',
            ],
            [
                'make'  => 'Nissan',
                'model' => 'Estate',
                'plate_number' => 'SKA 939',
                'transmission' => 'manual',
                'seat_capacity' => 7,
                'status' => 'available',
            ],
            [
                'make'  => 'Mitsubishi',
                'model' => 'FB L300',
                'plate_number' => 'B7 H746',
                'transmission' => 'manual',
                'seat_capacity' => 14,
                'status' => 'available',
            ],
            [
                'make'  => 'Toyota',
                'model' => 'Fortuner',
                'plate_number' => 'SJV 107',
                'transmission' => 'automatic',
                'seat_capacity' => 7,
                'status' => 'available',
            ],
            [
                'make'  => 'Toyota',
                'model' => 'GL',
                'plate_number' => 'S4 Q469',
                'transmission' => 'manual',
                'seat_capacity' => 15,
                'status' => 'available',
            ],
            [
                'make'  => 'Toyota',
                'model' => 'Hi Ace',
                'plate_number' => 'SFH 273',
                'transmission' => 'manual',
                'seat_capacity' => 15,
                'status' => 'available',
            ],
            [
                'make'  => 'Toyota',
                'model' => 'Hi Lux',
                'plate_number' => 'SDA 759',
                'transmission' => 'manual',
                'seat_capacity' => 5,
                'status' => 'available',
            ],
            [
                'make'  => 'Toyota',
                'model' => 'Hi Lux',
                'plate_number' => 'P4 B219',
                'transmission' => 'manual',
                'seat_capacity' => 5,
                'status' => 'available',
            ],
            [
                'make'  => 'Toyota',
                'model' => 'Revo',
                'plate_number' => 'SFU 402',
                'transmission' => 'manual',
                'seat_capacity' => 7,
                'status' => 'available',
            ],
            [
                'make'  => 'Toyota',
                'model' => 'Revo',
                'plate_number' => 'SEL 944',
                'transmission' => 'manual',
                'seat_capacity' => 7,
                'status' => 'available',
            ],
            [
                'make'  => 'Toyota',
                'model' => 'Revo',
                'plate_number' => 'SFS 740',
                'transmission' => 'manual',
                'seat_capacity' => 7,
                'status' => 'available',
            ],
            [
                'make'  => 'Hyundai',
                'model' => 'Starex',
                'plate_number' => 'SHH 537',
                'transmission' => 'automatic',
                'seat_capacity' => 11,
                'status' => 'available',
            ],
            [
                'make'  => 'Toyota',
                'model' => 'VX',
                'plate_number' => 'SDN 570',
                'transmission' => 'automatic',
                'seat_capacity' => 8,
                'status' => 'available',
            ],
        ];

        foreach ($vehicles as $data) {
            VehicleModel::firstOrCreate(
                ['plate_number' => $data['plate_number']],
                array_merge($data, [
                    'driver_images'               => null,
                    'coolant'                     => false,
                    'break_cleaner'               => false,
                    'wiper_washer'                => false,
                    'engine_flush'                => false,
                    'penetrating_oil'             => false,
                    'current_oil_in_engine'       => null,
                    'overall_oil_engine_capacity' => null,
                ])
            );

            $this->command->info("✓ {$data['make']} {$data['model']} — {$data['plate_number']}");
        }

        $this->command->newLine();
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('  15 BSU Motorpool vehicles seeded');
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
}