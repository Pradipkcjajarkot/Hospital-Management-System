<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OpdVital extends Model
{
    protected $fillable = ['opd_registration_id', 'bp_systolic', 'bp_diastolic', 'pulse', 'temperature', 'respiratory_rate', 'spO2', 'weight', 'height', 'recorded_at'];

    protected $casts = ['recorded_at' => 'datetime'];

    public function opdRegistration(): BelongsTo { return $this->belongsTo(OpdRegistration::class); }
}
