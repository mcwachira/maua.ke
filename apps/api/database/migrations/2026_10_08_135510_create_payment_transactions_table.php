<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    /**
     * Create the payment transaction audit table.
     *
     * A transaction represents an event that happened during a
     * payment attempt, such as initiated, processing, captured,
     * failed, cancelled, or refunded.
     */
    public function up(): void
    {
        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->id();

            /*
           * Every transaction belongs to a payment.
           *
           * Example:
           * Payment #15
           *   ├── initiated
           *   ├── processing
           *   └── captured
           */
            $table->foreignId('payment_id')
                ->constrained()
                ->cascadeOnDelete();

            /*
             * A transaction can optionally belong to a specific
             * payment attempt.
             *
             * This is important when a customer retries payment.
             *
             * Payment
             *   ├── Attempt #1 → failed
             *   └── Attempt #2 → succeeded
             */
            $table->foreignId('payment_attempt_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            /*
           * What happened to the payment.
           *
           * Values come from PaymentTransactionType:
           *
           * initiated
           * processing
           * authorized
           * captured
           * failed
           * cancelled
           * refunded
           */

            $table->string('type', 30);

            /*
        * Provider's transaction/reference ID.
        *
        * For example, M-Pesa, Paystack, or Pesapal may give
        * us their own transaction identifier.
        */
            $table->string('provider_reference', 150)
                ->nullable();

            /*
             * Amount Involved in this transaction
             *
             * Stores as integer minor units.
             *
             * Example
             * KES 3,500.00 -> 350000
             */
            $table->unsignedBigInteger('amount_minor');

            /*
             * Currency used for the transaction.
             */
            $table->char('currency', 3)
                ->default('KES');

            /*
             * Optional provider response/request information.
             *
             * This is useful when investigating payment issues.
             */
            $table->jsonb('metadata')
                ->nullable();

            $table->timestamps();

            /*
             * Common queries:
             *
             * "Show all transactions for this payment."
             * "Find transactions belonging to this attempt."
             */
            $table->index([
                'payment_id',
                'created_at',
            ]);

            $table->index([
                'payment_attempt_id',
                'created_at',
            ]);

            /*
             * Provider references are useful for reconciliation.
             */
            $table->index('provider_reference');
        });
    }

    /**
     * Reverse the migrations.
     */
    /**
     * Remove the payment transactions table.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_transactions');
    }
};
