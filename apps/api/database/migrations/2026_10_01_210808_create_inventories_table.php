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
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_variant_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('on_hand_quantity')->default(0);

            //stock  temporarily held like stock in a shopping cart
            $table->unsignedInteger('reserve_quantity')->default(0);

            // used as a guide on when to alert stock level low so reorder more stock
            $table->unsignedInteger('reorder_level')->default(5);
            $table->timestamps();

            $table->unique(['product_variant_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};
