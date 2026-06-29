<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Bed;
use App\Models\Bill;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\User;
use App\Models\OpdRegistration;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $totalPatients = Patient::count();
        $totalDoctors = Doctor::count();
        $totalStaff = User::count();
        $todayAppointments = Appointment::whereDate('appointment_date', today())->count();
        $totalAppointments = Appointment::count();
        $availableBeds = Bed::where('status', 'available')->count();
        $occupiedBeds = Bed::where('status', 'occupied')->count();
        $todayRevenue = Bill::whereDate('bill_date', today())->sum('total_amount');
        $totalRevenue = Bill::sum('total_amount');
        $pendingBills = Bill::where('payment_status', 'pending')->count();
        $totalBeds = Bed::count();
        $opdToday = OpdRegistration::whereDate('registration_date', today())->count();

        $todayAppts = Appointment::with(['patient', 'doctor'])
            ->whereDate('appointment_date', today())
            ->orderBy('appointment_time')
            ->take(5)
            ->get()
            ->map(fn($a) => [
                'time' => $a->appointment_time ? substr($a->appointment_time, 0, 5) : null,
                'patient' => $a->patient?->full_name ?? 'N/A',
                'doctor' => $a->doctor?->full_name ?? 'N/A',
                'dept' => $a->doctor?->specialization ?? 'N/A',
                'status' => $a->status,
            ]);

        $recentActivities = collect();

        OpdRegistration::with('patient')
            ->latest()
            ->take(3)
            ->get()
            ->each(fn($o) => $recentActivities->push([
                'text' => ($o->patient?->full_name ?? 'A patient') . ' registered in OPD',
                'time' => $o->created_at?->diffForHumans() ?? 'recently',
                'type' => 'admission',
            ]));

        Appointment::with('patient')
            ->whereDate('created_at', today())
            ->latest()
            ->take(3)
            ->get()
            ->each(fn($a) => $recentActivities->push([
                'text' => 'Appointment booked for ' . ($a->patient?->full_name ?? 'a patient'),
                'time' => $a->created_at?->diffForHumans() ?? 'recently',
                'type' => 'admission',
            ]));

        Patient::latest()->take(3)->get()->each(fn($p) => $recentActivities->push([
            'text' => 'New patient registered: ' . $p->full_name,
            'time' => $p->created_at?->diffForHumans() ?? 'recently',
            'type' => 'admission',
        ]));

        $recentActivities = $recentActivities->sortByDesc(fn($a) => $a['time'])->values()->take(4);

        return response()->json([
            'total_patients' => $totalPatients,
            'total_doctors' => $totalDoctors,
            'total_staff' => $totalStaff,
            'today_appointments' => $todayAppointments,
            'total_appointments' => $totalAppointments,
            'available_beds' => $availableBeds,
            'occupied_beds' => $occupiedBeds,
            'total_beds' => $totalBeds,
            'today_revenue' => $todayRevenue,
            'total_revenue' => $totalRevenue,
            'pending_bills' => $pendingBills,
            'opd_today' => $opdToday,
            'today_appointments_list' => $todayAppts,
            'recent_activities' => $recentActivities,
        ]);
    }
}
