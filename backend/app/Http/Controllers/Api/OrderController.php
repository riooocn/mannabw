<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = $request->user()->orders()
            ->with(['items.productVariant.product', 'address'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Format product images correctly
        $orders->each(function ($order) {
            $order->items->each(function ($item) {
                if ($item->productVariant && $item->productVariant->product) {
                    $images = $item->productVariant->product->images;
                    if (is_string($images)) {
                        $images = json_decode($images, true);
                    }
                    
                    if (is_array($images)) {
                        $item->productVariant->product->images = array_map(function ($path) {
                            if (filter_var($path, FILTER_VALIDATE_URL)) {
                                return $path;
                            }
                            return \Illuminate\Support\Facades\Storage::url(ltrim($path, '/'));
                        }, $images);
                    } else {
                        $item->productVariant->product->images = [];
                    }
                }
            });
        });

        return response()->json($orders);
    }

    public function cancel(Request $request, $id)
    {
        $order = $request->user()->orders()->where('id', $id)->firstOrFail();

        if ($order->status !== 'pending_payment') {
            return response()->json(['message' => 'Hanya pesanan yang belum dibayar yang dapat dibatalkan.'], 400);
        }

        $order->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Pesanan berhasil dibatalkan.']);
    }

    public function complete(Request $request, $id)
    {
        $order = $request->user()->orders()->where('id', $id)->firstOrFail();

        if ($order->status !== 'shipped') {
            return response()->json(['message' => 'Hanya pesanan yang sedang dikirim yang dapat diselesaikan.'], 400);
        }

        $order->update(['status' => 'completed']);

        return response()->json(['message' => 'Pesanan berhasil diselesaikan. Terima kasih!']);
    }
}
