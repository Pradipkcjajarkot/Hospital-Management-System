<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index(): JsonResponse
    {
        $contacts = Contact::latest()->get();
        return response()->json(['data' => $contacts]);
    }

    public function show(Contact $contact): JsonResponse
    {
        return response()->json(['data' => $contact]);
    }

    public function markRead(Contact $contact): JsonResponse
    {
        $contact->update(['is_read' => true]);
        return response()->json(['message' => 'Marked as read']);
    }

    public function destroy(Contact $contact): JsonResponse
    {
        $contact->delete();
        return response()->json(['message' => 'Contact deleted']);
    }
}
