<?php

namespace Tests\Feature\Orders;

use App\Http\Controllers\Api\V1\CheckoutController;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Inventory;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Services\CheckoutService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Cart $cart;
    private Product $product;
    private ProductVariant $variant;
    private Inventory $inventory;


    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();

        $this->product = Product::factory()->create([
            'name' => 'Premium Flower Bouquet',
        ]);


        $this->variant = ProductVariant::factory()->create([
            'product_id' => $this->product->id,
            'name' => 'Standard',
            'sku' => 'FLOWER-STD',
            'price_minor' => 350000,
            'currency' => 'KES',
            'is_active' => true,
        ]);

        $this->inventory = Inventory::factory()->create([
            'product_variant_id' => $this->variant->id,
            'on_hand_quantity' => 10,
            'reserve_quantity' => 0,
        ]);

        $this->cart = Cart::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'active',
        ]);

        CartItem::factory()->create([
            'cart_id' => $this->cart->id,
            'product_variant_id' => $this->variant->id,
            'quantity' => 2,
            'price_minor' => 350000,
            'currency' => 'KES',
        ]);

        Sanctum::actingAs($this->user);
    }

    private function checkoutData(): array
    {
        return [
            'customer_name' => 'Charles Wachira',
            'customer_phone' => '0712345678',
            'customer_email' => 'charles@example.com',

            'delivery_address' => [
                'address_line_1' => 'Moi Avenue',
                'address_line_2' => null,
                'city' => 'Nairobi',
                'county' => 'Nairobi',
                'postal_code' => '00100',
                'country' => 'Kenya',
            ],

            'customer_notes' => 'Please call before delivery.',
        ];
    }

    public function test_checkout_creates_order(): void
    {
        $response = $this->postJson(
            '/api/v1/checkout',
            $this->checkoutData()
        );



        $response
            ->assertOk()
            ->assertJsonPath('data.status', 'pending')
            ->assertJsonPath('data.payment_status', 'pending')
            ->assertJsonPath('data.currency', 'KES');

        $this->assertDatabaseHas('orders', [
            'user_id' => $this->user->id,
            'status' => 'pending',
            'payment_status' => 'pending',
            'subtotal_minor' => 700000,
            'delivery_fee_minor' => 50000,
            'discount_minor' => 0,
            'total_minor' => 750000,
            'currency' => 'KES',
        ]);
    }

    public function test_checkout_creates_order_items(): void
    {
        $response = $this->postJson(
            '/api/v1/checkout',
            $this->checkoutData()
        );

        $response->assertOk();

        $this->assertDatabaseHas('order_items', [
            'product_variant_id' => $this->variant->id,
            'product_name' => 'Premium Flower Bouquet',
            'variant_name' => 'Standard',
            'sku' => 'FLOWER-STD',
            'unit_price_minor' => 350000,
            'quantity' => 2,
            'subtotal_minor' => 700000,
            'currency' => 'KES',
        ]);
    }

    public function test_checkout_snapshots_product_information_and_price(): void
    {
        $response = $this->postJson(
            '/api/v1/checkout',
            $this->checkoutData()
        );

        $response->assertOk();

        $orderItemId = $response->json('data.items.0.id');

        $this->variant->update([
            'name' => 'Updated Variant',
            'sku' => 'UPDATED-SKU',
            'price_minor' => 500000,
        ]);

        $this->product->update([
            'name' => 'Updated Product Name',
        ]);

        $orderItem = \App\Models\OrderItem::findOrFail($orderItemId);

        $this->assertSame(
            'Premium Flower Bouquet',
            $orderItem->product_name
        );

        $this->assertSame(
            'Standard',
            $orderItem->variant_name
        );

        $this->assertSame(
            'FLOWER-STD',
            $orderItem->sku
        );

        $this->assertSame(
            350000,
            $orderItem->unit_price_minor
        );
    }

    public function test_checkout_reserves_inventory(): void
    {
        $this->postJson(
            '/api/v1/checkout',
            $this->checkoutData()
        )->assertOk();

        $this->inventory->refresh();

        $this->assertSame(10, $this->inventory->on_hand_quantity);
        $this->assertSame(2, $this->inventory->reserve_quantity);
        $this->assertSame(8, $this->inventory->available_quantity);
    }

    public function test_checkout_converts_cart(): void
    {
        $this->postJson(
            '/api/v1/checkout',
            $this->checkoutData()
        )->assertOk();

        $this->cart->refresh();

        $this->assertSame('converted', $this->cart->status);
    }

    public function test_checkout_preserves_customer_information(): void
    {
        $this->postJson(
            '/api/v1/checkout',
            $this->checkoutData()
        )->assertOk();

        $this->assertDatabaseHas('orders', [
            'user_id' => $this->user->id,
            'customer_name' => 'Charles Wachira',
            'customer_phone' => '0712345678',
            'customer_email' => 'charles@example.com',
            'customer_notes' => 'Please call before delivery.',
        ]);
    }

    public function test_checkout_rejects_empty_cart(): void
    {
        $this->cart->items()->delete();

        $response = $this->postJson(
            '/api/v1/checkout',
            $this->checkoutData()
        );

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors('cart');

        $this->assertDatabaseCount('orders', 0);

        $this->inventory->refresh();

        $this->assertSame(0, $this->inventory->reserve_quantity);

        $this->cart->refresh();

        $this->assertSame('active', $this->cart->status);
    }

    public function test_checkout_rejects_insufficient_inventory(): void
    {
        $this->inventory->update([
            'on_hand_quantity' => 1,
        ]);

        $response = $this->postJson(
            '/api/v1/checkout',
            $this->checkoutData()
        );

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors('cart');

        $this->assertDatabaseCount('orders', 0);

        $this->inventory->refresh();

        $this->assertSame(0, $this->inventory->reserve_quantity);

        $this->cart->refresh();

        $this->assertSame('active', $this->cart->status);
    }

    public function test_checkout_rejects_inactive_variant(): void
    {
        $this->variant->update([
            'is_active' => false,
        ]);

        $response = $this->postJson(
            '/api/v1/checkout',
            $this->checkoutData()
        );

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors('cart');

        $this->assertDatabaseCount('orders', 0);

        $this->inventory->refresh();

        $this->assertSame(0, $this->inventory->reserve_quantity);

        $this->cart->refresh();

        $this->assertSame('active', $this->cart->status);
    }

    public function test_user_cannot_checkout_another_users_cart(): void
    {
        $otherUser = User::factory()->create();

        $otherCart = Cart::factory()->create([
            'user_id' => $otherUser->id,
            'status' => 'active',
        ]);

        CartItem::factory()->create([
            'cart_id' => $otherCart->id,
            'product_variant_id' => $this->variant->id,
            'quantity' => 1,
            'price_minor' => $this->variant->price_minor,
            'currency' => 'KES',
        ]);

        /*
         * The checkout endpoint always resolves the authenticated
         * user's active cart. It never accepts a cart ID from the
         * client.
         */
        $response = $this->postJson(
            '/api/v1/checkout',
            $this->checkoutData()
        );



        $response->assertOk();

        $this->assertDatabaseHas('orders', [
            'user_id' => $this->user->id,
        ]);

        $this->assertDatabaseMissing('orders', [
            'user_id' => $otherUser->id,
        ]);

        $otherCart->refresh();

        $this->assertSame('active', $otherCart->status);
    }

    public function test_checkout_rolls_back_when_order_creation_fails(): void
    {
        $service = new class extends \App\Services\CheckoutService {
            protected function createOrder(array $attributes): \App\Models\Order
            {
                throw new \RuntimeException('Simulated order creation failure');
            }
        };

        try {
            $service->checkout(
                $this->cart,
                $this->checkoutData()
            );

            $this->fail('Expected checkout to throw an exception.');
        } catch (\RuntimeException $exception) {
            $this->assertSame(
                'Simulated order creation failure',
                $exception->getMessage()
            );
        }

        $this->assertDatabaseCount('orders', 0);
        $this->assertDatabaseCount('order_items', 0);

        $this->inventory->refresh();

        $this->assertSame(
            0,
            $this->inventory->reserve_quantity
        );

        $this->cart->refresh();

        $this->assertSame(
            'active',
            $this->cart->status
        );
    }

    public function test_converted_cart_cannot_be_checked_out_again(): void
    {
        $this->postJson(
            '/api/v1/checkout',
            $this->checkoutData()
        )->assertOk();

        $response = $this->postJson(
            '/api/v1/checkout',
            $this->checkoutData()
        );

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors('cart');

        $this->assertDatabaseCount('orders', 1);
    }

    public function test_checkout_requires_customer_and_delivery_information(): void
    {
        $response = $this->postJson(
            '/api/v1/checkout',
            []
        );

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors([
                'customer_name',
                'customer_phone',
                'delivery_address',
            ]);

        $this->assertDatabaseCount('orders', 0);
    }

    public function test_checkout_requires_required_delivery_address_fields(): void
    {
        $data = $this->checkoutData();

        unset(
            $data['delivery_address']['address_line_1'],
            $data['delivery_address']['city'],
            $data['delivery_address']['county'],
            $data['delivery_address']['country']
        );

        $response = $this->postJson(
            '/api/v1/checkout',
            $data
        );

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors([
                'delivery_address.address_line_1',
                'delivery_address.city',
                'delivery_address.county',
                'delivery_address.country',
            ]);

        $this->assertDatabaseCount('orders', 0);
    }

    public function test_checkout_handles_multiple_cart_items(): void
    {
        $secondProduct = Product::factory()->create([
            'name' => 'Gift Card',
        ]);

        $secondVariant = ProductVariant::factory()->create([
            'product_id' => $secondProduct->id,
            'name' => 'KES 1000',
            'sku' => 'GIFT-1000',
            'price_minor' => 100000,
            'currency' => 'KES',
            'is_active' => true,
        ]);

        Inventory::factory()->create([
            'product_variant_id' => $secondVariant->id,
            'on_hand_quantity' => 5,
            'reserve_quantity' => 0,
        ]);

        CartItem::factory()->create([
            'cart_id' => $this->cart->id,
            'product_variant_id' => $secondVariant->id,
            'quantity' => 1,
            'price_minor' => 100000,
            'currency' => 'KES',
        ]);

        $response = $this->postJson(
            '/api/v1/checkout',
            $this->checkoutData()
        );

        $response
            ->assertOk()
            ->assertJsonCount(2, 'data.items');

        $this->assertDatabaseCount('order_items', 2);

        $this->assertDatabaseHas('order_items', [
            'product_variant_id' => $this->variant->id,
            'quantity' => 2,
            'subtotal_minor' => 700000,
        ]);

        $this->assertDatabaseHas('order_items', [
            'product_variant_id' => $secondVariant->id,
            'quantity' => 1,
            'subtotal_minor' => 100000,
        ]);

        $this->assertDatabaseHas('orders', [
            'subtotal_minor' => 800000,
            'delivery_fee_minor' => 50000,
            'total_minor' => 850000,
        ]);
    }
}
