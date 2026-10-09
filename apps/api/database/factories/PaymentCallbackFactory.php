<?php

namespace Database\Factories;

use App\Enums\PaymentProvider;
use App\Models\Payment;
use App\Models\PaymentCallback;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PaymentCallback>
 */
class PaymentCallbackFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = PaymentCallback::class;
    public function definition(): array
    {
        return [
            'payment_id' => Payment::factory(),
            'payment_attempt_id' => null,
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => fake()->uuid(),
            'event_type' => 'payment.completed',
            'payload' => [
                'result_code' => 0,
                'result_description' => 'Success',
            ],
            'headers' => [
                'content-type' => 'application/json',
            ],
            'processed' => false,
            'processed_at' => null,
            'processing_error' => null,
        ];
    }
}
