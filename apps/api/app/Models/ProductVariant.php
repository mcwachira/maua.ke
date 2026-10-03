<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
class ProductVariant extends Model
{
    /** @use HasFactory<\Database\Factories\ProductVariantFactory> */

    // SoftDeletes does not permanently remove a ProductVariant from the database.
    // Instead, Laravel sets the `deleted_at` column when the model is deleted.
    // This allows us to restore the ProductVariant later if needed.
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'product_id',
        'name',
        'sku',
        'price_minor',
        'currency',
        'attributes',
        'is_active',
        'sort_order',
    ];
    protected function casts():array
    {
        return [
            'product_id' => 'integer',
            'price_minor' => 'integer',
            'attributes' => 'array',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function product():BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
    public function inventory()
    {
        return $this->hasOne(Inventory::class);
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }
}
