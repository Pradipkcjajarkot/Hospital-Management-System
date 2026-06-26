<?php

namespace App\Http\Controllers;

use App\Mail\OtpMail;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'remember' => 'boolean',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid email or password'], 401);
        }

        Auth::login($user, $request->boolean('remember'));

        return response()->json(['message' => 'Login successful']);
    }

    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20',
            'password' => 'required|min:6|confirmed',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => $request->password,
        ]);

        $otp = str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
        Cache::put('otp_signup_' . $request->email, $otp, now()->addMinutes(10));
        Mail::to($request->email)->send(new OtpMail($otp));

        return response()->json(['message' => 'Verification code sent to your email'], 201);
    }

    public function verifySignupOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:4',
        ]);

        $cached = Cache::get('otp_signup_' . $request->email);

        if (!$cached || $cached !== $request->otp) {
            return response()->json(['message' => 'Invalid or expired OTP'], 401);
        }

        Cache::forget('otp_signup_' . $request->email);

        $user = User::where('email', $request->email)->first();
        $user->update(['email_verified_at' => now()]);
        Auth::login($user);

        return response()->json(['message' => 'Account verified successfully']);
    }

    public function sendOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid email or password'], 401);
        }

        $otp = str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);

        Cache::put('otp_' . $user->email, $otp, now()->addMinutes(10));

        Mail::to($user->email)->send(new OtpMail($otp));

        return response()->json(['message' => 'OTP sent to your email']);
    }

    public function verifyOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:4',
        ]);

        $cached = Cache::get('otp_' . $request->email);

        if (!$cached || $cached !== $request->otp) {
            return response()->json(['message' => 'Invalid or expired OTP'], 401);
        }

        Cache::forget('otp_' . $request->email);

        $user = User::where('email', $request->email)->first();
        Auth::login($user);

        return response()->json(['message' => 'Login successful']);
    }

    public function uploadProfilePhoto(Request $request): JsonResponse
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        if ($user->profile_photo_path) {
            Storage::disk('public')->delete($user->profile_photo_path);
        }

        $path = $request->file('photo')->store('profile-photos', 'public');
        $user->update(['profile_photo_path' => $path]);

        $url = Storage::disk('public')->url($path);

        return response()->json([
            'message' => 'Profile photo uploaded successfully',
            'url' => $url,
            'path' => $path,
        ]);
    }

    public function uploadLogo(Request $request): JsonResponse
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        $path = $request->file('logo')->store('logos', 'public');
        $url = Storage::disk('public')->url($path);

        Setting::setValue('hospital_logo', $url);

        return response()->json([
            'message' => 'Logo uploaded successfully',
            'url' => $url,
        ]);
    }
}
