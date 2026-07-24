<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Address;
use Illuminate\Support\Facades\DB;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        $addresses = $request->user()->addresses()->orderByDesc('is_default')->latest()->get();
        return response()->json($addresses);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:50',
            'recipient_name' => 'required|string|max:100',
            'phone_number' => 'required|string|max:20',
            'full_address' => 'required|string|max:500',
            'city_id' => 'required|string',
            'province_id' => 'required|string',
            'postal_code' => 'required|string',
        ]);

        $user = $request->user();
        
        // If it's the first address, make it default automatically
        $isFirst = $user->addresses()->count() === 0;
        $validated['is_default'] = $isFirst;

        $address = $user->addresses()->create($validated);

        return response()->json([
            'message' => 'Alamat berhasil ditambahkan',
            'address' => $address
        ]);
    }

    public function update(Request $request, Address $address)
    {
        if ($address->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'label' => 'required|string|max:50',
            'recipient_name' => 'required|string|max:100',
            'phone_number' => 'required|string|max:20',
            'full_address' => 'required|string|max:500',
            'city_id' => 'required|string',
            'province_id' => 'required|string',
            'postal_code' => 'required|string',
        ]);

        $address->update($validated);

        return response()->json([
            'message' => 'Alamat berhasil diperbarui',
            'address' => $address
        ]);
    }

    public function destroy(Request $request, Address $address)
    {
        if ($address->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $address->delete();

        return response()->json(['message' => 'Alamat berhasil dihapus']);
    }

    public function setAsDefault(Request $request, Address $address)
    {
        if ($address->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        DB::transaction(function () use ($request, $address) {
            // Remove default status from all user addresses
            $request->user()->addresses()->update(['is_default' => false]);
            
            // Set the selected one as default
            $address->update(['is_default' => true]);
        });

        return response()->json(['message' => 'Alamat utama berhasil diubah']);
    }
}
