<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $categories = [
            [
                'name' => 'Flowers',
                'slug' => 'flowers',
                'description' => 'Fresh flowers and beautiful floral arrangements for every occasion.',
                'sort_order' => 1,
            ],
            [
                'name' => 'Gifts',
                'slug' => 'gifts',
                'description' => 'Thoughtful gifts for birthdays, anniversaries and special moments.',
                'sort_order' => 2,
            ],
            [
                'name' => 'Cards',
                'slug' => 'cards',
                'description' => 'Greeting cards for expressing love, appreciation and celebration.',
                'sort_order' => 3,
            ],
            [
                'name' => 'Care Packages',
                'slug' => 'care-packages',
                'description' => 'Curated care packages for meaningful moments and thoughtful surprises.',
                'sort_order' => 4,
            ],
        ];

        foreach ($categories as $category) {

            //This makes the seeder idempotent.
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }

    }
}
