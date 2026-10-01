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
            'name' => fake()->randomElements([
                'small',
                'medium',
                'large',
            ]),
            'sku' => strtoupper(fake()->unique()->bothify('VAR-####??')),
            'price_minor' => fake()->numberBetween(150000, 1000000),
            'currency' => 'KES',
            'attributes' => null,
            'is_active' => true,
            'sort_order' => 0,
        ];
    }
}
