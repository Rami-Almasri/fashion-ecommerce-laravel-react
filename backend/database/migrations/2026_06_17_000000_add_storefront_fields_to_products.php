<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('slug')->unique()->after('name');
            $table->text('description')->nullable()->after('slug');
            $table->decimal('original_price', 10, 2)->nullable()->after('price');
            $table->decimal('rating', 3, 2)->default(0)->after('original_price');
            $table->unsignedInteger('reviews')->default(0)->after('rating');
            $table->json('badges')->nullable()->after('reviews');
            $table->json('images')->nullable()->after('badges');
            $table->json('colors')->nullable()->after('images');
            $table->json('details')->nullable()->after('colors');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'slug', 'description', 'original_price', 'rating',
                'reviews', 'badges', 'images', 'colors', 'details',
            ]);
        });
    }
};
