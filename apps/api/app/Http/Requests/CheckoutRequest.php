<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [

            'customer_name' => ['required', 'string', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:30'],
            'customer_email' => ['nullable', 'email', 'max:255'],
            'delivery_address' => ['required', 'array'],
            'delivery_address.address_line_1' => ['required', 'string', 'max:255'],
            'delivery_address.address_line_2' => [
                'nullable',
                'string',
                'max:255',
            ],

            'delivery_address.city' => [
                'required',
                'string',
                'max:100',
            ],

            'delivery_address.county' => [
                'required',
                'string',
                'max:100',
            ],

            'delivery_address.postal_code' => [
                'nullable',
                'string',
                'max:20',
            ],

            'delivery_address.country' => [
                'required',
                'string',
                'max:100',
            ],

            'customer_notes' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ];
    }
}
