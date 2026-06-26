<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MedicineController extends Controller
{
    public function index(): JsonResponse
    {
        $medicines = Medicine::orderBy('created_at', 'desc')->get();
        return response()->json(['medicines' => $medicines]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'medicine_name' => 'required|string|max:255',
            'brand' => 'nullable|string|max:255',
            'generic_name' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'unit' => 'required|string|max:50',
            'price_per_unit' => 'required|numeric|min:0',
            'quantity_in_stock' => 'required|integer|min:0',
            'reorder_level' => 'required|integer|min:0',
            'status' => 'nullable|in:available,out_of_stock,discontinued',
            'expiry_date' => 'nullable|date',
            'description' => 'nullable|string',
        ]);

        $medicine = Medicine::create($validated);
        return response()->json(['medicine' => $medicine, 'message' => 'Medicine created successfully'], 201);
    }

    public function show(Medicine $medicine): JsonResponse
    {
        return response()->json(['medicine' => $medicine]);
    }

    public function update(Request $request, Medicine $medicine): JsonResponse
    {
        $validated = $request->validate([
            'medicine_name' => 'sometimes|string|max:255',
            'brand' => 'nullable|string|max:255',
            'generic_name' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'unit' => 'sometimes|string|max:50',
            'price_per_unit' => 'sometimes|numeric|min:0',
            'quantity_in_stock' => 'sometimes|integer|min:0',
            'reorder_level' => 'sometimes|integer|min:0',
            'status' => 'nullable|in:available,out_of_stock,discontinued',
            'expiry_date' => 'nullable|date',
            'description' => 'nullable|string',
        ]);

        $medicine->update($validated);
        return response()->json(['medicine' => $medicine->fresh(), 'message' => 'Medicine updated successfully']);
    }

    public function destroy(Medicine $medicine): JsonResponse
    {
        $medicine->delete();
        return response()->json(['message' => 'Medicine deleted successfully']);
    }
}
