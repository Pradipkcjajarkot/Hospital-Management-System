<?php

namespace App\Http\Controllers;

use App\Models\LabTest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LabTestController extends Controller
{
    public function index(): JsonResponse
    {
        $labTests = LabTest::with('patient', 'doctor')->orderBy('created_at', 'desc')->get();
        return response()->json(['labTests' => $labTests]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'test_name' => 'required|string|max:255',
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'nullable|exists:doctors,id',
            'test_category' => 'nullable|string|max:255',
            'sample_type' => 'nullable|string|max:100',
            'test_date' => 'required|date',
            'result_date' => 'nullable|date',
            'result' => 'nullable|string',
            'normal_range' => 'nullable|string|max:255',
            'status' => 'nullable|in:pending,in_progress,completed,cancelled',
            'notes' => 'nullable|string',
        ]);

        $labTest = LabTest::create($validated);
        return response()->json(['labTest' => $labTest->load('patient', 'doctor'), 'message' => 'Lab test created successfully'], 201);
    }

    public function show(LabTest $labTest): JsonResponse
    {
        return response()->json(['labTest' => $labTest->load('patient', 'doctor')]);
    }

    public function update(Request $request, LabTest $labTest): JsonResponse
    {
        $validated = $request->validate([
            'test_name' => 'sometimes|string|max:255',
            'patient_id' => 'sometimes|exists:patients,id',
            'doctor_id' => 'nullable|exists:doctors,id',
            'test_category' => 'nullable|string|max:255',
            'sample_type' => 'nullable|string|max:100',
            'test_date' => 'sometimes|date',
            'result_date' => 'nullable|date',
            'result' => 'nullable|string',
            'normal_range' => 'nullable|string|max:255',
            'status' => 'nullable|in:pending,in_progress,completed,cancelled',
            'notes' => 'nullable|string',
        ]);

        $labTest->update($validated);
        return response()->json(['labTest' => $labTest->fresh()->load('patient', 'doctor'), 'message' => 'Lab test updated successfully']);
    }

    public function destroy(LabTest $labTest): JsonResponse
    {
        $labTest->delete();
        return response()->json(['message' => 'Lab test deleted successfully']);
    }
}
