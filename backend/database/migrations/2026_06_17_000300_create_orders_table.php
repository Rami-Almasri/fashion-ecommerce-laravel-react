<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            // The customer who placed the order.
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            // The employee who made the sale (null for self-service online orders).
            $table->foreignId('employee_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('branch_id')->nullable()->constrained('branches')->nullOnDelete();
            $table->enum('channel', ['online', 'in-store'])->default('online');
            $table->enum('status', ['placed', 'paid', 'shipped', 'delivered', 'cancelled'])->default('paid');
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('shipping', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);
            $table->timestamp('placed_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'placed_at']);
            $table->index(['employee_id']);
            $table->index(['branch_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
