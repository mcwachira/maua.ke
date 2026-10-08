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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->restrictOnDelete();
            $table->string('reference', 100)->unique();
            $table->unsignedBigInteger('amount_minor');
            $table->char('currency', 3)->default('KES');
            $table->string('status', 30)
                ->default('pending');

            $table->string('method', 30);

            $table->string('provider', 30);

            $table->timestamp('paid_at')
                ->nullable();

            $table->timestamp('expires_at')
                ->nullable();

            $table->timestamps();

            $table->index(['order_id', 'status']);
            $table->index(['provider', 'status']);
            $table->index('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
