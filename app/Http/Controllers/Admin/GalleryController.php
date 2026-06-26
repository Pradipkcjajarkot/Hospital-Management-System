<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['galleryItems' => GalleryItem::orderBy('created_at', 'desc')->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'image_url' => 'required|string|max:255',
            'image_path' => 'nullable|string|max:255',
            'title' => 'nullable|string|max:255',
            'caption' => 'nullable|string',
            'album' => 'nullable|string|max:255',
        ]);

        $data = array_merge($validated, [
            'title' => $validated['title'] ?: ($validated['caption'] ?: 'Gallery Image'),
            'image_path' => $validated['image_path'] ?: '',
        ]);

        $item = GalleryItem::create($data);
        return response()->json(['data' => $item, 'message' => 'Gallery item created'], 201);
    }

    public function show(GalleryItem $galleryItem): JsonResponse
    {
        return response()->json(['galleryItem' => $galleryItem]);
    }

    public function update(Request $request, GalleryItem $galleryItem): JsonResponse
    {
        $validated = $request->validate([
            'image_url' => 'sometimes|string|max:255',
            'image_path' => 'nullable|string|max:255',
            'title' => 'nullable|string|max:255',
            'caption' => 'nullable|string',
            'album' => 'nullable|string|max:255',
        ]);

        $data = array_merge($validated, [
            'title' => $validated['title'] ?? $galleryItem->title,
        ]);

        $galleryItem->update($data);
        return response()->json(['data' => $galleryItem->fresh(), 'message' => 'Gallery item updated']);
    }

    public function destroy(GalleryItem $galleryItem): JsonResponse
    {
        $galleryItem->delete();
        return response()->json(['message' => 'Gallery item deleted']);
    }

    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $path = $request->file('image')->store('gallery', 'public');
        $url = Storage::disk('public')->url($path);

        return response()->json([
            'message' => 'Image uploaded successfully',
            'url' => $url,
            'path' => $path,
        ]);
    }
}
