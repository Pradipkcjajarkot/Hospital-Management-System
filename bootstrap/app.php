<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->validateCsrfTokens(except: [
            'api/login',
            'api/register',
            'api/verify-signup-otp',
            'api/upload-profile-photo',
            'api/patients',
            'api/patients/*',
            'api/doctors',
            'api/doctors/*',
            'api/appointments',
            'api/appointments/*',
            'api/departments',
            'api/departments/*',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
