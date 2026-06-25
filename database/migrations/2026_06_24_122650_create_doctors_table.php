<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('specialization')->nullable();
            $table->string('qualification')->nullable();
            $table->string('license_number')->nullable();
            $table->string('department')->nullable();
            $table->integer('experience_years')->nullable();
            $table->decimal('consultation_fee', 10, 2)->nullable();
            $table->string('available_days')->nullable();
            $table->time('available_time_start')->nullable();
            $table->time('available_time_end')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('pincode')->nullable();
            $table->string('profile_photo_path')->nullable();
            $table->enum('status', ['active', 'inactive', 'on_leave'])->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
