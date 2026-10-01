<?php

namespace Database\Seeders;

use App\Models\Occasion;
use Illuminate\Database\Seeder;

class OccasionSeeder extends Seeder
{
    public function run(): void
    {
        $occasions = [
            [
                'name' => "Birthday",
                'slug' => 'birthday',
                'description' => 'Thoughtful gifts and flowers for celebrating birthdays.',
                'sort_order' => 1,
            ],
            [
                'name' => 'Anniversary',
                'slug' => 'anniversary',
                'description' => 'Flowers and gifts for celebrating meaningful anniversaries.',
                'sort_order' => 2,
            ],
            [
                'name' => "Valentine's Day",
                'slug' => 'valentines-day',
                'description' => 'Romantic flowers and gifts for Valentine’s Day.',
                'sort_order' => 3,
            ],
            [
                'name' => 'Congratulations',
                'slug' => 'congratulations',
                'description' => 'Celebrate achievements and special milestones.',
                'sort_order' => 4,
            ],
            [
                'name' => 'Thank You',
                'slug' => 'thank-you',
                'description' => 'Thoughtful gifts for showing appreciation.',
                'sort_order' => 5,
            ],
            [
                'name' => 'Get Well Soon',
                'slug' => 'get-well-soon',
                'description' => 'Flowers and care packages for wishing someone well.',
                'sort_order' => 6,
            ],
        ];

        foreach ($occasions as $occasion) {
            //This makes the seeder idempotent.
            Occasion::updateOrCreate(
                ['slug' => $occasion['slug']],
                $occasion
            );
        }
    }
}
