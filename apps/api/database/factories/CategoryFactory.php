<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = Category::class;
    public function definition(): array
    {

        $name = fake()-> unique()->words(
            fake()->numberBetween(1, 2),
            true
        );
        return [
            //
            'parent_id' => null,
            'name' => ucwords($name),
            'slug' => str()->slug($name),
            'description' => fake()->optional()->sentence(),
            'is_active' => true,
            'sort_order' => fake()->numberBetween(0, 100),

        ];
    }
}
