<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class StaffSeeder extends Seeder
{
    public function run(): void
    {
        // One manager + a few sales associates per branch.
        $staff = [
            'lisbon' => [['Marta Silva', 'manager'], ['João Costa', 'employee'], ['Inês Lopes', 'employee'], ['Pedro Alves', 'employee']],
            'porto' => [['Rui Ferreira', 'manager'], ['Sofia Marques', 'employee'], ['Tiago Sousa', 'employee']],
            'madrid' => [['Lucía García', 'manager'], ['Diego Romero', 'employee'], ['Carmen Ortiz', 'employee']],
            'paris' => [['Camille Laurent', 'manager'], ['Hugo Moreau', 'employee'], ['Léa Dubois', 'employee']],
        ];

        foreach ($staff as $slug => $people) {
            $branch = Branch::where('slug', $slug)->first();
            if (! $branch) {
                continue;
            }

            foreach ($people as [$name, $role]) {
                $email = Str::slug($name, '.') . '@petitmonde.com';
                $user = User::updateOrCreate(
                    ['email' => $email],
                    [
                        'name' => $name,
                        'password' => Hash::make('password'),
                        'branch_id' => $branch->id,
                        'position' => $role === 'manager' ? 'Branch Manager' : 'Sales Associate',
                    ]
                );
                $user->syncRoles([$role]);
            }
        }
    }
}
