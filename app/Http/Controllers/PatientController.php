<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function index(): JsonResponse
    {
        $patients = Patient::orderBy('created_at', 'desc')->get();
        return response()->json(['patients' => $patients]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:patients,email',
            'phone' => 'nullable|string|max:20',
            'dob' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'blood_group' => 'nullable|string|max:10',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'pincode' => 'nullable|string|max:20',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'medical_history' => 'nullable|string',
            'allergies' => 'nullable|string',
            'status' => 'nullable|in:active,inactive,discharged',
        ]);

        $patient = Patient::create($validated);
        return response()->json(['patient' => $patient, 'message' => 'Patient created successfully'], 201);
    }

    public function show(Patient $patient): JsonResponse
    {
        return response()->json(['patient' => $patient]);
    }

    public function update(Request $request, Patient $patient): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'nullable|email|unique:patients,email,' . $patient->id,
            'phone' => 'nullable|string|max:20',
            'dob' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'blood_group' => 'nullable|string|max:10',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'pincode' => 'nullable|string|max:20',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'medical_history' => 'nullable|string',
            'allergies' => 'nullable|string',
            'status' => 'nullable|in:active,inactive,discharged',
        ]);

        $patient->update($validated);
        return response()->json(['patient' => $patient, 'message' => 'Patient updated successfully']);
    }

    public function destroy(Patient $patient): JsonResponse
    {
        $patient->delete();
        return response()->json(['message' => 'Patient deleted successfully']);
    }
}
