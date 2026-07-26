<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cart = $request->user()->cart()->with(['items.productVariant.product'])->firstOrCreate();
        return response()->json($this->formatCartImages($cart));
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_variant_id' => 'required|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $request->user()->cart()->firstOrCreate();
        $variant = ProductVariant::findOrFail($request->product_variant_id);

        if ($variant->stock < $request->quantity) {
            return response()->json(['message' => 'Not enough stock'], 400);
        }

        $cartItem = $cart->items()->where('product_variant_id', $variant->id)->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $request->quantity;
            if ($variant->stock < $newQuantity) {
                return response()->json(['message' => 'Not enough stock'], 400);
            }
            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            $cart->items()->create([
                'product_variant_id' => $variant->id,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json($this->formatCartImages($cart->load(['items.productVariant.product'])));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $request->user()->cart;
        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }

        $cartItem = $cart->items()->where('id', $id)->firstOrFail();
        
        if ($cartItem->productVariant->stock < $request->quantity) {
            return response()->json(['message' => 'Not enough stock'], 400);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return response()->json($this->formatCartImages($cart->load(['items.productVariant.product'])));
    }

    public function remove(Request $request, $id)
    {
        $cart = $request->user()->cart;
        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }

        $cart->items()->where('id', $id)->delete();

        return response()->json($this->formatCartImages($cart->load(['items.productVariant.product'])));
    }

    private function formatCartImages($cart)
    {
        if ($cart && $cart->items) {
            $cart->items->transform(function ($item) {
                if ($item->productVariant && $item->productVariant->product) {
                    $product = $item->productVariant->product;
                    if ($product->images && is_array($product->images)) {
                        $product->images = array_map(function ($image) {
                            return str_starts_with($image, 'http') ? $image : \Illuminate\Support\Facades\Storage::url($image);
                        }, $product->images);
                    }
                }
                return $item;
            });
        }
        return $cart;
    }
}
