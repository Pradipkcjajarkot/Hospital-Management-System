<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\BlogPost;
use App\Models\Department;
use App\Models\Doctor;
use App\Models\Contact;
use App\Models\Event;
use App\Models\GalleryItem;
use App\Models\JobApplication;
use App\Models\JobListing;
use App\Models\Patient;
use App\Models\Setting;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function home(): JsonResponse
    {
        $departments = Department::where('status', 'active')->take(6)->get();
        $doctors = Doctor::where('status', 'active')->take(4)->get();
        $testimonials = Testimonial::latest()->take(3)->get();
        $blogPosts = BlogPost::published()->latest('published_at')->take(3)->get();
        $events = Event::upcoming()->take(4)->get();
        $settings = Setting::all()->pluck('value', 'key');
        $stats = [
            'patients' => \App\Models\Patient::count(),
            'doctors' => Doctor::where('status', 'active')->count(),
            'departments' => Department::where('status', 'active')->count(),
            'years' => 15,
        ];

        return response()->json(compact('departments', 'doctors', 'testimonials', 'blogPosts', 'events', 'settings', 'stats'));
    }

    public function doctors(): JsonResponse
    {
        $doctors = Doctor::where('status', 'active')->with('user')->get();
        return response()->json($doctors);
    }

    public function departments(): JsonResponse
    {
        $departments = Department::where('status', 'active')->get();
        return response()->json($departments);
    }

    public function blog(): JsonResponse
    {
        $posts = BlogPost::published()->latest('published_at')->get();
        return response()->json($posts);
    }

    public function blogPost(string $slug): JsonResponse
    {
        $post = BlogPost::published()->where('slug', $slug)->firstOrFail();
        return response()->json($post);
    }

    public function gallery(): JsonResponse
    {
        $items = GalleryItem::latest()->get();
        return response()->json($items);
    }

    public function events(): JsonResponse
    {
        $upcoming = Event::upcoming()->get();
        $past = Event::where('event_date', '<', now())->orderBy('event_date', 'desc')->take(10)->get();
        return response()->json($upcoming->concat($past));
    }

    public function contact(): JsonResponse
    {
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json(['settings' => $settings]);
    }

    public function submitContact(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $contact = Contact::create($validated);

        return response()->json(['message' => 'Thank you for your message. We will get back to you shortly.', 'contact' => $contact], 201);
    }

    public function slots(Request $request, Doctor $doctor): JsonResponse
    {
        $date = $request->query('date', now()->format('Y-m-d'));
        $dayName = now()->parse($date)->format('l');

        $availableDays = $doctor->available_days ? json_decode($doctor->available_days, true) : [];
        if (!in_array($dayName, $availableDays)) {
            return response()->json(['slots' => []]);
        }

        $start = $doctor->available_time_start ? now()->parse($date . ' ' . $doctor->available_time_start) : now()->parse($date . ' 09:00');
        $end = $doctor->available_time_end ? now()->parse($date . ' ' . $doctor->available_time_end) : now()->parse($date . ' 17:00');

        $booked = Appointment::where('doctor_id', $doctor->id)
            ->where('appointment_date', $date)
            ->whereNotIn('status', ['cancelled', 'no_show'])
            ->pluck('appointment_time')
            ->map(fn($t) => substr($t, 0, 5))
            ->toArray();

        $slots = [];
        $current = $start->copy();
        while ($current < $end) {
            $time = $current->format('H:i');
            if (!in_array($time, $booked)) {
                $slots[] = $time;
            }
            $current->addMinutes(30);
        }

        return response()->json(['slots' => $slots, 'date' => $date, 'doctor_id' => $doctor->id]);
    }

    public function bookAppointment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'doctor_id' => 'required|exists:doctors,id',
            'appointment_date' => 'required|date|after_or_equal:today',
            'appointment_time' => 'required',
            'purpose' => 'nullable|string|max:500',
        ]);

        $patient = Patient::firstOrCreate(
            ['email' => $validated['email']],
            [
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'phone' => $validated['phone'],
                'status' => 'active',
            ]
        );

        $appointment = Appointment::create([
            'patient_id' => $patient->id,
            'doctor_id' => $validated['doctor_id'],
            'appointment_date' => $validated['appointment_date'],
            'appointment_time' => $validated['appointment_time'],
            'purpose' => $validated['purpose'] ?? '',
            'status' => 'scheduled',
        ]);

        $appointment->load(['patient', 'doctor']);

        return response()->json(['message' => 'Appointment booked successfully! We will contact you for confirmation.', 'appointment' => $appointment], 201);
    }

    public function careers(): JsonResponse
    {
        $listings = JobListing::active()->latest()->get();
        return response()->json(['listings' => $listings]);
    }

    public function careerDetail(JobListing $jobListing): JsonResponse
    {
        if ($jobListing->status !== 'active') {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json(['listing' => $jobListing]);
    }

    public function applyForJob(Request $request, JobListing $jobListing): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'cover_letter' => 'nullable|string|max:2000',
        ]);

        $validated['job_listing_id'] = $jobListing->id;
        $validated['status'] = 'pending';

        $application = JobApplication::create($validated);

        return response()->json(['message' => 'Application submitted successfully! We will review your application and get back to you.', 'application' => $application], 201);
    }
}
