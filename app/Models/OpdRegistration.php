<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class OpdRegistration extends Model
{
    protected $fillable = ['patient_id', 'doctor_id', 'appointment_id', 'registration_date', 'complaints', 'symptoms', 'status'];

    public function patient(): BelongsTo { return $this->belongsTo(Patient::class); }
    public function doctor(): BelongsTo { return $this->belongsTo(Doctor::class); }
    public function vitals(): HasMany { return $this->hasMany(OpdVital::class); }
    public function consultation(): HasOne { return $this->hasOne(Consultation::class); }
}
