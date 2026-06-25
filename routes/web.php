<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\PatientController;
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
});
