<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class OrderItem extends Model
{

    use HasFactory;
    //

    protected $fillable = [
        'order_id',
        'product_variant_id',
        'product_name',
        'variant_name',
        'sku',
        'unit_price_minor',
        'quantity',
        'subtotal_minor',
        'currency',

    ];

    protected function casts(): array
    {
        return [
            'order_id' => 'integer',
            'product_variant_id' => 'integer',
            'unit_price_minor' => 'integer',
            'quantity' => 'integer',
            'subtotal_minor' => 'integer',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function productVariant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class);
    }
}
