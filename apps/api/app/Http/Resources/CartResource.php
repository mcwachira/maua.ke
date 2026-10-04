<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\JsonResponse;

class CartResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'status'=>$this->status,
             'items' => CartItemResource::collection(
        $this->whenLoaded('items')
    ),

            'total_price_minor' => $this->total_price_minor,
            'currency' => 'KES',

            'last_activity_at' => $this->last_activity_at,
        ];
    }

    public function withResponse(
        Request $request,
        JsonResponse $response
    ): void {
        $response->setStatusCode(200);
    }
}
