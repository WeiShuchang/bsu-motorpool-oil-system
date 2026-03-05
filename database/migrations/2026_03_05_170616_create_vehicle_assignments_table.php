<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicle_assignments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('driver_id')
                ->constrained('driver_models')
                ->cascadeOnDelete();

            $table->foreignId('vehicle_id')
                ->constrained('vehicle_models')
                ->cascadeOnDelete();

            $table->timestamps();

            // Prevent duplicate assignments
            $table->unique(['driver_id', 'vehicle_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicle_assignments');
    }
};