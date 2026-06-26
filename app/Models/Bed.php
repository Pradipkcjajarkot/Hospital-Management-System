<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Bed extends Model
{
    protected $fillable = [
        'ward_name', 'ward_type', 'bed_number', 'bed_type', 'floor',
        'rate_per_day', 'status', 'patient_id', 'assigned_at', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'rate_per_day' => 'decimal:2',
            'assigned_at' => 'date',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }
}
