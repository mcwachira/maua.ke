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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_variant_id')->constrained()->restrictOnDelete();

            // Snapshot of the product information at checkout.
            $table->string('product_name');
            $table->string('variant_name');
            $table->string('sku');

            // Price at the exact moment the order was created.
            $table->unsignedBigInteger('unit_price_minor');

            $table->unsignedInteger('quantity');
            $table->unsignedBigInteger('subtotal_minor');
            $table->char('currency',3)->default('KES');
            $table->timestamps();

            $table->index('order_id');
            $table->index('product_variant_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
