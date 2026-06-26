<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobApplicationController extends Controller
{
    public function index(): JsonResponse
    {
        $applications = JobApplication::with('jobListing')->latest()->get();
        return response()->json(['applications' => $applications]);
    }

    public function show(JobApplication $jobApplication): JsonResponse
    {
        $jobApplication->load('jobListing');
        return response()->json(['application' => $jobApplication]);
    }

    public function updateStatus(Request $request, JobApplication $jobApplication): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,reviewed,shortlisted,rejected,hired',
        ]);

        $jobApplication->update($validated);
        return response()->json(['application' => $jobApplication, 'message' => 'Status updated']);
    }

    public function destroy(JobApplication $jobApplication): JsonResponse
    {
        $jobApplication->delete();
        return response()->json(['message' => 'Application deleted']);
    }
}
