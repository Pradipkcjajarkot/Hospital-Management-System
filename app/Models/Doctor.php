<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    protected $fillable = [
        'first_name', 'last_name', 'email', 'phone', 'specialization', 'qualification',
        'license_number', 'department', 'experience_years', 'consultation_fee',
        'available_days', 'available_time_start', 'available_time_end',
        'address', 'city', 'state', 'pincode', 'profile_photo_path', 'status',
    ];

    protected $appends = ['full_name'];

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
