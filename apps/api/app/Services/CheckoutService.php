<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;


class CheckoutService
{

    public function checkout(Cart $cart, array $customerData):Order{
        return DB::transaction(function () use ($cart, $customerData) {
            // Lock the cart so another checkout cannot process it
            // simultaneously.
            $cart = Cart::query()
                ->whereKey($cart->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($cart->status !== 'active') {
                throw ValidationException::withMessages([
                    'cart' => 'This cart is no longer available for checkout.',
                ]);
            }

            // Load all cart items and their related product data.
            $cart->load([
                'items.productVariant.product',
            ]);

            if ($cart->items->isEmpty()) {
                throw ValidationException::withMessages([
                    'cart' => 'Your cart is empty.',
                ]);
            }

            /*
             * Lock every inventory row involved in the checkout.
             *
             * This is critical for preventing two customers from
             * purchasing the same final units simultaneously.
             */
            $inventoryRecords = [];

            foreach ($cart->items as $cartItem) {
                $variant = $cartItem->productVariant;

                if (!$variant || !$variant->is_active) {
                    throw ValidationException::withMessages([
                        'cart' => 'One or more products in your cart are no longer available.',
                    ]);
                }

                $inventory = $variant->inventory()
                    ->lockForUpdate()
                    ->first();

                if (!$inventory) {
                    throw ValidationException::withMessages([
                        'cart' => "Inventory is unavailable for {$variant->name}.",
                    ]);
                }

                if ($cartItem->quantity > $inventory->available_quantity) {
                    throw ValidationException::withMessages([
                        'cart' => "Only {$inventory->available_quantity} item(s) of {$variant->name} are available.",
                    ]);
                }

                $inventoryRecords[$cartItem->id] = $inventory;
            }

            /*
            * Calculate totals from the cart item price snapshots.
            *
            * Cart items already contain the price captured when the
            * item was added to the cart.
            */
            $subtotalMinor = $cart->items->sum(
                fn ($item) => $item->price_minor * $item->quantity
            );

            $deliveryFeeMinor = $this->calculateDeliveryFee(
                $customerData['delivery_address']
            );

            $discountMinor = 0;

            $totalMinor =
                $subtotalMinor
                + $deliveryFeeMinor
                - $discountMinor;

            /*
    * Generate the order attributes.
    *
    * The actual database creation is delegated to createOrder()
    * so the transaction boundary can be tested independently.
    */

            $order = $this->createOrder([
                'user_id' => $cart->user_id,
                'order_number' => $this->generateOrderNumber(),

                'status' => 'pending',
                'payment_status' => 'pending',

                'subtotal_minor' => $subtotalMinor,
                'delivery_fee_minor' => $deliveryFeeMinor,
                'discount_minor' => $discountMinor,
                'total_minor' => $totalMinor,

                'currency' => 'KES',

                'customer_name' => $customerData['customer_name'],
                'customer_phone' => $customerData['customer_phone'],
                'customer_email' => $customerData['customer_email'] ?? null,

                'delivery_address' => $customerData['delivery_address'],

                'customer_notes' => $customerData['customer_notes'] ?? null,
            ]);
            /*
                * Create immutable order item snapshots.
                */
            foreach ($cart->items as $cartItem) {
                $variant = $cartItem->productVariant;
                $product = $variant->product;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_variant_id' => $variant->id,

                    'product_name' => $product->name,
                    'variant_name' => $variant->name,
                    'sku' => $variant->sku,

                    'unit_price_minor' => $cartItem->price_minor,
                    'quantity' => $cartItem->quantity,

                    'subtotal_minor' =>
                        $cartItem->price_minor * $cartItem->quantity,

                    'currency' => $cartItem->currency,
                ]);

                /*
                 * Reserve inventory only after all validation has
                 * succeeded.
                 */
                $inventory = $inventoryRecords[$cartItem->id];

                $inventory->increment(
                    'reserve_quantity',
                    $cartItem->quantity
                );
            }

            /*
             * The cart has now successfully become an order.
             */
            $cart->update([
                'status' => 'converted',
                'last_activity_at' => now(),
            ]);

            return $order->fresh([
                'items',
                'user',
            ]);
        });
    }

    protected function createOrder(array $attributes): Order
    {
        return Order::create($attributes);
    }

    private function generateOrderNumber(): string
    {
        do {
            $number = 'MAU-' .
                now()->format('Ymd') .
                '-' .
                strtoupper(Str::random(6));
        } while (
            Order::query()
                ->where('order_number', $number)
                ->exists()
        );

        return $number;
    }

    private function calculateDeliveryFee(array $address): int
    {
        /*
         * Initial implementation.
         *
         * We can replace this later with a proper delivery-zone
         * calculation without changing the checkout transaction.
         */
        return 50000;
    }
}
