<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobListing extends Model
{
    protected $fillable = [
        'title', 'department', 'description', 'requirements',
        'location', 'type', 'salary_min', 'salary_max', 'status',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
