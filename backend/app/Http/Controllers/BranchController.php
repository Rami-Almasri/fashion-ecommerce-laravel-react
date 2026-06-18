<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Models\Branch;
use App\Http\Resources\BranchResource;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Exception;

class BranchController extends Controller
{
    public function index()
    {
        try {
            $branches = Branch::withCount('employees')
                ->with(['employees' => fn ($q) => $q->with('roles')])
                ->orderBy('id')
                ->get();

            return ResponseHelper::SuccessResponse(BranchResource::collection($branches), 'data fetched successfully', 200);
        } catch (Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function show(Branch $branch)
    {
        try {
            $branch->loadCount('employees')->load(['employees.roles']);
            return ResponseHelper::SuccessResponse(BranchResource::make($branch), 'data fetched successfully', 200);
        } catch (Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'city' => 'nullable|string|max:255',
                'address' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:50',
            ]);
            $data['slug'] = Str::slug($data['name']);
            $branch = Branch::create($data);

            return ResponseHelper::SuccessResponse(BranchResource::make($branch), 'Branch created successfully', 201);
        } catch (Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function update(Request $request, Branch $branch)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'city' => 'nullable|string|max:255',
                'address' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:50',
            ]);
            $branch->update($data);

            return ResponseHelper::SuccessResponse(BranchResource::make($branch), 'Branch updated successfully', 200);
        } catch (Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function destroy(Branch $branch)
    {
        try {
            $branch->delete();
            return ResponseHelper::SuccessResponse(null, 'Branch deleted successfully', 200);
        } catch (Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }
}
