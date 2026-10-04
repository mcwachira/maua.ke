<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'quantity' => $this->quantity,

            'price_minor' => $this->price_minor,
            'currency' => $this->currency,

            'line_total_minor' => $this->line_total_minor,

            'variant' => [
                'id' => $this->productVariant->id,
                'name' => $this->productVariant->name,
                'sku' => $this->productVariant->sku,

                'product' => [
                    'id' => $this->productVariant->product->id,
                    'name' => $this->productVariant->product->name,
                    'slug' => $this->productVariant->product->slug,
                ],
            ],
        ];
    }
}
