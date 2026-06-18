<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BranchResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'city' => $this->city,
            'address' => $this->address,
            'phone' => $this->phone,
            'employees_count' => $this->whenCounted('employees'),
            'employees' => EmployeeResource::collection($this->whenLoaded('employees')),
        ];
    }
}
