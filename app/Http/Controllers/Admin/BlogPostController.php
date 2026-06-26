<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlogPostController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['blogPosts' => BlogPost::orderBy('created_at', 'desc')->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'featured_image' => 'nullable|string|max:255',
            'author' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'published_at' => 'nullable|date',
            'status' => 'nullable|in:draft,published',
        ]);

        $post = BlogPost::create($validated);
        return response()->json(['blogPost' => $post, 'message' => 'Blog post created'], 201);
    }

    public function show(BlogPost $blogPost): JsonResponse
    {
        return response()->json(['blogPost' => $blogPost]);
    }

    public function update(Request $request, BlogPost $blogPost): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'excerpt' => 'nullable|string',
            'featured_image' => 'nullable|string|max:255',
            'author' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'published_at' => 'nullable|date',
            'status' => 'nullable|in:draft,published',
        ]);

        $blogPost->update($validated);
        return response()->json(['blogPost' => $blogPost->fresh(), 'message' => 'Blog post updated']);
    }

    public function destroy(BlogPost $blogPost): JsonResponse
    {
        $blogPost->delete();
        return response()->json(['message' => 'Blog post deleted']);
    }
}
