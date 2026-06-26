<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('gallery_items', function (Blueprint $table) {
            $table->string('image_url')->nullable()->after('image_path');
            $table->string('caption')->nullable()->after('description');
            $table->string('album')->nullable()->after('category');
        });
    }

    public function down(): void
    {
        Schema::table('gallery_items', function (Blueprint $table) {
            $table->dropColumn(['image_url', 'caption', 'album']);
        });
    }
};
