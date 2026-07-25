<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ShippingController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);

    Route::apiResource('addresses', App\Http\Controllers\Api\AddressController::class);
    Route::post('/addresses/{address}/set-default', [App\Http\Controllers\Api\AddressController::class, 'setAsDefault']);

    // Cart
    Route::get('/cart', [App\Http\Controllers\Api\CartController::class, 'index']);
    Route::post('/cart/add', [App\Http\Controllers\Api\CartController::class, 'add']);
    Route::put('/cart/update/{id}', [App\Http\Controllers\Api\CartController::class, 'update']);
    Route::delete('/cart/remove/{id}', [App\Http\Controllers\Api\CartController::class, 'remove']);
    // Checkout & Orders
    Route::post('/shipping/rates', [App\Http\Controllers\Api\ShippingController::class, 'rates']);
    Route::post('/checkout', [App\Http\Controllers\Api\CheckoutController::class, 'placeOrder']);
    Route::get('/orders', [App\Http\Controllers\Api\OrderController::class, 'index']);
    Route::put('/orders/{id}/cancel', [App\Http\Controllers\Api\OrderController::class, 'cancel']);
    Route::put('/orders/{id}/complete', [App\Http\Controllers\Api\OrderController::class, 'complete']);
});

Route::post('/register', [App\Http\Controllers\Api\AuthController::class, 'register']);
Route::post('/login', [App\Http\Controllers\Api\AuthController::class, 'login']);

// Midtrans Webhook (Must be outside auth middleware)
Route::post('/midtrans/webhook', [\App\Http\Controllers\Api\MidtransController::class, 'notification']);

Route::get('/products', [App\Http\Controllers\Api\ProductController::class, 'index']);
Route::get('/products/{slug}', [App\Http\Controllers\Api\ProductController::class, 'show']);
Route::get('/lookbook', [App\Http\Controllers\Api\LookbookController::class, 'index']);

Route::get('/shipping/locations', [App\Http\Controllers\Api\ShippingController::class, 'locations']);

// (Temporary setup routes removed for security)
