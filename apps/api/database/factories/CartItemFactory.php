<?php

namespace Database\Factories;

use App\Models\CartItem;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\ProductVariant;
use App\Models\Cart;

/**
 * @extends Factory<CartItem>
 */
class CartItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $variant = ProductVariant::factory()->create();

        return [
            'cart_id' => Cart::factory(),
            'product_variant_id' => $variant->id,
            'quantity' => 1,
            'price_minor' => $variant->price_minor,
            'currency' => $variant->currency,
        ];
    }
}

