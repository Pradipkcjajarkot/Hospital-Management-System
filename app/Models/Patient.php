<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = [
        'first_name', 'last_name', 'email', 'phone', 'dob', 'gender', 'blood_group',
        'address', 'city', 'state', 'pincode',
        'emergency_contact_name', 'emergency_contact_phone',
        'medical_history', 'allergies', 'status',
    ];

    protected $appends = ['full_name'];

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
