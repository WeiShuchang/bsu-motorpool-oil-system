<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DriverResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'driver_full_name' => $this->driver_full_name,
            'email' => $this->email,
            'contact_number' => $this->contact_number,
            'license_number' => $this->license_number,
            'address' => $this->address,
            'status' => $this->status,
            'driver_image' => $this->driver_image ? asset('storage/' . $this->driver_image) : null,
      'vehicles_count' => $this->whenLoaded('vehicles', function() {
    return $this->vehicles->count();
}, 0),
'vehicles' => $this->whenLoaded('vehicles'),

            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}