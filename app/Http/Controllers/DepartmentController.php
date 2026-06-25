<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index(): JsonResponse
    {
        $departments = Department::orderBy('created_at', 'desc')->get();
        return response()->json(['departments' => $departments]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'head_of_department' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'status' => 'nullable|in:active,inactive',
        ]);

        $department = Department::create($validated);
        return response()->json(['department' => $department, 'message' => 'Department created successfully'], 201);
    }

    public function show(Department $department): JsonResponse
    {
        return response()->json(['department' => $department]);
    }

    public function update(Request $request, Department $department): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'head_of_department' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'status' => 'nullable|in:active,inactive',
        ]);

        $department->update($validated);
        return response()->json(['department' => $department, 'message' => 'Department updated successfully']);
    }

    public function destroy(Department $department): JsonResponse
    {
        $department->delete();
        return response()->json(['message' => 'Department deleted successfully']);
    }
}
