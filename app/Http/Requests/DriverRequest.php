<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DriverRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

        public function rules(): array
{
    $driverId = $this->route('driver')?->id;
    $rules = [
        'driver_full_name' => 'required|string|max:255',
        'email' => 'required|email|unique:driver_models,email,' . $driverId . ',id',
        'contact_number' => 'required|string|max:20',
        'license_number' => 'required|string|unique:driver_models,license_number,' . $driverId . ',id',
        'address' => 'nullable|string',
        'status' => 'required|in:Active,Inactive',
        'vehicle_ids' => 'nullable|array',
        'vehicle_ids.*' => 'exists:vehicle_models,id'
    ];

    // Only validate as image if it's a file upload
    if ($this->hasFile('driver_image')) {
        $rules['driver_image'] = 'image|mimes:jpeg,png,jpg,gif|max:2048';
    } else {
        // If it's not a file, it should be a string (existing path) or null
        $rules['driver_image'] = 'nullable|string';
    }

    return $rules;
}

    public function messages(): array
    {
        return [
            'driver_image.max' => 'The image must not exceed 2MB.',
            'driver_image.mimes' => 'The image must be a JPG, PNG, or GIF file.',
            'email.unique' => 'This email is already registered.',
            'license_number.unique' => 'This license number is already registered.',
            'status.in' => 'Status must be either Active or Inactive.',
        ];
    }
}