<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Inventory;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class CartTest extends TestCase
{
   use RefreshDatabase;
   private User $user;
   private ProductVariant $variant;
   private Inventory $inventory;

   protected function setUp(): void
   {
       parent::setUp();

       $this->user = User::factory()->create();
       $product = Product::factory()->create();

       $this->variant = ProductVariant::factory()->create([
           'product_id' => $product->id,
           'is_active' => true,
           'price_minor' => 350000,
           'currency' => 'KES',
       ]);


       $this->inventory = Inventory::factory()->create([
           'product_variant_id' => $this->variant->id,
           'on_hand_quantity' => 10,
           'reserve_quantity' => 0,


       ]);
       Sanctum::actingAs($this->user);
   }
       public function test_authenticated_user_can_view_their_cart(): void
   {
       $response = $this->getJson('/api/v1/cart');

       $response->assertOk()
           ->assertJsonPath('data.status', 'active')
           ->assertJsonPath('data.total_price_minor', 0);
   }

   public function test_authenticated_user_can_add_to_cart(): void
   {
       $response = $this->postJson('/api/v1/cart/items', [
           'product_variant_id' => $this->variant->id,
           'quantity' => 2,
       ]);
       $response->assertOk()->assertJsonPath('data.items.0.quantity', 2)
           ->assertJsonPath('data.items.0.price_minor', 350000)
           ->assertJsonPath('data.total_price_minor', 700000);
       $this->assertDatabaseHas('cart_items', [
           'product_variant_id' => $this->variant->id,
           'quantity' => 2,
           'price_minor' => 350000,
       ]);
   }

   public function test_adding_existing_variant_increases_quantity(): void
   {

       $this->postJson('/api/v1/cart/items', [
           'product_variant_id' => $this->variant->id,
           'quantity' => 2,
       ]);

       $this->postJson('/api/v1/cart/items', [
           'product_variant_id' => $this->variant->id,
           'quantity' => 3,
       ]);

       $this->assertDatabaseHas('cart_items', [
           'product_variant_id' => $this->variant->id,
           'quantity' => 5,
       ]);

       $this->assertDatabaseCount('cart_items', 1);
   }


    public function test_user_cannot_add_more_than_available_stock(): void
    {
        $response = $this->postJson('/api/v1/cart/items', [
            'product_variant_id' => $this->variant->id,
            'quantity' => 11,
        ]);

        $response->assertUnprocessable();

        $this->assertDatabaseCount('cart_items', 0);
    }

    public function test_user_cannot_add_inactive_variant(): void
    {
        $this->variant->update([
            'is_active' => false,
        ]);

        $response = $this->postJson('/api/v1/cart/items', [
            'product_variant_id' => $this->variant->id,
            'quantity' => 1,
        ]);

        $response->assertUnprocessable();

        $this->assertDatabaseCount('cart_items', 0);
    }

    public function test_user_can_update_cart_item_quantity(): void
    {
        $cart = Cart::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'active',
        ]);

        $item = CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_variant_id' => $this->variant->id,
            'quantity' => 2,
            'price_minor' => 350000,
            'currency' => 'KES',
        ]);

        $response = $this->patchJson(
            "/api/v1/cart/items/{$item->id}",
            ['quantity' => 4]
        );

        $response->assertOk()
            ->assertJsonPath('data.items.0.quantity', 4)
            ->assertJsonPath('data.total_price_minor', 1400000);
    }

    public function test_user_can_remove_cart_item(): void
    {
        $cart = Cart::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'active',
        ]);

        $item = CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_variant_id' => $this->variant->id,
        ]);

        $response = $this->deleteJson(
            "/api/v1/cart/items/{$item->id}"
        );

        $response->assertNoContent();

        $this->assertDatabaseMissing('cart_items', [
            'id' => $item->id,
        ]);
    }

    public function test_user_cannot_modify_another_users_cart_item(): void
    {
        $anotherUser = User::factory()->create();

        $anotherCart = Cart::factory()->create([
            'user_id' => $anotherUser->id,
            'status' => 'active',
        ]);

        $item = CartItem::factory()->create([
            'cart_id' => $anotherCart->id,
            'product_variant_id' => $this->variant->id,
        ]);

        $response = $this->patchJson(
            "/api/v1/cart/items/{$item->id}",
            ['quantity' => 3]
        );

        $response->assertNotFound();

        $this->assertDatabaseHas('cart_items', [
            'id' => $item->id,
            'quantity' => 1,
        ]);
    }

    public function test_user_cannot_add_invalid_quantity(): void
    {
        $response = $this->postJson('/api/v1/cart/items', [
            'product_variant_id' => $this->variant->id,
            'quantity' => 0,
        ]);

        $response->assertUnprocessable();
    }
}
