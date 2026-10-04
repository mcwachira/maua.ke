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
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('sku')->unique();

            // Store money in the smallest currency unit.
            // Example: KES 3,500.00 = 350000
            $table->unsignedBigInteger('price_minor');

            $table->char('currency', 3)->default('KES');

            // Flexible variant-specific information.
            // Example: {"rose_count": 24}
            $table->jsonb('attributes')->nullable();

            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);

            $table->timestamps();
            $table->softDeletes();

            $table->foreignId('product_id')->constrained() ->cascadeOnDelete();

            $table->index(['product_id', 'is_active', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
