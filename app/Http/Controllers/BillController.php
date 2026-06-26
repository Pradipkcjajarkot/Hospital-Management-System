<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BillController extends Controller
{
    public function index(): JsonResponse
    {
        $bills = Bill::with('patient')->orderBy('created_at', 'desc')->get();
        return response()->json(['bills' => $bills]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'invoice_number' => 'required|string|max:100|unique:bills',
            'bill_date' => 'required|date',
            'total_amount' => 'required|numeric|min:0',
            'paid_amount' => 'required|numeric|min:0',
            'payment_method' => 'nullable|in:cash,card,insurance,online,other',
            'payment_status' => 'nullable|in:paid,partial,pending,cancelled,refunded',
            'description' => 'nullable|string',
            'items' => 'nullable|string',
        ]);

        $bill = Bill::create($validated);
        return response()->json(['bill' => $bill->load('patient'), 'message' => 'Bill created successfully'], 201);
    }

    public function show(Bill $bill): JsonResponse
    {
        return response()->json(['bill' => $bill->load('patient')]);
    }

    public function update(Request $request, Bill $bill): JsonResponse
    {
        $validated = $request->validate([
            'patient_id' => 'sometimes|exists:patients,id',
            'invoice_number' => 'sometimes|string|max:100|unique:bills,invoice_number,' . $bill->id,
            'bill_date' => 'sometimes|date',
            'total_amount' => 'sometimes|numeric|min:0',
            'paid_amount' => 'sometimes|numeric|min:0',
            'payment_method' => 'nullable|in:cash,card,insurance,online,other',
            'payment_status' => 'nullable|in:paid,partial,pending,cancelled,refunded',
            'description' => 'nullable|string',
            'items' => 'nullable|string',
        ]);

        $bill->update($validated);
        return response()->json(['bill' => $bill->fresh()->load('patient'), 'message' => 'Bill updated successfully']);
    }

    public function destroy(Bill $bill): JsonResponse
    {
        $bill->delete();
        return response()->json(['message' => 'Bill deleted successfully']);
    }
}
