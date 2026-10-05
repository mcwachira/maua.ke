<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'product_name' => $this->product_name,
            'variant_name' => $this->variant_name,
            'sku' => $this->sku,

            'unit_price_minor' => $this->unit_price_minor,
            'quantity' => $this->quantity,
            'subtotal_minor' => $this->subtotal_minor,

            'currency' => $this->currency,
        ];
    }
}
