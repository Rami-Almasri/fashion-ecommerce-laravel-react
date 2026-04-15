<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|unique:products,name',
            'type' => [
                'required',
                'string',
                Rule::in(
                    'pajamas',
                    'sweater',
                    'pants',
                    'jacket',
                    't-shirt',    // تيشرت
                    'suit',       // طقم
                    'dress',      // فستان
                    'jumpsuit',
                    'hoodie',     // هودي
                    'shorts',     // شورت
                    'skirt',
                ),
            ],
            'season' => 'required|string|in:summer,winter',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }
}
