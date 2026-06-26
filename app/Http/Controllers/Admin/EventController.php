<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['events' => Event::orderBy('event_date', 'desc')->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'required|date',
            'event_time' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'image' => 'nullable|string|max:255',
            'status' => 'nullable|in:upcoming,ongoing,completed,cancelled',
        ]);

        $event = Event::create($validated);
        return response()->json(['event' => $event, 'message' => 'Event created'], 201);
    }

    public function show(Event $event): JsonResponse
    {
        return response()->json(['event' => $event]);
    }

    public function update(Request $request, Event $event): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'sometimes|date',
            'event_time' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'image' => 'nullable|string|max:255',
            'status' => 'nullable|in:upcoming,ongoing,completed,cancelled',
        ]);

        $event->update($validated);
        return response()->json(['event' => $event->fresh(), 'message' => 'Event updated']);
    }

    public function destroy(Event $event): JsonResponse
    {
        $event->delete();
        return response()->json(['message' => 'Event deleted']);
    }
}
