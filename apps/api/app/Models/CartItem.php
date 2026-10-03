<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class CartItem extends Model
{
    use HasFactory;


    protected $fillable = [
        'cart_id',
        'product_variant_id',
        'quantity',
        'price_minor',
        'currency',
    ];


    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'price_minor' => 'integer',
        ];
    }


    /**
     * Item belongs to a cart.
     */
    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }


    /**
     * Item references a purchasable variant.
     *
     * We reference ProductVariant instead of Product
     * because stock and SKU belong to variants.
     */
    public function productVariant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class);
    }


    /**
     * Calculate line total.
     *
     * Example:
     *
     * Rose bouquet
     * price = 3000
     * quantity = 2
     *
     * total = 6000
     */
    public function getLineTotalMinorAttribute(): int
    {

        //$item->line_total_minor;
        return $this->price_minor * $this->quantity;
    }
}
