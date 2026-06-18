<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    public function run(): void
    {
        $branches = [
            ['name' => 'Lisbon Flagship', 'slug' => 'lisbon', 'city' => 'Lisbon', 'address' => 'Rua das Flores 24', 'phone' => '+351 210 000 001'],
            ['name' => 'Porto Boutique', 'slug' => 'porto', 'city' => 'Porto', 'address' => 'Rua de Santa Catarina 88', 'phone' => '+351 220 000 002'],
            ['name' => 'Madrid Store', 'slug' => 'madrid', 'city' => 'Madrid', 'address' => 'Calle de Serrano 15', 'phone' => '+34 910 000 003'],
            ['name' => 'Paris Atelier', 'slug' => 'paris', 'city' => 'Paris', 'address' => '12 Rue du Marché', 'phone' => '+33 140 000 004'],
        ];

        foreach ($branches as $b) {
            Branch::updateOrCreate(['slug' => $b['slug']], $b);
        }
    }
}
