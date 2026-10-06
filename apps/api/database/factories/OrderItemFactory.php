<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = OrderItem::class;
    public function definition(): array
    {

        $variant = ProductVariant::factory()->create();

        $quantity = fake()->numberBetween(1, 3);
        $unitPrice = $variant->price_minor;
        return [
            'order_id' => Order::factory(),
            'product_variant_id' => $variant->id,

            'product_name' => $variant->product->name,
            'variant_name' => $variant->name,
            'sku' => $variant->sku,

            'unit_price_minor' => $unitPrice,
            'quantity' => $quantity,
            'subtotal_minor' => $unitPrice * $quantity,

            'currency' => $variant->currency,
        ];
    }
}
