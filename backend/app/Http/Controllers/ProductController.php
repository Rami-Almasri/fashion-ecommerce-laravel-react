<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Services\ProductService;
use Exception;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    private $productService;
    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }
    public function index()
    {
        try {
            $products = $this->productService->getAllProducts();
            $result = ProductResource::collection($products);
            return ResponseHelper::SuccessResponse($result, 'data fetched successfully', 200);
        } catch (Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        try {
            $product = $this->productService->store($request->validated());
            $result = ProductResource::make($product);
            return ResponseHelper::SuccessResponse($product, 'Product created successfully', 200);
        } catch (Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        try {
            $result = ProductResource::make($product);
            return ResponseHelper::SuccessResponse($result, 'data fetched successfully', 200);
        } catch (Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        try {
            $product = $this->productService->update($request->validated(), $product);
            $result = ProductResource::make($product);
            return ResponseHelper::SuccessResponse($result, 'Product updated successfully', 200);
        } catch (Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        try {
            $product = $this->productService->delete($product);
            $result = ProductResource::make($product);
            return ResponseHelper::SuccessResponse($result, 'Product deleted successfully', 200);
        } catch (Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }
}
