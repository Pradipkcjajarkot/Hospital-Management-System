<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medicine extends Model
{
    protected $fillable = [
        'medicine_name', 'brand', 'generic_name', 'category', 'unit',
        'price_per_unit', 'quantity_in_stock', 'reorder_level',
        'status', 'expiry_date', 'description',
    ];

    protected function casts(): array
    {
        return [
            'price_per_unit' => 'decimal:2',
            'expiry_date' => 'date',
        ];
    }
}
