<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inventory extends Model
{
    use HasFactory;
 //

    protected $fillable = [
        'product_variant_id',
        'on_hand_quantity',
        'reserve_quantity',
        'reorder_level',
];
    protected function casts():array
    {
        return [
            'on_hand_quantity'=> 'integer',
            'reserve_quantity'=> 'integer',
            'reorder_level'=> 'integer',
        ];
    }

    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class);
    }

    //this creates a virtual field $inventory->available_quantity; which will be the value of  on_hand_quantity - $this->reserved_quantity;
    public function getAvailableQuantityAttribute(): int
    {
        return $this->on_hand_quantity - $this->reserve_quantity;
    }
}
