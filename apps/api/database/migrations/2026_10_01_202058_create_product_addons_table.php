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
        Schema::create('product_addons', function (Blueprint $table) {
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('addon_id')->constrained()->cascadeOnDelete();
            // NULL means use the add-on's standard price.
            $table->unsignedBigInteger('price_minor')->nullable();

            $table->boolean('is_required')->default(false);

            $table->unsignedSmallInteger('max_quantity')->nullable();

            $table->unsignedInteger('sort_order')->default(0);

            $table->timestamps();

            // Prevent the same add-on being assigned twice to one product.
            $table->primary(['product_id', 'addon_id']);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_addons');
    }
};
