<?php

namespace Database\Factories;

use App\Models\Occasion;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Occasion>
 */
class OccasionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $name = fake()->unique()->words(fake() -> numberBetween(1, 2), true);
        return [
            'name' => ucwords($name),
            'slug' => str()->slug($name),
            'description' => fake()->optional()->sentence(),
            'is_active'=> true,
            'sort_order' => fake() -> numberBetween(0, 100),
        ];
    }
}
