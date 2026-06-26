<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\PortalAuth;
use App\Http\Middleware\AdminMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'portal.auth' => PortalAuth::class,
            'admin' => AdminMiddleware::class,
        ]);
        $middleware->validateCsrfTokens(except: [
            'api/login',
            'api/register',
            'api/verify-signup-otp',
            'api/upload-profile-photo',
            'api/upload-logo',
            'api/patients',
            'api/patients/*',
            'api/doctors',
            'api/doctors/*',
            'api/appointments',
            'api/appointments/*',
            'api/departments',
            'api/departments/*',
            'api/beds',
            'api/beds/*',
            'api/lab-tests',
            'api/lab-tests/*',
            'api/medicines',
            'api/medicines/*',
            'api/bills',
            'api/bills/*',
            'api/public/home',
            'api/public/doctors',
            'api/public/departments',
            'api/public/blog',
            'api/public/blog/*',
            'api/public/gallery',
            'api/public/events',
            'api/public/contact',
            'api/admin/blog-posts',
            'api/admin/blog-posts/*',
            'api/admin/gallery',
            'api/admin/gallery/*',
            'api/admin/events',
            'api/admin/events/*',
            'api/admin/testimonials',
            'api/admin/testimonials/*',
            'api/admin/job-listings',
            'api/admin/job-listings/*',
            'api/admin/job-applications',
            'api/admin/job-applications/*',
            'api/opd',
            'api/opd/*',
            'api/messages/conversations',
            'api/messages/conversations/*',
            'api/users',
            'api/users/*',
            'api/settings',
            'api/notifications',
            'api/notifications/*',
            'api/contacts',
            'api/contacts/*',
            'api/public/doctors/*/slots',
            'api/public/appointments',
            'api/public/careers/*/apply',
            'api/portal/login',
            'api/portal/register',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
