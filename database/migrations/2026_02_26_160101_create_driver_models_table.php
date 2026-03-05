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
        Schema::create('driver_models', function (Blueprint $table) {
            $table->id();
            $table->string('driver_image')->nullable();
            $table->string('driver_full_name');
            $table->string('contact_number');
            $table->string('license_number');
            $table->text('address')->nullable();
            $table->string('status')->default('available');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('driver_models');
    }
};