<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\SocialiteController;
use Illuminate\Http\Request;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

Route::get('/auth/google', [SocialiteController::class, 'redirect'])->name('google.login');
Route::get('/auth/google/callback', [SocialiteController::class, 'callback'])->name('google.callback');

Route::middleware(['auth:sanctum'])->post('/profile/complete', function(Request $request) {
    $request->validate([
        'phone_number' => 'required|string|max:20',
        'address' => 'required|string|max:500',
    ]);
    
    $user = $request->user();
    $user->update([
        'phone_number' => $request->phone_number,
        'address' => $request->address,
        'city_id' => $request->city_id ?? null,
        'province_id' => $request->province_id ?? null,
        'postal_code' => $request->postal_code ?? null,
    ]);
    
    return response()->json([
        'message' => 'Profile completed successfully',
        'user' => $user
    ]);
});

require __DIR__.'/auth.php';
