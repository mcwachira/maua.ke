<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductVariant>
 */
class ProductVariantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'name' => fake()->randomElement([
                '12 Roses',
                '24 Roses',
                '36 Roses',
            ]),
            'sku' => fake()->unique()->bothify('VAR-####??'),
            'price_minor' => 350000,
            'currency' => 'KES',

            // PHP array; Eloquent converts it to JSON.
            'attributes' => [
                'rose_count' => 12,
            ],

            'is_active' => true,
            'sort_order' => 0,
        ];
    }
}
