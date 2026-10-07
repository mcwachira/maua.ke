<?php

namespace App\Models;

use App\Enums\PaymentMethod;
use App\Enums\PaymentProvider;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'reference',
        'amount_minor',
        'currency',
        'status',
        'method',
        'provider',
        'paid_at',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'order_id' => 'integer',
            'amount_minor' => 'integer',

            'status' => PaymentStatus::class,
            'method' => PaymentMethod::class,
            'provider' => PaymentProvider::class,

            'paid_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function attempts(): HasMany
    {
        return $this->hasMany(PaymentAttempt::class);
    }

    /**
     * A payment can have many transaction events.
     *
     * Example:
     *
     * Payment
     *   ├── initiated
     *   ├── processing
     *   └── captured
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(PaymentTransaction::class);
    }

}
