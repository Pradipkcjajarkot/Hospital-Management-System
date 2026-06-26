<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Doctor extends Model
{
    protected $fillable = [
        'first_name', 'last_name', 'email', 'phone', 'specialization', 'qualification',
        'license_number', 'department', 'experience_years', 'consultation_fee',
        'available_days', 'available_time_start', 'available_time_end',
        'address', 'city', 'state', 'pincode', 'profile_photo_path', 'status',
    ];

    protected $appends = ['full_name', 'profile_photo_url'];

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getProfilePhotoUrlAttribute(): ?string
    {
        return $this->profile_photo_path ? Storage::disk('public')->url($this->profile_photo_path) : null;
    }
}
