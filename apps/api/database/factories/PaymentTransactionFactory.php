<?php

namespace Database\Factories;

use App\Enums\PaymentTransactionType;
use App\Models\Payment;
use App\Models\PaymentAttempt;
use App\Models\PaymentTransaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PaymentTransaction>
 */
class PaymentTransactionFactory extends Factory
{
    protected $model = PaymentTransaction::class;

    public function definition(): array
    {
        return [
            'payment_id' => Payment::factory(),

            /*
             * The attempt is optional because some transactions
             * may be associated with the overall payment rather
             * than a particular retry attempt.
             */
            'payment_attempt_id' => null,

            'type' => PaymentTransactionType::Initiated,

            'provider_reference' => null,

            'amount_minor' => 400000,

            'currency' => 'KES',

            'metadata' => null,
        ];
    }
}
