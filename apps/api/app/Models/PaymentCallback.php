<?php

namespace App\Models;

use App\Enums\PaymentProvider;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentCallback extends Model
{
    //

    use HasFactory;
    protected $fillable = [
        'payment_id',
        'provider',
        'provider_reference',
        'event_type',
        'payload',
        'headers',
        'processed',
        'processed_at',
        'processing_error'
    ];

    protected function casts(): array
    {
        return [
            'payment_id' => 'integer',
            'provider' => PaymentProvider::class,
            'payload' => 'array',
            'headers' => 'array',
            'processed' => 'boolean',
            'processed_at' => 'datetime',
        ];
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }
}
