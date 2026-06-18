<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariantResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'color' => $this->color,
            'size' => $this->size,
            'stock' => (int) $this->stock,
            'age' => $this->age,
            'age_type' => $this->age_type,
        ];
    }
}
