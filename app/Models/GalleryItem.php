<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GalleryItem extends Model
{
    protected $fillable = ['title', 'image_path', 'image_url', 'description', 'caption', 'category', 'album'];
}
