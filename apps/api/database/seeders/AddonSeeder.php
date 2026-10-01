<?php

namespace Database\Seeders;

use App\Models\Addon;
use App\Models\Product;
use Illuminate\Database\Seeder;

class AddonSeeder extends Seeder
{
    public function run(): void
    {
        $addons = [
            [
                'name' => 'Premium Chocolate Box',
                'slug' => 'premium-chocolate-box',
                'sku' => 'ADDON-CHOCOLATE-01',
                'description' => 'A premium box of chocolates.',
                'price_minor' => 120000,
                'currency' => 'KES',
                'sort_order' => 1,
            ],
            [
                'name' => 'Teddy Bear',
                'slug' => 'teddy-bear',
                'sku' => 'ADDON-TEDDY-01',
                'description' => 'A soft teddy bear gift.',
                'price_minor' => 150000,
                'currency' => 'KES',
                'sort_order' => 2,
            ],
            [
                'name' => 'Greeting Card',
                'slug' => 'greeting-card',
                'sku' => 'ADDON-CARD-01',
                'description' => 'A greeting card for a personal message.',
                'price_minor' => 30000,
                'currency' => 'KES',
                'sort_order' => 3,
            ],
            [
                'name' => 'Birthday Balloon',
                'slug' => 'birthday-balloon',
                'sku' => 'ADDON-BALLOON-01',
                'description' => 'A decorative birthday balloon.',
                'price_minor' => 50000,
                'currency' => 'KES',
                'sort_order' => 4,
            ],
            [
                'name' => 'Premium Flower Vase',
                'slug' => 'premium-flower-vase',
                'sku' => 'ADDON-VASE-01',
                'description' => 'A premium vase for displaying flowers.',
                'price_minor' => 100000,
                'currency' => 'KES',
                'sort_order' => 5,
            ],
        ];

        foreach ($addons as $data) {

            //updateOrCreate() makes the add-on records safe to seed repeatedly.
            Addon::updateOrCreate(
                ['slug' => $data['slug']],
                $data
            );
        }

        // Assign selected add-ons to our development product.
        $product = Product::where(
            'slug',
            'premium-red-rose-bouquet'
        )->first();

        if ($product) {
            $chocolate = Addon::where(
                'slug',
                'premium-chocolate-box'
            )->first();

            $teddy = Addon::where(
                'slug',
                'teddy-bear'
            )->first();

            $card = Addon::where(
                'slug',
                'greeting-card'
            )->first();

            $product->addons()->syncWithoutDetaching([
                $chocolate->id => [
                    'price_minor' => null,
                    'is_required' => false,
                    'max_quantity' => 1,
                    'sort_order' => 1,
                ],
                $teddy->id => [
                    'price_minor' => 130000,
                    'is_required' => false,
                    'max_quantity' => 2,
                    'sort_order' => 2,
                ],
                $card->id => [
                    'price_minor' => null,
                    'is_required' => false,
                    'max_quantity' => 1,
                    'sort_order' => 3,
                ],
            ]);
        }
    }
}
