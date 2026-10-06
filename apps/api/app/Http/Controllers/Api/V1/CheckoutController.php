<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CheckoutRequest;
use App\Http\Resources\OrderResource;
use App\Services\CartService;
use App\Services\CheckoutService;
use Illuminate\Http\Request;
class CheckoutController extends Controller
{

    public function __construct(
        private readonly CartService $cartService,
        private readOnly CheckoutService $checkoutService
    ){}

    public function store(CheckoutRequest $request):OrderResource
    {
        $cart = $this->cartService->getOrCreateCart(

            $request->user()->id
        );

        $order = $this->checkoutService->checkout($cart,
        $request->validated());

        return new OrderResource($order);
    }
}
