<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;


class Order extends Model
{

    use HasFactory;
    //

    protected $fillable = [
        'user_id',
        'order_number',
        'status',
        'payment_status',
        'subtotal_minor',
        'delivery_fee_minor',
        'discount_minor',
        'total_minor',
        'currency',
        'customer_name',
        'customer_phone',
        'customer_email',
        'delivery_address',
        'customer_notes',
        ];
    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'subtotal_minor' => 'integer',
            'delivery_fee_minor' => 'integer',
            'discount_minor' => 'integer',
            'total_minor' => 'integer',
            'delivery_address' => 'array',
        ];
    }
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }
}
