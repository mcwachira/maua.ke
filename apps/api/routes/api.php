<?php

use App\Http\Controllers\Api\V1\CartController;
use App\Http\Controllers\Api\V1\CheckoutController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')
    ->middleware('auth:sanctum')
    ->group(function () {
        Route::get('/cart', [CartController::class, 'show']);

        Route::post('/cart/items', [CartController::class, 'store']);

        Route::patch('/cart/items/{cartItem}', [
            CartController::class,
            'update',
        ]);

        Route::delete('/cart/items/{cartItem}', [
            CartController::class,
            'destroy',
        ]);

        Route::post('/checkout', [
            CheckoutController::class,
            'store',
        ]);
    });
