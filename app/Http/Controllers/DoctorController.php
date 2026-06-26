<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DoctorController extends Controller
{
    public function index(): JsonResponse
    {
        $doctors = Doctor::orderBy('created_at', 'desc')->get();
        return response()->json(['doctors' => $doctors]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:doctors,email',
            'phone' => 'nullable|string|max:20',
            'specialization' => 'nullable|string|max:255',
            'qualification' => 'nullable|string|max:255',
            'license_number' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'experience_years' => 'nullable|integer|min:0',
            'consultation_fee' => 'nullable|numeric|min:0',
            'available_days' => 'nullable|string|max:255',
            'available_time_start' => 'nullable',
            'available_time_end' => 'nullable',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'pincode' => 'nullable|string|max:20',
            'status' => 'nullable|in:active,inactive,on_leave',
        ]);

        $doctor = Doctor::create($validated);
        return response()->json(['doctor' => $doctor, 'message' => 'Doctor created successfully'], 201);
    }

    public function show(Doctor $doctor): JsonResponse
    {
        return response()->json(['doctor' => $doctor]);
    }

    public function update(Request $request, Doctor $doctor): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:doctors,email,' . $doctor->id,
            'phone' => 'nullable|string|max:20',
            'specialization' => 'nullable|string|max:255',
            'qualification' => 'nullable|string|max:255',
            'license_number' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'experience_years' => 'nullable|integer|min:0',
            'consultation_fee' => 'nullable|numeric|min:0',
            'available_days' => 'nullable|string|max:255',
            'available_time_start' => 'nullable',
            'available_time_end' => 'nullable',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'pincode' => 'nullable|string|max:20',
            'status' => 'nullable|in:active,inactive,on_leave',
        ]);

        $doctor->update($validated);
        return response()->json(['doctor' => $doctor, 'message' => 'Doctor updated successfully']);
    }

    public function destroy(Doctor $doctor): JsonResponse
    {
        if ($doctor->profile_photo_path) {
            Storage::disk('public')->delete($doctor->profile_photo_path);
        }
        $doctor->delete();
        return response()->json(['message' => 'Doctor deleted successfully']);
    }

    public function uploadPhoto(Request $request, Doctor $doctor): JsonResponse
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($doctor->profile_photo_path) {
            Storage::disk('public')->delete($doctor->profile_photo_path);
        }

        $path = $request->file('photo')->store('doctor-photos', 'public');
        $doctor->update(['profile_photo_path' => $path]);

        return response()->json([
            'doctor' => $doctor->fresh(),
            'message' => 'Photo uploaded successfully',
        ]);
    }
}
