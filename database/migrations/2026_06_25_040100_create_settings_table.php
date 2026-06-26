<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        DB::table('settings')->insert([
            ['key' => 'hospital_name', 'value' => 'MediCare Hospital'],
            ['key' => 'hospital_email', 'value' => 'info@medicare.com'],
            ['key' => 'hospital_phone', 'value' => '+1 234 567 890'],
            ['key' => 'hospital_address', 'value' => '123 Medical Center Blvd'],
            ['key' => 'two_factor_auth', 'value' => 'enabled'],
            ['key' => 'session_timeout', 'value' => '30'],
            ['key' => 'password_policy', 'value' => 'strong'],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
