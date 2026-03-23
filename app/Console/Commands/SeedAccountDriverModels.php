<?php

namespace App\Console\Commands;

use App\Models\AccountDriverModel;
use App\Models\DriverModel;
use App\Models\User;
use Illuminate\Console\Command;

class SeedAccountDriverModels extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'seed:account-driver-models
                            {--dry-run : Preview which users would be seeded without making changes}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed account driver model records for users that do not have one yet';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $dryRun = $this->option('dry-run');

        // Get non-admin users that do not have any AccountDriverModel record yet
        $usersWithoutDriver = User::whereNotIn('id', function ($query) {
                $query->select('user_id')->from('account_driver_models');
            })
            ->where('user_type', '!=', 'admin')
            ->get();

        if ($usersWithoutDriver->isEmpty()) {
            $this->info('All users already have account driver records. Nothing to seed.');
            return self::SUCCESS;
        }

        $this->info("Found {$usersWithoutDriver->count()} user(s) without account driver records.");

        if ($dryRun) {
            $this->warn('[Dry Run] The following users would be seeded:');
            $this->table(
                ['ID', 'Name', 'Email'],
                $usersWithoutDriver->map(fn($u) => [$u->id, $u->name, $u->email])
            );
            return self::SUCCESS;
        }

        $seededCount = 0;

        foreach ($usersWithoutDriver as $user) {
            // Create a DriverModel record for the user
            $driver = DriverModel::create([
                'driver_full_name' => $user->name,
                'email'            => $user->email,
                'contact_number'   => '',
                'license_number'   => '',
                'address'          => '',
                'status'           => 'active',
            ]);

            // Link the user to the new driver record
            AccountDriverModel::create([
                'user_id'   => $user->id,
                'driver_id' => $driver->id,
            ]);

            $this->line("Seeded: {$user->name} → Driver ID [{$driver->id}]");
            $seededCount++;
        }

        $this->info("Successfully seeded {$seededCount} driver and account driver record(s).");

        return self::SUCCESS;
    }
}