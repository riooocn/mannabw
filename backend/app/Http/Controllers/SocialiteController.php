<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class SocialiteController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            $user = User::where('email', $googleUser->getEmail())->first();
            
            if ($user) {
                // User exists, update google_id if not present
                if (!$user->google_id) {
                    $user->update(['google_id' => $googleUser->getId()]);
                }
            } else {
                // Create new user
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    // password is null
                ]);
            }

            Auth::login($user);

            // Redirect to complete profile if they don't have a phone number or address
            if (empty($user->phone_number) || empty($user->address)) {
                return redirect(config('app.frontend_url') . '/complete-profile');
            }

            return redirect(config('app.frontend_url') . '/');
            
        } catch (\Exception $e) {
            return redirect(config('app.frontend_url') . '/login?error=google_auth_failed');
        }
    }
}
