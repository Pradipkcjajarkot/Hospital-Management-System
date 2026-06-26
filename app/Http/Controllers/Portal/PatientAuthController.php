<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PatientAuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
            'remember' => 'boolean',
        ]);

        $patient = Patient::where('email', $validated['email'])->first();

        if (!$patient || !$patient->password || !Hash::check($validated['password'], $patient->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = Str::random(60);
        $patient->update(['api_token' => $token]);

        return response()->json([
            'patient' => $patient,
            'token' => $token,
        ]);
    }

    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:patients,email',
            'phone' => 'required|string|max:20|unique:patients,phone',
            'password' => 'required|string|min:6',
            'dob' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'address' => 'nullable|string|max:500',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['api_token'] = Str::random(60);
        $validated['status'] = 'active';

        $patient = Patient::create($validated);

        return response()->json([
            'patient' => $patient,
            'token' => $validated['api_token'],
            'message' => 'Registration successful',
        ], 201);
    }

    public function logout(Request $request): JsonResponse
    {
        $patient = $request->attributes->get('portal_patient');
        if ($patient) {
            $patient->update(['api_token' => null]);
        }
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request): JsonResponse
    {
        $patient = $request->attributes->get('portal_patient');
        return response()->json(['patient' => $patient]);
    }
}
