<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array shaped for the React storefront.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'description' => $this->description,
            'type' => $this->type,
            'season' => $this->season,
            'price' => (float) $this->price,
            'originalPrice' => $this->original_price ? (float) $this->original_price : null,
            'rating' => (float) $this->rating,
            'reviews' => (int) $this->reviews,
            'badges' => $this->badges ?? [],
            'images' => $this->images ?? [],
            'image' => $this->images[0] ?? null,
            'colors' => $this->colors ?? [],
            'details' => $this->details ?? [],
            'category' => $this->whenLoaded('category', fn () => $this->category?->type, optional($this->category)->type),
            'category_id' => $this->category_id,
            'variants' => ProductVariantResource::collection($this->whenLoaded('variants')),
        ];
    }
}
