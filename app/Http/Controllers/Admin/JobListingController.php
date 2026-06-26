<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobListingController extends Controller
{
    public function index(): JsonResponse
    {
        $listings = JobListing::latest()->get();
        return response()->json(['listings' => $listings]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'type' => 'required|in:full-time,part-time,contract,internship',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0',
            'status' => 'nullable|in:active,inactive',
        ]);

        $listing = JobListing::create($validated);
        return response()->json(['listing' => $listing, 'message' => 'Job listing created'], 201);
    }

    public function show(JobListing $jobListing): JsonResponse
    {
        return response()->json(['listing' => $jobListing]);
    }

    public function update(Request $request, JobListing $jobListing): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'department' => 'nullable|string|max:255',
            'description' => 'sometimes|string',
            'requirements' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'type' => 'sometimes|in:full-time,part-time,contract,internship',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0',
            'status' => 'nullable|in:active,inactive',
        ]);

        $jobListing->update($validated);
        return response()->json(['listing' => $jobListing, 'message' => 'Job listing updated']);
    }

    public function destroy(JobListing $jobListing): JsonResponse
    {
        $jobListing->delete();
        return response()->json(['message' => 'Job listing deleted']);
    }
}
