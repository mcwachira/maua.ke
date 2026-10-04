<?php

namespace Database\Factories;

use App\Models\Inventory;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Inventory>
 */
class InventoryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'product_variant_id' => ProductVariant::factory(),

            'on_hand_quantity' => fake()->numberBetween(10, 100),

            'reserve_quantity' => 0,

            'reorder_level' => 5,
        ];
    }
}
