<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    //
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'short_description',
        'description',
        'status',
        'is_featured',
        'sort_order',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
            'metadata' => 'array',
        ];
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(
            Category::class,
            'product_categories'
        );
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }
    public function occasions(): BelongsToMany
    {
        return $this->belongsToMany(
            Occasion::class,
            'product_occasions'
        );
    }

    public function addons(): BelongsToMany
    {
        return $this->belongsToMany(
            Addon::class,
            'product_addons'
        )
            ->withPivot([
                'price_minor',
                'is_required',
                'max_quantity',
                'sort_order',
            ])
            ->withTimestamps();
    }
}
