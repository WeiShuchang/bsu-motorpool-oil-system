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
        Schema::table('vehicle_models', function (Blueprint $table) {
            $table->decimal('current_oil_in_engine', 8, 2)->nullable()->after('engine_flush');
            $table->decimal('overall_oil_engine_capacity', 8, 2)->nullable()->after('current_oil_in_engine');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicle_models', function (Blueprint $table) {
            $table->dropColumn(['current_oil_in_engine', 'overall_oil_engine_capacity']);
        });
    }
};