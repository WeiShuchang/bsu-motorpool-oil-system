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
        Schema::create('service_records', function (Blueprint $table) {
            $table->id();
            
            // Foreign keys
            $table->foreignId('vehicle_id')->constrained('vehicle_models')->onDelete('cascade');
            $table->foreignId('driver_id')->constrained('driver_models')->onDelete('cascade');
            
            // Service details
            $table->date('service_date');
            $table->integer('mileage');
            $table->string('lubrication_type');
            $table->string('oil_type');
            $table->decimal('quantity', 8, 2);
            $table->decimal('cost', 10, 2);
            $table->string('service_provider');
            $table->text('notes')->nullable();
            
            // Additional maintenance items
            $table->string('coolant')->nullable();
            $table->boolean('break_cleaner')->default(false);
            $table->boolean('wiper_washer')->default(false);
            $table->boolean('engine_flush')->default(false);
            $table->boolean('penetrating_oil')->default(false);
            
            $table->timestamps();
            
            // Optional: Add indexes for better query performance
            $table->index('service_date');
            $table->index('vehicle_id');
            $table->index('driver_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_records');
    }
};