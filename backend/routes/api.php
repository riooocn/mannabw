<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/products', [App\Http\Controllers\Api\ProductController::class, 'index']);
Route::get('/products/{slug}', [App\Http\Controllers\Api\ProductController::class, 'show']);
Route::get('/lookbook', [App\Http\Controllers\Api\LookbookController::class, 'index']);
