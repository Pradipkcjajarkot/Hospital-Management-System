<?php

use App\Http\Controllers\Admin\BlogPostController;
use App\Http\Controllers\Admin\ContactController as AdminContactController;
use App\Http\Controllers\Admin\EventController as AdminEventController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BedController;
use App\Http\Controllers\BillController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\LabTestController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Portal\PatientAuthController;
use App\Http\Controllers\Portal\PortalController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
})->name('login');

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware('auth');

Route::post('/api/login', [AuthController::class, 'login']);
Route::post('/api/register', [AuthController::class, 'register']);
Route::post('/api/verify-signup-otp', [AuthController::class, 'verifySignupOtp']);
Route::post('/api/upload-profile-photo', [AuthController::class, 'uploadProfilePhoto']);
Route::post('/api/upload-logo', [AuthController::class, 'uploadLogo']);

Route::get('/api/public/home', [PublicController::class, 'home']);
Route::get('/api/public/doctors', [PublicController::class, 'doctors']);
Route::get('/api/public/departments', [PublicController::class, 'departments']);
Route::get('/api/public/blog', [PublicController::class, 'blog']);
Route::get('/api/public/blog/{slug}', [PublicController::class, 'blogPost']);
Route::get('/api/public/gallery', [PublicController::class, 'gallery']);
Route::get('/api/public/events', [PublicController::class, 'events']);
Route::get('/api/public/contact', [PublicController::class, 'contact']);
Route::post('/api/public/contact', [PublicController::class, 'submitContact']);
Route::get('/api/public/doctors/{doctor}/slots', [PublicController::class, 'slots']);
Route::post('/api/public/appointments', [PublicController::class, 'bookAppointment']);
Route::get('/api/public/careers', [PublicController::class, 'careers']);
Route::get('/api/public/careers/{jobListing}', [PublicController::class, 'careerDetail']);
Route::post('/api/public/careers/{jobListing}/apply', [PublicController::class, 'applyForJob']);

Route::post('/api/portal/login', [PatientAuthController::class, 'login']);
Route::post('/api/portal/register', [PatientAuthController::class, 'register']);

Route::middleware('portal.auth')->group(function () {
    Route::post('/api/portal/logout', [PatientAuthController::class, 'logout']);
    Route::get('/api/portal/me', [PatientAuthController::class, 'me']);
    Route::get('/api/portal/dashboard', [PortalController::class, 'dashboard']);
    Route::get('/api/portal/appointments', [PortalController::class, 'appointments']);
    Route::get('/api/portal/bills', [PortalController::class, 'bills']);
    Route::put('/api/portal/profile', [PortalController::class, 'updateProfile']);
});

Route::middleware('auth')->group(function () {
    Route::get('/api/patients', [PatientController::class, 'index']);
    Route::post('/api/patients', [PatientController::class, 'store']);
    Route::get('/api/patients/{patient}', [PatientController::class, 'show']);
    Route::put('/api/patients/{patient}', [PatientController::class, 'update']);
    Route::delete('/api/patients/{patient}', [PatientController::class, 'destroy']);

    Route::get('/api/doctors', [DoctorController::class, 'index']);
    Route::post('/api/doctors', [DoctorController::class, 'store']);
    Route::get('/api/doctors/{doctor}', [DoctorController::class, 'show']);
    Route::put('/api/doctors/{doctor}', [DoctorController::class, 'update']);
    Route::delete('/api/doctors/{doctor}', [DoctorController::class, 'destroy']);
    Route::post('/api/doctors/{doctor}/upload-photo', [DoctorController::class, 'uploadPhoto']);

    Route::get('/api/appointments', [AppointmentController::class, 'index']);
    Route::post('/api/appointments', [AppointmentController::class, 'store']);
    Route::get('/api/appointments/{appointment}', [AppointmentController::class, 'show']);
    Route::put('/api/appointments/{appointment}', [AppointmentController::class, 'update']);
    Route::delete('/api/appointments/{appointment}', [AppointmentController::class, 'destroy']);

    Route::get('/api/departments', [DepartmentController::class, 'index']);
    Route::post('/api/departments', [DepartmentController::class, 'store']);
    Route::get('/api/departments/{department}', [DepartmentController::class, 'show']);
    Route::put('/api/departments/{department}', [DepartmentController::class, 'update']);
    Route::delete('/api/departments/{department}', [DepartmentController::class, 'destroy']);

    Route::get('/api/beds', [BedController::class, 'index']);
    Route::post('/api/beds', [BedController::class, 'store']);
    Route::get('/api/beds/{bed}', [BedController::class, 'show']);
    Route::put('/api/beds/{bed}', [BedController::class, 'update']);
    Route::delete('/api/beds/{bed}', [BedController::class, 'destroy']);

    Route::get('/api/lab-tests', [LabTestController::class, 'index']);
    Route::post('/api/lab-tests', [LabTestController::class, 'store']);
    Route::get('/api/lab-tests/{labTest}', [LabTestController::class, 'show']);
    Route::put('/api/lab-tests/{labTest}', [LabTestController::class, 'update']);
    Route::delete('/api/lab-tests/{labTest}', [LabTestController::class, 'destroy']);

    Route::get('/api/medicines', [MedicineController::class, 'index']);
    Route::post('/api/medicines', [MedicineController::class, 'store']);
    Route::get('/api/medicines/{medicine}', [MedicineController::class, 'show']);
    Route::put('/api/medicines/{medicine}', [MedicineController::class, 'update']);
    Route::delete('/api/medicines/{medicine}', [MedicineController::class, 'destroy']);

    Route::get('/api/bills', [BillController::class, 'index']);
    Route::post('/api/bills', [BillController::class, 'store']);
    Route::get('/api/bills/{bill}', [BillController::class, 'show']);
    Route::put('/api/bills/{bill}', [BillController::class, 'update']);
    Route::delete('/api/bills/{bill}', [BillController::class, 'destroy']);

    Route::get('/api/users', [UserController::class, 'index']);
    Route::post('/api/users', [UserController::class, 'store']);
    Route::get('/api/users/{user}', [UserController::class, 'show']);
    Route::put('/api/users/{user}', [UserController::class, 'update']);
    Route::delete('/api/users/{user}', [UserController::class, 'destroy']);

    Route::get('/api/settings', [SettingController::class, 'index']);
    Route::put('/api/settings', [SettingController::class, 'update']);

    Route::get('/api/notifications', [NotificationController::class, 'index']);
    Route::post('/api/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/api/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/api/notifications/{id}', [NotificationController::class, 'destroy']);
    Route::get('/api/notifications/unread-count', [NotificationController::class, 'unreadCount']);

    Route::get('/api/admin/blog-posts', [BlogPostController::class, 'index']);
    Route::post('/api/admin/blog-posts', [BlogPostController::class, 'store']);
    Route::get('/api/admin/blog-posts/{blogPost}', [BlogPostController::class, 'show']);
    Route::put('/api/admin/blog-posts/{blogPost}', [BlogPostController::class, 'update']);
    Route::delete('/api/admin/blog-posts/{blogPost}', [BlogPostController::class, 'destroy']);

    Route::get('/api/admin/gallery', [GalleryController::class, 'index']);
    Route::post('/api/admin/gallery', [GalleryController::class, 'store']);
    Route::post('/api/admin/gallery/upload', [GalleryController::class, 'upload']);
    Route::get('/api/admin/gallery/{galleryItem}', [GalleryController::class, 'show']);
    Route::put('/api/admin/gallery/{galleryItem}', [GalleryController::class, 'update']);
    Route::delete('/api/admin/gallery/{galleryItem}', [GalleryController::class, 'destroy']);

    Route::get('/api/admin/events', [AdminEventController::class, 'index']);
    Route::post('/api/admin/events', [AdminEventController::class, 'store']);
    Route::get('/api/admin/events/{event}', [AdminEventController::class, 'show']);
    Route::put('/api/admin/events/{event}', [AdminEventController::class, 'update']);
    Route::delete('/api/admin/events/{event}', [AdminEventController::class, 'destroy']);

    Route::get('/api/admin/testimonials', [TestimonialController::class, 'index']);
    Route::post('/api/admin/testimonials', [TestimonialController::class, 'store']);
    Route::get('/api/admin/testimonials/{testimonial}', [TestimonialController::class, 'show']);
    Route::put('/api/admin/testimonials/{testimonial}', [TestimonialController::class, 'update']);
    Route::delete('/api/admin/testimonials/{testimonial}', [TestimonialController::class, 'destroy']);

    Route::get('/api/contacts', [AdminContactController::class, 'index']);
    Route::get('/api/contacts/{contact}', [AdminContactController::class, 'show']);
    Route::post('/api/contacts/{contact}/read', [AdminContactController::class, 'markRead']);
    Route::delete('/api/contacts/{contact}', [AdminContactController::class, 'destroy']);

    Route::get('/api/admin/job-listings', [App\Http\Controllers\Admin\JobListingController::class, 'index']);
    Route::post('/api/admin/job-listings', [App\Http\Controllers\Admin\JobListingController::class, 'store']);
    Route::get('/api/admin/job-listings/{jobListing}', [App\Http\Controllers\Admin\JobListingController::class, 'show']);
    Route::put('/api/admin/job-listings/{jobListing}', [App\Http\Controllers\Admin\JobListingController::class, 'update']);
    Route::delete('/api/admin/job-listings/{jobListing}', [App\Http\Controllers\Admin\JobListingController::class, 'destroy']);

    Route::get('/api/admin/job-applications', [App\Http\Controllers\Admin\JobApplicationController::class, 'index']);
    Route::get('/api/admin/job-applications/{jobApplication}', [App\Http\Controllers\Admin\JobApplicationController::class, 'show']);
    Route::put('/api/admin/job-applications/{jobApplication}/status', [App\Http\Controllers\Admin\JobApplicationController::class, 'updateStatus']);
    Route::delete('/api/admin/job-applications/{jobApplication}', [App\Http\Controllers\Admin\JobApplicationController::class, 'destroy']);

    Route::get('/api/opd', [App\Http\Controllers\OPDController::class, 'index']);
    Route::post('/api/opd', [App\Http\Controllers\OPDController::class, 'store']);
    Route::get('/api/opd/{opdRegistration}', [App\Http\Controllers\OPDController::class, 'show']);
    Route::put('/api/opd/{opdRegistration}/status', [App\Http\Controllers\OPDController::class, 'updateStatus']);
    Route::post('/api/opd/{opdRegistration}/vitals', [App\Http\Controllers\OPDController::class, 'recordVitals']);
    Route::post('/api/opd/{opdRegistration}/consultation', [App\Http\Controllers\OPDController::class, 'createConsultation']);

    Route::get('/api/messages/conversations', [App\Http\Controllers\MessageController::class, 'conversations']);
    Route::post('/api/messages/conversations', [App\Http\Controllers\MessageController::class, 'store']);
    Route::get('/api/messages/conversations/{conversation}', [App\Http\Controllers\MessageController::class, 'show']);
    Route::post('/api/messages/conversations/{conversation}/reply', [App\Http\Controllers\MessageController::class, 'reply']);
    Route::get('/api/messages/unread-count', [App\Http\Controllers\MessageController::class, 'unreadCount']);
});
