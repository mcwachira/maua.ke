<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=> $this->order_number,
            'order_number' => $this->order_number,

            'status' => $this->status,
            'payment_status' => $this->payment_status,

            'subtotal_minor' => $this->subtotal_minor,
            'delivery_fee_minor' => $this->delivery_fee_minor,
            'discount_minor' => $this->discount_minor,
            'total_minor' => $this->total_minor,

            'currency' => $this->currency,

            'customer' => [
                'name' => $this->customer_name,
                'phone' => $this->customer_phone,
                'email' => $this->customer_email,
            ],

            'delivery_address' => $this->delivery_address,

            'customer_notes' => $this->customer_notes,

            'items' => OrderItemResource::collection(
                $this->whenLoaded('items')
            ),

            'created_at' => $this->created_at,
        ];
    }
}
