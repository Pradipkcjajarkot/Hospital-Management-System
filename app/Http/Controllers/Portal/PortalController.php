<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Bill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PortalController extends Controller
{
    public function dashboard(Request $request): JsonResponse
    {
        $patient = $request->attributes->get('portal_patient');

        $upcoming = Appointment::where('patient_id', $patient->id)
            ->whereIn('status', ['scheduled', 'confirmed'])
            ->where('appointment_date', '>=', now()->format('Y-m-d'))
            ->with('doctor')
            ->orderBy('appointment_date')->orderBy('appointment_time')->take(5)->get();

        $appointmentsCount = Appointment::where('patient_id', $patient->id)->count();
        $billsCount = Bill::where('patient_id', $patient->id)->count();
        $billTotal = Bill::where('patient_id', $patient->id)->sum('total_amount');

        return response()->json([
            'patient' => $patient,
            'upcoming_appointments' => $upcoming,
            'appointments_count' => $appointmentsCount,
            'bills_count' => $billsCount,
            'total_billed' => $billTotal,
        ]);
    }

    public function appointments(Request $request): JsonResponse
    {
        $patient = $request->attributes->get('portal_patient');

        $appointments = Appointment::where('patient_id', $patient->id)
            ->with('doctor')
            ->orderBy('appointment_date', 'desc')
            ->orderBy('appointment_time', 'desc')
            ->get();

        return response()->json(['appointments' => $appointments]);
    }

    public function bills(Request $request): JsonResponse
    {
        $patient = $request->attributes->get('portal_patient');

        $bills = Bill::where('patient_id', $patient->id)
            ->latest()
            ->get();

        return response()->json(['bills' => $bills]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $patient = $request->attributes->get('portal_patient');

        $validated = $request->validate([
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'pincode' => 'nullable|string|max:20',
            'dob' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'blood_group' => 'nullable|string|max:10',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
        ]);

        $patient->update($validated);

        return response()->json(['patient' => $patient, 'message' => 'Profile updated']);
    }
}
