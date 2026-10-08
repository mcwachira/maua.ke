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
        Schema::create('payment_callbacks', function (Blueprint $table) {
            $table->id();
            // The payment this callback is associated with.
            // Nullable because we may receive a callback before
            // we can successfully identify our internal payment.
            $table->foreignId('payment_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            //The provider that sent a callback.
            //EXamples:Mpesa, paystack, pesapal
            $table->string('provider', 30);

            // Provider's unique identifier for this callback/event.
            // This is one of the main tools we will use for idempotency.
            $table->string('provider_reference', 150)
                ->nullable();

            // The type/event name supplied by the provider.
            // Example: payment.completed, stk.callback, etc.
            $table->string('event_type', 100)
                ->nullable();

            // Raw callback body received from the provider.
            // We preserve it so we can audit and reprocess callbacks.
            $table->jsonb('payload');

            //optional headers supplied by the provider
            //Useful for signature verification ands debugging
            $table->jsonb('headers')->nullable();

            // Whether our application has processed this callback.
            $table->boolean('processed')
                ->default(false);

            // When processing completed successfully.
            $table->timestamp('processed_at')
                ->nullable();

            // Useful when processing fails.
            $table->text('processing_error')
                ->nullable();

            $table->timestamps();

            //Quickly find callbacks belonging to a payment
            $table->index([
                'payment_id',
                'created_at',
            ]);
            // Useful for provider callback lookups.
            $table->index([
                'provider',
                'provider_reference',
            ]);

            // Useful for finding callbacks waiting to be processed.
            $table->index([
                'processed',
                'created_at',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_callbacks');
    }
};
