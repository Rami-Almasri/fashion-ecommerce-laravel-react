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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', [
                'pajamas',    // بجامة
                'sweater',    // كنزة
                'pants',      // بنطلون
                'jacket',     // جاكيت
                't-shirt',    // تيشرت
                'suit',       // طقم
                'dress',      // فستان
                'jumpsuit',   // سالفيت
                'hoodie',     // هودي
                'shorts',     // شورت
                'skirt',      // سيرت]);
            ]);
            $table->enum('season', ['summer', 'winter']);
            $table->decimal('price', 10, 2);
            $table->foreignId('category_id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
