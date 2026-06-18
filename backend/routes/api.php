<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('auth')->controller(AuthController::class)->group(function () {
    Route::post('/signup', 'signup');
    Route::post('/login', 'login');
    Route::post('/logout', 'logout')->middleware('auth:sanctum');
});

/*
|--------------------------------------------------------------------------
| Public storefront (read-only browsing)
|--------------------------------------------------------------------------
*/
Route::prefix('category')->controller(CategoryController::class)->group(function () {
    Route::get('/', 'index');
    Route::get('/{category}', 'show');
});

Route::prefix('product')->controller(ProductController::class)->group(function () {
    Route::get('/', 'index');
    Route::get('/{product}', 'show');
});

Route::get('/branch', [BranchController::class, 'index']);
Route::get('/branch/{branch}', [BranchController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Authenticated (any signed-in user)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // Customer orders
    Route::get('/orders', [OrderController::class, 'myOrders']);
    Route::post('/orders', [OrderController::class, 'store']);

    // Analytics — controller restricts to admin/manager roles
    Route::prefix('analytics')->controller(AnalyticsController::class)->group(function () {
        Route::get('/dashboard', 'dashboard');
        Route::get('/top-customers', 'topCustomers');
        Route::get('/employee-sales', 'employeeSales');
    });

    // Admin writes
    Route::prefix('category')->controller(CategoryController::class)->group(function () {
        Route::post('/', 'store');
        Route::put('/{category}', 'update');
        Route::delete('/{category}', 'destroy');
    });

    Route::prefix('product')->controller(ProductController::class)->group(function () {
        Route::post('/', 'store');
        Route::post('/{product}', 'update');
        Route::delete('/{product}', 'destroy');
    });

    Route::prefix('branch')->controller(BranchController::class)->group(function () {
        Route::post('/', 'store');
        Route::put('/{branch}', 'update');
        Route::delete('/{branch}', 'destroy');
    });
});
