<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LookbookCampaign;
use App\Models\Product;
use Illuminate\Http\Request;

class LookbookController extends Controller
{
    public function index()
    {
        $campaigns = LookbookCampaign::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($campaign) {
                // Map images array to include product slugs and full URLs
                $mappedImages = [];
                if (is_array($campaign->images)) {
                    foreach ($campaign->images as $img) {
                        $mappedImg = [
                            'image' => asset('storage/' . $img['image']),
                            'size' => $img['size'] ?? 'medium',
                            'is_grayscale' => $img['is_grayscale'] ?? false,
                            'product_slug' => null,
                        ];

                        if (!empty($img['product_id'])) {
                            $product = Product::find($img['product_id']);
                            if ($product) {
                                $mappedImg['product_slug'] = $product->slug;
                            }
                        }
                        $mappedImages[] = $mappedImg;
                    }
                }

                return [
                    'id' => $campaign->id,
                    'title' => $campaign->title,
                    'description' => $campaign->description,
                    'background_image' => $campaign->background_image ? asset('storage/' . $campaign->background_image) : null,
                    'images' => $mappedImages,
                ];
            });

        return response()->json($campaigns);
    }
}
