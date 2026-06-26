<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::orderBy('created_at', 'desc')->get()->map(function ($user) {
            return $user->makeHidden(['password', 'remember_token']);
        });
        return response()->json(['users' => $users]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,doctor,nurse,staff,pharmacist,laboratorist,accountant',
            'status' => 'nullable|in:active,inactive,suspended',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);
        return response()->json(['user' => $user->makeHidden(['password', 'remember_token']), 'message' => 'User created successfully'], 201);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json(['user' => $user->makeHidden(['password', 'remember_token'])]);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8',
            'role' => 'sometimes|in:admin,doctor,nurse,staff,pharmacist,laboratorist,accountant',
            'status' => 'nullable|in:active,inactive,suspended',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);
        return response()->json(['user' => $user->fresh()->makeHidden(['password', 'remember_token']), 'message' => 'User updated successfully']);
    }

    public function destroy(User $user): JsonResponse
    {
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Cannot delete yourself'], 422);
        }
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}
