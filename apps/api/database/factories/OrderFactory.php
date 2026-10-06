<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'order_number' => 'MAU-' . fake()->unique()->bothify('########??'),
            'status' => 'pending',
            'payment_status' => 'pending',

            'subtotal_minor' => 350000,
            'delivery_fee_minor' => 50000,
            'discount_minor' => 0,
            'total_minor' => 400000,

            'currency' => 'KES',

            'customer_name' => fake()->name(),
            'customer_phone' => '07' . fake()->numerify('########'),
            'customer_email' => fake()->safeEmail(),

            'delivery_address' => [
                'address_line_1' => fake()->streetAddress(),
                'address_line_2' => null,
                'city' => 'Nairobi',
                'county' => 'Nairobi',
                'postal_code' => fake()->postcode(),
                'country' => 'Kenya',
            ],

            'customer_notes' => null,
        ];
    }
}
