<?php

namespace Database\Seeders;

use App\Models\Inventory;
use App\Models\ProductVariant;
use Database\Factories\ProductVariantFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ProductVariant::all()->each(function (ProductVariant $variant) {

            Inventory::factory()->create([
                'product_variant_id' => $variant->id,
            ]);
        });
    }
}
