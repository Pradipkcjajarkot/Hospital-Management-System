<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function conversations(): JsonResponse
    {
        $conversations = Conversation::with(['patient', 'doctor'])
            ->withCount(['messages as unread_count' => fn($q) => $q->where('is_read', false)->where('sender_type', '!=', 'admin')])
            ->latest('last_message_at')->get();
        return response()->json(['conversations' => $conversations]);
    }

    public function show(Conversation $conversation): JsonResponse
    {
        $conversation->load(['patient', 'doctor', 'messages']);
        Message::where('conversation_id', $conversation->id)->where('sender_type', '!=', 'admin')->update(['is_read' => true]);
        return response()->json(['conversation' => $conversation]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'nullable|exists:doctors,id',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $conversation = Conversation::create([
            'patient_id' => $validated['patient_id'],
            'doctor_id' => $validated['doctor_id'] ?? null,
            'subject' => $validated['subject'],
            'last_message_at' => now(),
        ]);

        Message::create([
            'conversation_id' => $conversation->id,
            'sender_type' => 'admin',
            'sender_id' => $request->user()?->id ?? 1,
            'message' => $validated['message'],
        ]);

        $conversation->load(['patient', 'doctor']);
        return response()->json(['conversation' => $conversation, 'message' => 'Conversation created'], 201);
    }

    public function reply(Request $request, Conversation $conversation): JsonResponse
    {
        $validated = $request->validate(['message' => 'required|string']);

        Message::create([
            'conversation_id' => $conversation->id,
            'sender_type' => 'admin',
            'sender_id' => $request->user()?->id ?? 1,
            'message' => $validated['message'],
        ]);

        $conversation->update(['last_message_at' => now()]);
        $conversation->load('messages');

        return response()->json(['conversation' => $conversation, 'message' => 'Reply sent']);
    }

    public function unreadCount(): JsonResponse
    {
        $count = Message::where('is_read', false)->where('sender_type', '!=', 'admin')
            ->whereHas('conversation')->count();
        return response()->json(['unread_count' => $count]);
    }
}
