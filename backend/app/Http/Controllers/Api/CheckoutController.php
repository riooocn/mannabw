<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function placeOrder(Request $request)
    {
        $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'courier' => 'nullable|string',
            'courier_service' => 'nullable|string',
            'shipping_cost' => 'nullable|numeric|min:0',
        ]);

        $user = $request->user();
        $cart = $user->cart()->with('items.productVariant.product')->first();

        if (!$cart || $cart->items->count() === 0) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        try {
            DB::beginTransaction();

            $subtotal = 0;

            // Create Order
            $order = Order::create([
                'user_id' => $user->id,
                'address_id' => $request->address_id,
                'subtotal' => 0, // Will update below
                'shipping_cost' => $request->shipping_cost ?? 0,
                'total_amount' => 0, // Will update below
                'courier' => $request->courier ?? 'manual',
                'courier_service' => $request->courier_service ?? 'manual',
                'status' => 'pending_payment',
            ]);

            // Move Cart Items to Order Items
            foreach ($cart->items as $item) {
                $variant = $item->productVariant;
                
                // Check stock (without locking for now, we lock in Webhook)
                if ($variant->stock < $item->quantity) {
                    throw new \Exception("Not enough stock for {$variant->product->name} (Size: {$variant->size})");
                }

                $price = $variant->product->price;
                $subtotal += ($price * $item->quantity);

                $order->items()->create([
                    'product_variant_id' => $variant->id,
                    'quantity' => $item->quantity,
                    'price' => $price,
                ]);
            }

            // Update order totals
            $order->update([
                'subtotal' => $subtotal,
                'total_amount' => $subtotal + ($request->shipping_cost ?? 0),
            ]);

            // Clear Cart
            $cart->items()->delete();

            // Get Snap Token from Midtrans
            $serverKey = env('MIDTRANS_SERVER_KEY');
            $isProduction = env('MIDTRANS_IS_PRODUCTION', false);
            $baseUrl = $isProduction ? 'https://app.midtrans.com/snap/v1/transactions' : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

            $payload = [
                'transaction_details' => [
                    'order_id' => $order->id . '-' . time(), // Use exact order ID + timestamp to avoid duplicate ID in Sandbox
                    'gross_amount' => (int) $order->total_amount, // Must be int
                ],
                'customer_details' => [
                    'first_name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone_number ?? '',
                ]
            ];

            $response = \Illuminate\Support\Facades\Http::withBasicAuth($serverKey, '')
                ->post($baseUrl, $payload);

            if (!$response->successful()) {
                \Illuminate\Support\Facades\Log::error('Midtrans Error: ' . $response->body());
                throw new \Exception('Failed to generate payment token');
            }

            $snapToken = $response->json()['token'];

            $order->update([
                'snap_token' => $snapToken
            ]); 
            
            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully',
                'snap_token' => $snapToken,
                'order' => $order->load('items.productVariant.product', 'address')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
