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
        Schema::create('payment_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('attempt_number');
            $table->string('provider', 30);
            $table->string('provider_reference', 150)->nullable();

            $table->unsignedBigInteger('amount_minor');

            $table->string('status', 30)
                ->default('pending');

            $table->jsonb('request_payload')
                ->nullable();

            $table->jsonb('response_payload')
                ->nullable();

            $table->string('failure_code', 100)
                ->nullable();

            $table->text('failure_message')
                ->nullable();

            $table->timestamp('started_at')
                ->nullable();

            $table->timestamp('completed_at')
                ->nullable();
            $table->timestamps();

            /*
           * A payment cannot have two attempts with the
           * same attempt number.
           */
            $table->unique([
                'payment_id',
                'attempt_number',
            ]);

            $table->index([
                'payment_id',
                'status',
            ]);

            $table->index([
                'provider',
                'provider_reference',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_attempts');
    }
};
