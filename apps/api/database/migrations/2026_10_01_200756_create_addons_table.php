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
        Schema::create('addons', function (Blueprint $table) {
            $table->id();
            $table -> string('name');
            $table -> string('slug')->unique();

            //sku is for stock tracking, order reporting and purchasing records.
            $table -> string('sku')->unique();
            $table->text('description')->nullable();
            // Standard add-on price in the smallest currency unit.
            $table->unsignedBigInteger('price_minor');

            $table->char('currency', 3)->default('KES');

            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);

            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_active', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addons');
    }
};
