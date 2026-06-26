<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json(['settings' => $settings]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*' => 'nullable|string',
        ]);

        foreach ($validated['settings'] as $key => $value) {
            Setting::setValue($key, $value);
        }

        $settings = Setting::all()->pluck('value', 'key');
        return response()->json(['settings' => $settings, 'message' => 'Settings updated successfully']);
    }

    public function updateLanguage(Request $request): JsonResponse
    {
        $validated = $request->validate(['language' => 'required|in:en,ne']);
        Setting::setValue('language', $validated['language']);
        return response()->json(['message' => 'Language updated']);
    }
}
