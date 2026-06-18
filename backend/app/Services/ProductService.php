<?php

namespace App\Services;

use App\Models\Product;

class ProductService
{
    public function getAllProducts()
    {
        return Product::with(['category', 'variants'])->orderBy('id')->get();
    }

    public function findBySlug(string $slug): Product
    {
        return Product::with(['category', 'variants'])->where('slug', $slug)->firstOrFail();
    }

    public function store(array $data)
    {
        $product = Product::create($data);
        return $product->load(['category', 'variants']);
    }

    public function update(array $data, Product $product)
    {
        $product->update($data);
        return $product->load(['category', 'variants']);
    }

    public function delete(Product $product)
    {
        $product->delete();
        return $product;
    }
}
