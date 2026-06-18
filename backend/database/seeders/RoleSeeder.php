<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // The app's default auth guard is "api" (Sanctum); we also create the
        // "web" set so roles resolve correctly regardless of the active guard.
        foreach (['api', 'web'] as $guard) {
            foreach (['admin', 'manager', 'employee', 'customer'] as $role) {
                Role::firstOrCreate(['name' => $role, 'guard_name' => $guard]);
            }
        }
    }
}
