<?php

namespace Database\Factories;

use App\Models\Addon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Addon>
 */
class AddonFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $name ->fake() ->unique()->words(2, true);
        return [
            'name' => ucwords($name) ,
            'slug'=>str()->slug($name),
            'sku'=>strtoUpper(fake()->unique()->bothify('Addon-####??')),
            'description' => fake()->optional()->sentence(),
            'price_minor' => fake()->numberBetween(10000, 300000),
            'currency' => 'KES',
            'is_active' => true,
            'sort_order' => 0,
        ];
    }
}
