<?php

namespace App\Http\Controllers\Api\V1;


use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\AddCartItemRequest;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Http\Resources\CartResource;
use App\Models\CartItem;
use App\Models\ProductVariant;
use App\Services\CartService;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function __construct(
        private readonly CartService $cartService
    ) {}


    /**
     * Display the authenticated customer's active cart.
     */
    public function show(Request $request): CartResource
{
    $cart = $this->cartService->getOrCreateCart($request->user() -> id);

      $cart->load('items.productVariant.product');

        return new CartResource($cart);

}


    /**
     * Add a product variant to the cart.
     */

    public function store(AddCartItemRequest $request): CartResource
    {
        $cart = $this->cartService->getOrCreateCart(
            $request->user()->id
        );

        $variant = ProductVariant::findOrFail(
            $request->validated('product_variant_id')
        );

        $this->cartService->addItem(
            $cart,
            $variant,
            $request->validated('quantity')
        );

        $cart->load('items.productVariant.product');

        return new CartResource($cart);
    }

    /**
     * Update the quantity of an existing cart item.
     */
    public function update(
        UpdateCartItemRequest $request,
        CartItem $cartItem
    ): CartResource {
        $cart = $this->cartService->getOrCreateCart(
            $request->user()->id
        );

        $this->cartService->updateItemQuantity(
            $cart,
            $cartItem,
            $request->validated('quantity')
        );

        $cart->load('items.productVariant.product');

        return new CartResource($cart);
    }

    /**
     * Remove an item from the cart.
     */
    public function destroy(
        Request $request,
        CartItem $cartItem
    ) {
        $cart = $this->cartService->getOrCreateCart(
            $request->user()->id
        );

        $this->cartService->removeItem($cart, $cartItem);

        return response()->noContent();
    }
}
