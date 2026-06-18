<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Exception;

class AuthController extends Controller
{
    /** Shape the authenticated user for the frontend (includes role + branch). */
    private function payload(User $user, string $token): array
    {
        return [
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->primaryRole() ?? 'customer',
                'roles' => $user->getRoleNames(),
                'branch_id' => $user->branch_id,
                'position' => $user->position,
            ],
        ];
    }

    public function signup(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'max:255', 'unique:users,email'],
                'password' => ['required', 'string', 'min:6', 'confirmed'],
            ]);

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ]);

            $user->assignRole('customer');

            $token = $user->createToken('storefront')->plainTextToken;

            return ResponseHelper::SuccessResponse(
                $this->payload($user, $token),
                'Account created successfully',
                201
            );
        } catch (ValidationException $e) {
            return ResponseHelper::FailureResponse($e->errors(), $e->getMessage(), 422);
        } catch (Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function login(Request $request)
    {
        try {
            $data = $request->validate([
                'email' => ['required', 'email'],
                'password' => ['required', 'string'],
            ]);

            $user = User::where('email', $data['email'])->first();

            if (! $user || ! Hash::check($data['password'], $user->password)) {
                return ResponseHelper::FailureResponse(null, 'These credentials do not match our records.', 401);
            }

            $token = $user->createToken('storefront')->plainTextToken;

            return ResponseHelper::SuccessResponse(
                $this->payload($user, $token),
                'Logged in successfully',
                200
            );
        } catch (ValidationException $e) {
            return ResponseHelper::FailureResponse($e->errors(), $e->getMessage(), 422);
        } catch (Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function logout(Request $request)
    {
        try {
            $user = $request->user();
            if ($user) {
                $user->currentAccessToken()?->delete();
            }
            return ResponseHelper::SuccessResponse(null, 'Logged out successfully', 200);
        } catch (Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }
}
