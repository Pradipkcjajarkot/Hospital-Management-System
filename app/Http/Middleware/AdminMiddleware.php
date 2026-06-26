<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->role === 'admin') {
            return $next($request);
        }

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
        }

        return redirect()->route('login');
    }
}
