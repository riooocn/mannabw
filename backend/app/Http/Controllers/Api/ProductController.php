<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::where('is_published', true)
            ->with('variants')
            ->orderBy('created_at', 'desc')
            ->get();
            
        // Map images to full URLs
        $products->transform(function ($product) {
            if ($product->images && is_array($product->images)) {
                $product->images = array_map(function ($image) {
                    return \Illuminate\Support\Facades\Storage::url($image);
                }, $product->images);
            }
            return $product;
        });

        return response()->json($products);
    }
    
    public function show($slug)
    {
        $product = Product::where('slug', $slug)
            ->where('is_published', true)
            ->with('variants')
            ->firstOrFail();
            
        if ($product->images && is_array($product->images)) {
            $product->images = array_map(function ($image) {
                return asset('storage/' . $image);
            }, $product->images);
        }

        return response()->json($product);
    }
}
