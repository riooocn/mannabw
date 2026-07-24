<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MidtransController extends Controller
{
    public function notification(Request $request)
    {
        $payload = $request->all();

        Log::info('Midtrans Webhook Received: ', $payload);

        $orderId = $payload['order_id'];
        $statusCode = $payload['status_code'];
        $grossAmount = $payload['gross_amount'];
        $serverKey = env('MIDTRANS_SERVER_KEY');
        $signatureKey = $payload['signature_key'];

        // Verify Signature
        $calculatedSignature = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);
        
        if ($calculatedSignature !== $signatureKey) {
            Log::error('Midtrans Webhook: Invalid Signature');
            return response()->json(['message' => 'Invalid signature'], 401);
        }

        $transactionStatus = $payload['transaction_status'];
        
        // orderId from midtrans has time appended (e.g. "5-1710000000"), extract the real ID
        $realOrderId = explode('-', $orderId)[0];
        $order = Order::find($realOrderId);

        if (!$order) {
            Log::error('Midtrans Webhook: Order not found ' . $realOrderId);
            return response()->json(['message' => 'Order not found'], 404);
        }

        if ($order->status === 'completed' || $order->status === 'cancelled') {
            return response()->json(['message' => 'Order already finalized'], 200);
        }

        try {
            DB::beginTransaction();
            
            // Re-fetch order with lock to prevent race conditions on stock
            $order = Order::where('id', $realOrderId)->lockForUpdate()->first();

            if ($transactionStatus == 'capture' || $transactionStatus == 'settlement') {
                if ($order->status !== 'processing') {
                    $order->update(['status' => 'processing']);
                    
                    // Decrement Stock Permanently
                    foreach ($order->items as $item) {
                        $variant = ProductVariant::where('id', $item->product_variant_id)->lockForUpdate()->first();
                        if ($variant && $variant->stock >= $item->quantity) {
                            $variant->decrement('stock', $item->quantity);
                        } else {
                            // In real scenario, if stock is not enough here (overselling), 
                            // we would flag the order for manual refund.
                            Log::error("Overselling detected for Order {$order->id}, Variant {$item->product_variant_id}");
                            $order->update(['status' => 'requires_refund']);
                        }
                    }

                    // Create Order in Biteship is now handled manually by Admin via Filament OrderResource
                    // $this->createBiteshipOrder($order);
                }
            } else if ($transactionStatus == 'cancel' || $transactionStatus == 'deny' || $transactionStatus == 'expire') {
                $order->update(['status' => 'cancelled']);
            } else if ($transactionStatus == 'pending') {
                $order->update(['status' => 'pending_payment']);
            }

            DB::commit();

            return response()->json(['message' => 'Success']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Midtrans Webhook Error: ' . $e->getMessage());
            return response()->json(['message' => 'Error processing webhook'], 500);
        }
    }

    private function createBiteshipOrder(Order $order)
    {
        $biteshipKey = env('BITESHIP_API_KEY');
        if (!$biteshipKey) return;

        // Load relations
        $order->load(['items.productVariant.product', 'address', 'user']);
        
        $itemsPayload = [];
        foreach ($order->items as $item) {
            $itemsPayload[] = [
                'name' => $item->productVariant->product->name . ' - ' . $item->productVariant->size,
                'description' => 'Manna Blessingwear',
                'value' => (int) $item->price,
                'quantity' => $item->quantity,
                'weight' => 500, // Hardcoded 500g for now
            ];
        }

        $payload = [
            'origin_contact_name' => 'Manna Blessingwear',
            'origin_contact_phone' => '081234567890',
            'origin_address' => 'Grogol, Sukoharjo, Jawa Tengah', // Store address
            'origin_postal_code' => 57552, // Store postal code
            'origin_area_id' => 'IDNP11IDNC233IDND2240IDZ57552',
            
            'destination_contact_name' => $order->address->recipient_name,
            'destination_contact_phone' => $order->address->phone_number,
            'destination_address' => $order->address->full_address,
            'destination_postal_code' => $order->address->postal_code,
            'destination_area_id' => $order->address->city_id,
            
            'courier_company' => $order->courier,
            'courier_type' => $order->courier_service,
            
            'delivery_type' => 'now', // or 'later' for pickup
            'items' => $itemsPayload,
        ];

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $biteshipKey
            ])->post('https://api.biteship.com/v1/orders', $payload);

            if ($response->successful()) {
                $data = $response->json();
                $order->update([
                    'biteship_order_id' => $data['id'] ?? null,
                    'tracking_number' => $data['courier']['waybill_id'] ?? null,
                ]);
                Log::info('Biteship order created for ' . $order->id);
            } else {
                Log::error('Failed to create Biteship order: ' . $response->body());
            }
        } catch (\Exception $e) {
            Log::error('Exception creating Biteship order: ' . $e->getMessage());
        }
    }
}
