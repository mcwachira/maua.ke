<?php

namespace Tests\Feature\Orders;

use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_order_belongs_to_user():void
    {
        $user = User::factory()->create();

        $order = Order::factory()->create(['user_id' => $user->id]);
        $this->assertTrue($order->user->is($user));
    }

    public function test_order_has_many_order_items():void
    {
        $order = Order::factory()->create();

        OrderItem::factory()->count(2)->create(['order_id' => $order->id]);
        $this->assertCount(2, $order->items);
    }

    public function test_order_item_belongs_to_order(): void
    {
        $order = Order::factory()->create();

        $item = OrderItem::factory()->create([
            'order_id' => $order->id,
        ]);

        $this->assertTrue($item->order->is($order));
    }

    public function test_order_item_belongs_to_product_variant(): void
    {
        $product = Product::factory()->create();

        $variant = ProductVariant::factory()->create([
            'product_id' => $product->id,
        ]);

        $item = OrderItem::factory()->create([
            'product_variant_id' => $variant->id,
        ]);

        $this->assertTrue(
            $item->productVariant->is($variant)
        );
    }


    public function test_user_has_many_orders(): void
    {
        $user = User::factory()->create();

        Order::factory()
            ->count(3)
            ->create([
                'user_id' => $user->id,
            ]);

        $this->assertCount(3, $user->orders);
    }

    public function test_order_stores_delivery_address_as_array(): void
    {
        $order = Order::factory()->create([
            'delivery_address' => [
                'address_line_1' => '123 Kenyatta Avenue',
                'city' => 'Nairobi',
                'county' => 'Nairobi',
                'country' => 'Kenya',
            ],
        ]);

        $this->assertIsArray($order->delivery_address);
        $this->assertSame(
            'Nairobi',
            $order->delivery_address['city']
        );
    }

    public function test_order_stores_money_as_integer_minor_units(): void
    {
        $order = Order::factory()->create([
            'subtotal_minor' => 350000,
            'delivery_fee_minor' => 50000,
            'discount_minor' => 10000,
            'total_minor' => 390000,
        ]);

        $this->assertIsInt($order->subtotal_minor);
        $this->assertIsInt($order->delivery_fee_minor);
        $this->assertIsInt($order->discount_minor);
        $this->assertIsInt($order->total_minor);

        $this->assertSame(390000, $order->total_minor);
    }

    public function test_order_item_preserves_price_snapshot(): void
    {
        $product = Product::factory()->create([
            'name' => 'Red Roses',
        ]);

        $variant = ProductVariant::factory()->create([
            'product_id' => $product->id,
            'name' => '12 Roses',
            'sku' => 'ROSES-12',
            'price_minor' => 350000,
        ]);

        $item = OrderItem::factory()->create([
            'product_variant_id' => $variant->id,
            'product_name' => 'Red Roses',
            'variant_name' => '12 Roses',
            'sku' => 'ROSES-12',
            'unit_price_minor' => 350000,
        ]);

        $variant->update([
            'price_minor' => 400000,
        ]);

        $item->refresh();

        $this->assertSame(350000, $item->unit_price_minor);
        $this->assertSame(400000, $item->productVariant->price_minor);
    }
}
