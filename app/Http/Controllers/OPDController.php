<?php

namespace App\Http\Controllers;

use App\Models\OpdRegistration;
use App\Models\OpdVital;
use App\Models\Consultation;
use App\Models\Prescription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OPDController extends Controller
{
    public function index(): JsonResponse
    {
        $registrations = OpdRegistration::with(['patient', 'doctor', 'vitals', 'consultation.prescriptions'])
            ->latest()->get();
        return response()->json(['registrations' => $registrations]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'nullable|exists:doctors,id',
            'appointment_id' => 'nullable|exists:appointments,id',
            'registration_date' => 'required|date',
            'complaints' => 'nullable|string',
            'symptoms' => 'nullable|string',
            'status' => 'nullable|in:waiting,in_consultation,completed,referred',
        ]);

        $registration = OpdRegistration::create($validated);
        $registration->load(['patient', 'doctor']);

        return response()->json(['registration' => $registration, 'message' => 'OPD registration created'], 201);
    }

    public function show(OpdRegistration $opdRegistration): JsonResponse
    {
        $opdRegistration->load(['patient', 'doctor', 'vitals', 'consultation.doctor', 'consultation.prescriptions']);
        return response()->json(['registration' => $opdRegistration]);
    }

    public function updateStatus(Request $request, OpdRegistration $opdRegistration): JsonResponse
    {
        $validated = $request->validate(['status' => 'required|in:waiting,in_consultation,completed,referred']);
        $opdRegistration->update($validated);
        return response()->json(['registration' => $opdRegistration, 'message' => 'Status updated']);
    }

    public function recordVitals(Request $request, OpdRegistration $opdRegistration): JsonResponse
    {
        $validated = $request->validate([
            'bp_systolic' => 'nullable|integer|min:0|max:300',
            'bp_diastolic' => 'nullable|integer|min:0|max:200',
            'pulse' => 'nullable|integer|min:0|max:300',
            'temperature' => 'nullable|numeric|min:30|max:45',
            'respiratory_rate' => 'nullable|integer|min:0|max:100',
            'spO2' => 'nullable|integer|min:0|max:100',
            'weight' => 'nullable|numeric|min:0|max:500',
            'height' => 'nullable|numeric|min:0|max:300',
        ]);

        $validated['opd_registration_id'] = $opdRegistration->id;
        $validated['recorded_at'] = now();

        $vital = OpdVital::create($validated);

        return response()->json(['vital' => $vital, 'message' => 'Vitals recorded'], 201);
    }

    public function createConsultation(Request $request, OpdRegistration $opdRegistration): JsonResponse
    {
        $validated = $request->validate([
            'diagnosis' => 'nullable|string',
            'notes' => 'nullable|string',
            'investigations' => 'nullable|string',
            'follow_up_date' => 'nullable|date|after_or_equal:today',
            'prescriptions' => 'nullable|array',
            'prescriptions.*.medicine_name' => 'required_with:prescriptions|string|max:255',
            'prescriptions.*.dosage' => 'nullable|string|max:255',
            'prescriptions.*.frequency' => 'nullable|string|max:255',
            'prescriptions.*.duration' => 'nullable|string|max:255',
            'prescriptions.*.instructions' => 'nullable|string',
        ]);

        $validated['opd_registration_id'] = $opdRegistration->id;
        $validated['doctor_id'] = $request->doctor_id ?? $opdRegistration->doctor_id;

        $consultation = Consultation::create($validated);

        if (!empty($validated['prescriptions'])) {
            foreach ($validated['prescriptions'] as $rx) {
                $rx['consultation_id'] = $consultation->id;
                Prescription::create($rx);
            }
        }

        $opdRegistration->update(['status' => 'completed']);
        $consultation->load('prescriptions');

        return response()->json(['consultation' => $consultation, 'message' => 'Consultation completed'], 201);
    }
}
