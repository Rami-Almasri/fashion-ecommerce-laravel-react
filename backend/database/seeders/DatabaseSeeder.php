<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            BranchSeeder::class,
            StaffSeeder::class,
            OrderSeeder::class,
        ]);

        // Admin account used to view the dashboard.
        $admin = User::updateOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test Admin', 'password' => Hash::make('password')]
        );
        $admin->syncRoles(['admin']);
    }
}
