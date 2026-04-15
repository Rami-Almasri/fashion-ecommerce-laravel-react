<?php

namespace App\Services;

use App\Models\Category;

class CategoryService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }
    public function getAllCategories()
    {
        $categories = Category::all();
        if (empty($categories)) {
            return [];
        }
        return $categories;
    }
    public function store(array $data)
    {
        Category::create($data);
    }
}
