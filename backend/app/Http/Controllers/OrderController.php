<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Models\Order;
use App\Models\Product;
use App\Http\Resources\OrderResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Exception;

class OrderController extends Controller
{
    /** Orders belonging to the authenticated customer. */
    public function myOrders(Request $request)
    {
        try {
            $orders = $request->user()->orders()
                ->with(['items', 'branch'])
                ->latest('placed_at')
                ->get();

            return ResponseHelper::SuccessResponse(OrderResource::collection($orders), 'data fetched successfully', 200);
        } catch (Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    /** Place an order from the cart (online checkout). */
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'nullable|integer',
                'items.*.name' => 'required|string',
                'items.*.color' => 'nullable|string',
                'items.*.size' => 'nullable|string',
                'items.*.quantity' => 'required|integer|min:1',
            ]);

            $order = DB::transaction(function () use ($data, $request) {
                $subtotal = 0;
                $lines = [];

                foreach ($data['items'] as $item) {
                    // Trust the server-side product price when we can resolve it.
                    $product = $item['product_id'] ? Product::find($item['product_id']) : null;
                    $unit = $product ? (float) $product->price : 0;
                    $qty = (int) $item['quantity'];
                    $lineTotal = $unit * $qty;
                    $subtotal += $lineTotal;

                    $lines[] = [
                        'product_id' => $product?->id,
                        'name' => $item['name'],
                        'color' => $item['color'] ?? null,
                        'size' => $item['size'] ?? null,
                        'quantity' => $qty,
                        'unit_price' => $unit,
                        'line_total' => $lineTotal,
                    ];
                }

                $shipping = $subtotal >= 75 ? 0 : 6.95;
                $now = Carbon::now();

                $order = Order::create([
                    'order_number' => 'PM-' . $now->format('ymd') . '-' . str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT),
                    'user_id' => $request->user()->id,
                    'channel' => 'online',
                    'status' => 'paid',
                    'subtotal' => $subtotal,
                    'shipping' => $shipping,
                    'total' => $subtotal + $shipping,
                    'placed_at' => $now,
                ]);

                $order->items()->createMany($lines);

                return $order;
            });

            $order->load(['items', 'customer']);

            return ResponseHelper::SuccessResponse(OrderResource::make($order), 'Order placed successfully', 201);
        } catch (Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }
}
