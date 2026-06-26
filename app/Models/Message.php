<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    protected $fillable = ['conversation_id', 'sender_type', 'sender_id', 'message', 'is_read'];

    protected $casts = ['is_read' => 'boolean'];

    public function conversation(): BelongsTo { return $this->belongsTo(Conversation::class); }
}
