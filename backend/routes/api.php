<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('auth')->controller(AuthController::class)->group(function () {
    Route::post('/signup',  'signup');
    Route::post('/login',  'login');
    Route::post('/logout',  'logout');
});

Route::middleware('auth:sanctum')->prefix('category')->controller(CategoryController::class)->group(function () {
    Route::get('/',  'index');
    Route::post('/',  'store');
    Route::get('/{category}',  'show');
    Route::put('/{category}',  'update');
    Route::delete('/{category}',  'destroy');
});

Route::middleware('auth:sanctum')->prefix('product')->controller(ProductController::class)->group(function () {
    Route::get('/',  'index');
    Route::post('/',  'store');
    Route::get('/{product}',  'show');
    Route::post('/{product}',  'update');
    Route::delete('/{product}',  'destroy');
});
