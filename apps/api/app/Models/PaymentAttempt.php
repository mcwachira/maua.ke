<?php

namespace App\Models;

use App\Enums\PaymentAttemptStatus;
use App\Enums\PaymentProvider;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PaymentAttempt extends Model
{

    use HasFactory;
    protected $fillable = [
        'payment_id',
        'attempt_number',
        'provider',
        'provider_reference',
        'amount_minor',
        'status',
        'request_payload',
        'response_payload',
        'failure_code',
        'failure_message',
        'started_at',
        'completed_at',
    ];

    protected  function casts():array
    {
        return [
            'payment_id'=>'integer',
            'attempt_number'=>'integer',
            'amount_minor'=>'integer',

            'provider'=>    PaymentProvider::class,
            'status'=>PaymentAttemptStatus::class,

            'request_payload' =>'array',
            'response_payload' =>'array',

            'started_at'=>'datetime',
            'completed_at'=>'datetime',
        ];
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    /**
     * A payment attempt can generate multiple transaction events.
     *
     * Example:
     *
     * Attempt #1
     *   ├── initiated
     *   ├── processing
     *   └── failed
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(PaymentTransaction::class);
    }
}
