<?php

namespace App\Http\Controllers;

use App\Models\Bed;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BedController extends Controller
{
    public function index(): JsonResponse
    {
        $beds = Bed::with('patient')->orderBy('created_at', 'desc')->get();
        return response()->json(['beds' => $beds]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ward_name' => 'required|string|max:255',
            'ward_type' => 'required|in:general,private,icu,maternity,pediatric,emergency,operation_theatre',
            'bed_number' => 'required|string|max:50',
            'bed_type' => 'required|in:standard,electric,icu,bariatric,pediatric',
            'floor' => 'nullable|string|max:100',
            'rate_per_day' => 'required|numeric|min:0',
            'status' => 'nullable|in:available,occupied,maintenance,reserved',
            'patient_id' => 'nullable|exists:patients,id',
            'assigned_at' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $bed = Bed::create($validated);
        return response()->json(['bed' => $bed->load('patient'), 'message' => 'Bed created successfully'], 201);
    }

    public function show(Bed $bed): JsonResponse
    {
        return response()->json(['bed' => $bed->load('patient')]);
    }

    public function update(Request $request, Bed $bed): JsonResponse
    {
        $validated = $request->validate([
            'ward_name' => 'sometimes|string|max:255',
            'ward_type' => 'sometimes|in:general,private,icu,maternity,pediatric,emergency,operation_theatre',
            'bed_number' => 'sometimes|string|max:50',
            'bed_type' => 'sometimes|in:standard,electric,icu,bariatric,pediatric',
            'floor' => 'nullable|string|max:100',
            'rate_per_day' => 'sometimes|numeric|min:0',
            'status' => 'nullable|in:available,occupied,maintenance,reserved',
            'patient_id' => 'nullable|exists:patients,id',
            'assigned_at' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $bed->update($validated);
        return response()->json(['bed' => $bed->fresh()->load('patient'), 'message' => 'Bed updated successfully']);
    }

    public function destroy(Bed $bed): JsonResponse
    {
        $bed->delete();
        return response()->json(['message' => 'Bed deleted successfully']);
    }
}
