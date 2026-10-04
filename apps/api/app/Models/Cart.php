<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'session_id',
        'status',
        'last_activity_at'
    ];

    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'last_activity_at' => 'datetime',
        ];
    }

    /**
     * A cart can belong to a registered user.
     *
     * user_id is nullable because guest customers
     * can have carts before creating an account.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }


    /**
     * A cart contains multiple items.
     */
    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }


    /**
     * Calculate cart total.
     *
     * Example:
     * Item 1: 3000 x 2
     * Item 2: 500 x 1
     *
     * Total = 6500
     */
    public function getTotalPriceMinorAttribute(): int
    {
        return $this->items->sum(function ($item) {

            //$cart->total_price_minor;
            return $item->price_minor * $item->quantity;
        });
    }

}
