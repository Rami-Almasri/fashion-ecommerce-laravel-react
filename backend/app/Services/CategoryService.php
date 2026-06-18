<?php

namespace App\Services;

use App\Models\Category;

class CategoryService
{
    public function getAllCategories()
    {
        return Category::withCount('products')->orderBy('id')->get();
    }

    public function store(array $data): Category
    {
        return Category::create($data);
    }

    public function update(array $data, Category $category): Category
    {
        $category->update($data);
        return $category;
    }

    public function delete(Category $category): Category
    {
        $category->delete();
        return $category;
    }
}
