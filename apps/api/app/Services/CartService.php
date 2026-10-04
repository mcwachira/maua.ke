<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Illuminate\Validation\ValidationException;

class CartService
{

    /**
     * Get the user's active cart.
     *
     * If the user does not have an active cart yet,
     * create one.
     */

    public function getOrCreateCart(int $userId): Cart
    {

        return Cart::firstOrCreate(
            [
                'user_id' => $userId,
                'status' => 'active',
            ],
            [
                'last_activity_at' => now(),
            ]
        );
    }

    /**
     * Add a product variant to the cart.
     *
     * If the variant already exists in the cart,
     * increase its quantity instead of creating
     * another cart item.
     */

    public function addItem(
        Cart $cart,
        ProductVariant $variant,
        int $quantity = 1,
    ): CartItem {
        if($quantity < 1) {
            throw ValidationException::withMessages([
                'quantity' => 'Quantity must be at least 1.',
            ]);
        }

        if (!$variant->is_active) {
            throw ValidationException::withMessages([
                'product_variant_id' => 'This product variant is unavailable.',
            ]);
        }

        return DB::transaction(function () use ($cart, $variant, $quantity) {

            /*
             * Lock the inventory row while checking stock.
             *
             * This becomes important when multiple requests
             * try to modify the same stock at the same time.
             */

            // It prevents two simultaneous requests from both reading the same stock value and making an unsafe decision.
            $inventory = $variant->inventory()->lockForUpdate()->first();

            if (!$inventory) {
                throw ValidationException::withMessages([
                    'product_variant_id' => 'This product is currently unavailable.',
                ]);
            }


            $existingItem = $cart->items()
                ->where('product_variant_id', $variant->id)
                ->lockForUpdate()
                ->first();

            $currentQuantity = $existingItem?->quantity ?? 0;
            $newQuantity = $currentQuantity + $quantity;

            if ($newQuantity > $inventory->available_quantity) {
                throw ValidationException::withMessages([
                    'quantity' => "Only {$inventory->available_quantity} item(s) are currently available.",
                ]);
            }

            if ($existingItem) {
                $existingItem->update([
                    'quantity' => $newQuantity,
                ]);

                $item = $existingItem;
            } else {
                $item = $cart->items()->create([
                    'product_variant_id' => $variant->id,
                    'quantity' => $quantity,
                    'price_minor' => $variant->price_minor,
                    'currency' => $variant->currency,
                ]);
            }

            $cart->update([
                'last_activity_at' => now(),
            ]);

            return $item->fresh();
        });
    }

    public function updateItemQuantity(
        Cart $cart,
        CartItem $item,
        int $quantity
    ): CartItem{
        return DB::transaction(function () use ($cart, $item, $quantity) {

            //lock inventory row before checking available stock.
            $inventory = ProductVariant::query()->findOrFail($item->product_variant_id)
                ->inventory()->lockForUpdate()->first();

            if(!$inventory) {
            throw ValidationException::withMessages([
                'quantity'=>'this product is currently unavailable.',
            ]);
            }

            //make sure the item still belongs to the cart
            $cartItem = $cart->items()
                ->lockForUpdate()
                ->findOrFail($item->id);

            if ($quantity > $inventory->available_quantity) {
                throw ValidationException::withMessages([
                    'quantity' => "Only {$inventory->available_quantity} item(s) are currently available.",
                ]);
            }

            $cartItem->update([
                'quantity' => $quantity,
            ]);

            $cart->update([
                'last_activity_at' => now(),
            ]);

            return $cartItem->fresh();
        });
        }


    public function removeItem(Cart $cart, CartItem $item): void
    {
        DB::transaction(function () use ($cart, $item) {
            // Scope the deletion to the supplied cart.
            $cartItem = $cart->items()
                ->lockForUpdate()
                ->findOrFail($item->id);

            $cartItem->delete();

            $cart->update([
                'last_activity_at' => now(),
            ]);
        });
    }
}
