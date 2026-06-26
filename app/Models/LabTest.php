<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LabTest extends Model
{
    protected $fillable = [
        'test_name', 'patient_id', 'doctor_id', 'test_category', 'sample_type',
        'test_date', 'result_date', 'result', 'normal_range', 'status', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'test_date' => 'date',
            'result_date' => 'date',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }
}
