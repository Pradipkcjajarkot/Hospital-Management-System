<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medicines', function (Blueprint $table) {
            $table->id();
            $table->string('medicine_name');
            $table->string('brand')->nullable();
            $table->string('generic_name')->nullable();
            $table->string('category')->nullable();
            $table->string('unit');
            $table->decimal('price_per_unit', 10, 2);
            $table->integer('quantity_in_stock');
            $table->integer('reorder_level')->default(10);
            $table->enum('status', ['available', 'out_of_stock', 'discontinued'])->default('available');
            $table->date('expiry_date')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medicines');
    }
};
