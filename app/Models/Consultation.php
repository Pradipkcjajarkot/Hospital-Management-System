<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Consultation extends Model
{
    protected $fillable = ['opd_registration_id', 'doctor_id', 'diagnosis', 'notes', 'investigations', 'follow_up_date'];

    public function opdRegistration(): BelongsTo { return $this->belongsTo(OpdRegistration::class); }
    public function doctor(): BelongsTo { return $this->belongsTo(Doctor::class); }
    public function prescriptions(): HasMany { return $this->hasMany(Prescription::class); }
}
