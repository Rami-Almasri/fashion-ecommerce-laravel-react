<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        mt_srand(42); // deterministic data

        // --- Customers -------------------------------------------------------
        $names = [
            'Amira Khan', 'Sofia Rossi', 'James Parker', 'Yuki Tanaka', 'Olivia Brown',
            'Noah Schmidt', 'Emma Dubois', 'Liam O\'Brien', 'Aisha Rahman', 'Lucas Costa',
            'Mia Andersson', 'Hassan Ali',
        ];

        $customers = [];
        foreach ($names as $i => $name) {
            $email = Str::slug($name, '.') . '@example.com';
            $user = User::updateOrCreate(
                ['email' => $email],
                ['name' => $name, 'password' => Hash::make('password')]
            );
            $user->syncRoles(['customer']);
            $customers[] = $user;
        }

        $products = Product::with('variants')->get();
        $branches = Branch::with('employees')->get();
        if ($products->isEmpty() || $branches->isEmpty()) {
            return;
        }

        // Weight orders toward a few customers so "best customer" is meaningful.
        $weighted = [];
        foreach ($customers as $idx => $c) {
            $weight = max(1, 8 - $idx); // first customers get many more orders
            for ($w = 0; $w < $weight; $w++) {
                $weighted[] = $c;
            }
        }

        $counter = 1000;
        $orderCount = 140;

        for ($n = 0; $n < $orderCount; $n++) {
            $customer = $weighted[mt_rand(0, count($weighted) - 1)];

            // ~55% in-store (attributed to a branch employee), ~45% online.
            $inStore = mt_rand(1, 100) <= 55;
            $branch = $branches[mt_rand(0, $branches->count() - 1)];
            $employee = null;
            $channel = 'online';
            if ($inStore && $branch->employees->count()) {
                $employee = $branch->employees[mt_rand(0, $branch->employees->count() - 1)];
                $channel = 'in-store';
            }

            $placedAt = Carbon::now()->subDays(mt_rand(0, 180))->subHours(mt_rand(0, 23));

            $order = Order::create([
                'order_number' => 'PM-' . (++$counter),
                'user_id' => $customer->id,
                'employee_id' => $employee?->id,
                'branch_id' => $inStore ? $branch->id : ($channel === 'online' && mt_rand(0, 1) ? $branch->id : null),
                'channel' => $channel,
                'status' => ['paid', 'shipped', 'delivered', 'delivered'][mt_rand(0, 3)],
                'subtotal' => 0,
                'shipping' => 0,
                'total' => 0,
                'placed_at' => $placedAt,
            ]);

            // 1–4 line items.
            $lineCount = mt_rand(1, 4);
            $subtotal = 0;
            for ($l = 0; $l < $lineCount; $l++) {
                $product = $products[mt_rand(0, $products->count() - 1)];
                $variant = $product->variants->count()
                    ? $product->variants[mt_rand(0, $product->variants->count() - 1)]
                    : null;
                $qty = mt_rand(1, 3);
                $unit = (float) $product->price;
                $lineTotal = $unit * $qty;
                $subtotal += $lineTotal;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'color' => $variant?->color,
                    'size' => $variant?->size,
                    'quantity' => $qty,
                    'unit_price' => $unit,
                    'line_total' => $lineTotal,
                ]);
            }

            $shipping = ($channel === 'online' && $subtotal < 75) ? 6.95 : 0;
            $order->update([
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'total' => $subtotal + $shipping,
                'created_at' => $placedAt,
            ]);
        }
    }
}
