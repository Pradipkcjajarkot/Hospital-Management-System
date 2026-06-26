<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('beds', function (Blueprint $table) {
            $table->id();
            $table->string('ward_name');
            $table->enum('ward_type', ['general', 'private', 'icu', 'maternity', 'pediatric', 'emergency', 'operation_theatre'])->default('general');
            $table->string('bed_number');
            $table->enum('bed_type', ['standard', 'electric', 'icu', 'bariatric', 'pediatric'])->default('standard');
            $table->string('floor')->nullable();
            $table->decimal('rate_per_day', 10, 2)->default(0);
            $table->enum('status', ['available', 'occupied', 'maintenance', 'reserved'])->default('available');
            $table->foreignId('patient_id')->nullable()->constrained()->nullOnDelete();
            $table->date('assigned_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('beds');
    }
};
