<?php

namespace App\Models;

use App\Enums\PaymentTransactionType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_id',
        'payment_attempt_id',
        'type',
        'provider_reference',
        'amount_minor',
        'currency',
        'metadata',
    ];



    /**
     * Cast database values into the correct PHP types.
     *
     * In particular:
     *
     * - type becomes PaymentTransactionType enum
     * - amount_minor remains an integer
     * - metadata becomes a PHP array
     */

    protected function casts(): array
    {
        return [
            'payment_id' => 'integer',
            'payment_attempt_id' => 'integer',
            'type' => PaymentTransactionType::class,
            'amount_minor' => 'integer',
            'metadata' => 'array',
        ];
    }


    /**
     * The transaction belongs to the overall payment.
     *
     * Payment
     *   └── has many PaymentTransactions
     */
    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    /**
     * The transaction optionally belongs to a specific
     * payment attempt.
     *
     * This lets us trace exactly which retry produced
     * the transaction.
     */
    public function paymentAttempt(): BelongsTo
    {
        return $this->belongsTo(PaymentAttempt::class);
    }
}
