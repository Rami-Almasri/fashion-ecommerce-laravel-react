<?php

namespace App\Services;

use App\Models\Product;

class ProductService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }
    public function getAllProducts()
    {
        $products = Product::all();
        if (empty($products)) {
            return [];
        }
        return $products;
    }
    public function store(array $data)
    {
        $products = Product::create($data);
        return $products;
    }
    public function update(array $data, Product $product)
    {
        $product->update($data);
        return $product;
    }
    public function delete(Product $product)
    {
        $product->delete();
        return $product;
    }
}
