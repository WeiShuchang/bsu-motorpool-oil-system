<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicle_models', function (Blueprint $table) {
            $table->id();
            $table->string('driver_images')->nullable();
            $table->string('make');
            $table->string('model');
            $table->integer('seat_capacity');
            $table->string('coolant')->nullable();
            $table->string('break_cleaner')->nullable();
            $table->string('wiper_washer')->nullable();
            $table->string('engine_flush')->nullable();
            $table->string('penetrating_oil')->nullable();
            $table->string('plate_number')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_models');
    }
};