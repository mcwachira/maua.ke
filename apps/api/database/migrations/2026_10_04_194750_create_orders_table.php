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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            // The authenticated customer who placed the order.
            $table->foreignId('user_id')
                ->constrained()
                ->restrictOnDelete();

            // Human-readable order reference.
            // Example: MAU-20261004-AB12CD
            $table->string('order_number', 30)->unique();

            // Order lifecycle.
            $table->string('status', 30)->default('pending');

            // Payment lifecycle is intentionally separate from order status.
            $table->string('payment_status', 30)->default('pending');

            // All monetary values are stored in minor units.
            // Example: KES 3,500 = 350000.
            $table->unsignedBigInteger('subtotal_minor');
            $table -> unsignedBigInteger('delivery_fee_minor')->default(0);
            $table -> unsignedBigInteger('discount_minor')->default(0);
            $table -> unsignedBigInteger('total_minor');
            $table ->char('currency', 3)->default('KES');

            // Customer snapshot.
            // This protects historical orders if the user's profile changes.
            $table->string('customer_name');
            $table->string('customer_phone', 30);
            $table->string('customer_email')->nullable();

            // Delivery address snapshot.
            // Stored as JSON because address structure may evolve.
            $table->jsonb('delivery_address');

            $table->text('customer_notes')->nullable();


            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['status', 'payment_status']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
