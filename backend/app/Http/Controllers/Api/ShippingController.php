<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ShippingController extends Controller
{
    public function locations(Request $request)
    {
        $query = $request->input('query');
        
        if (!$query || strlen($query) < 3) {
            return response()->json(['areas' => []]);
        }

        $apiKey = env('BITESHIP_API_KEY');

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$apiKey}",
        ])->get("https://api.biteship.com/v1/maps/areas", [
            'countries' => 'ID',
            'input' => $query,
            'type' => 'single'
        ]);

        if ($response->successful()) {
            return response()->json($response->json());
        }

        return response()->json(['error' => 'Failed to fetch locations', 'details' => $response->json()], $response->status());
    }

    public function rates(Request $request)
    {
        // Rates calculation is no longer used due to manual delivery approach.
        return response()->json([
            'success' => true,
            'message' => 'Manual delivery enabled',
            'pricing' => []
        ]);
    }
}
