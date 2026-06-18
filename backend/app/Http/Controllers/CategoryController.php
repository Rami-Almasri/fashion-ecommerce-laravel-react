<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Services\CategoryService;
use Exception;

class CategoryController extends Controller
{
    private CategoryService $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index()
    {
        try {
            $categories = $this->categoryService->getAllCategories();
            return ResponseHelper::SuccessResponse(CategoryResource::collection($categories), 'data fetched successfully', 200);
        } catch (Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function store(StoreCategoryRequest $request)
    {
        try {
            $category = $this->categoryService->store($request->validated());
            return ResponseHelper::SuccessResponse(CategoryResource::make($category), 'Category created successfully', 201);
        } catch (Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function show(Category $category)
    {
        try {
            return ResponseHelper::SuccessResponse(CategoryResource::make($category), 'data fetched successfully', 200);
        } catch (Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        try {
            $category = $this->categoryService->update($request->validated(), $category);
            return ResponseHelper::SuccessResponse(CategoryResource::make($category), 'Category updated successfully', 200);
        } catch (Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function destroy(Category $category)
    {
        try {
            $this->categoryService->delete($category);
            return ResponseHelper::SuccessResponse(null, 'Category deleted successfully', 200);
        } catch (Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }
}
