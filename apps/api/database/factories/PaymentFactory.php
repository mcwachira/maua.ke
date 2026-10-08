<?php

namespace Database\Factories;


use App\Enums\PaymentMethod;
use App\Enums\PaymentProvider;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;


/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'reference' => 'PAY-' . strtoupper( Str::random(12) ),
            'amount_minor'=>4000,
            'currency'=> 'KES',
            'status'=>PaymentStatus::Pending,
            'method'=>PaymentMethod::Mpesa,
            'provider'=>PaymentProvider::Mpesa,
            'paid_at'=> null,
            'expires_at' => now()->addMinutes(15),
        ];
    }
}
