<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Doctor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(): JsonResponse
    {
        $appointments = Appointment::with(['patient', 'doctor'])->orderBy('appointment_date', 'desc')->orderBy('appointment_time', 'desc')->get();
        return response()->json(['appointments' => $appointments]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'required|exists:doctors,id',
            'appointment_date' => 'required|date',
            'appointment_time' => 'required',
            'purpose' => 'nullable|string|max:255',
            'status' => 'nullable|in:scheduled,confirmed,checked_in,completed,cancelled,no_show',
            'notes' => 'nullable|string',
        ]);

        $appointment = Appointment::create($validated);
        $appointment->load(['patient', 'doctor']);
        return response()->json(['appointment' => $appointment, 'message' => 'Appointment created successfully'], 201);
    }

    public function show(Appointment $appointment): JsonResponse
    {
        $appointment->load(['patient', 'doctor']);
        return response()->json(['appointment' => $appointment]);
    }

    public function update(Request $request, Appointment $appointment): JsonResponse
    {
        $validated = $request->validate([
            'patient_id' => 'sometimes|exists:patients,id',
            'doctor_id' => 'sometimes|exists:doctors,id',
            'appointment_date' => 'sometimes|date',
            'appointment_time' => 'sometimes',
            'purpose' => 'nullable|string|max:255',
            'status' => 'nullable|in:scheduled,confirmed,checked_in,completed,cancelled,no_show',
            'notes' => 'nullable|string',
        ]);

        $appointment->update($validated);
        $appointment->load(['patient', 'doctor']);
        return response()->json(['appointment' => $appointment, 'message' => 'Appointment updated successfully']);
    }

    public function destroy(Appointment $appointment): JsonResponse
    {
        $appointment->delete();
        return response()->json(['message' => 'Appointment deleted successfully']);
    }
}
