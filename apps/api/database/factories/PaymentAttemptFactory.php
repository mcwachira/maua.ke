<?php

namespace Database\Factories;

use App\Enums\PaymentAttemptStatus;
use App\Enums\PaymentProvider;
use App\Models\Payment;
use App\Models\PaymentAttempt;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PaymentAttempt>
 */
class PaymentAttemptFactory extends Factory
{
    protected $model = PaymentAttempt::class;

    public function definition(): array
    {
        return [
            'payment_id' => Payment::factory(),

            'attempt_number' => 1,

            'provider' => PaymentProvider::Mpesa,

            'provider_reference' => null,

            'amount_minor' => 400000,

            'status' => PaymentAttemptStatus::Pending,

            'request_payload' => null,

            'response_payload' => null,

            'failure_code' => null,

            'failure_message' => null,

            'started_at' => null,

            'completed_at' => null,
        ];
    }
}
