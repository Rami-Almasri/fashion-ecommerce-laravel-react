<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class AnalyticsController extends Controller
{
    /** Guard: only staff (admin/manager) may view analytics. */
    private function authorizeStaff(Request $request): ?\Illuminate\Http\JsonResponse
    {
        $user = $request->user();
        if (! $user || ! $user->hasAnyRole(['admin', 'manager'])) {
            return ResponseHelper::FailureResponse(null, 'You do not have permission to view analytics.', 403);
        }
        return null;
    }

    /** One call powering the whole dashboard. */
    public function dashboard(Request $request)
    {
        if ($deny = $this->authorizeStaff($request)) {
            return $deny;
        }

        try {
            return ResponseHelper::SuccessResponse([
                'overview' => $this->overviewData(),
                'topCustomers' => $this->topCustomersData(8),
                'employeeSales' => $this->employeeSalesData(),
                'branchPerformance' => $this->branchPerformanceData(),
                'salesByMonth' => $this->salesByMonthData(),
                'recentOrders' => $this->recentOrdersData(),
            ], 'data fetched successfully', 200);
        } catch (Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function topCustomers(Request $request)
    {
        if ($deny = $this->authorizeStaff($request)) {
            return $deny;
        }
        return ResponseHelper::SuccessResponse($this->topCustomersData(20), 'data fetched successfully', 200);
    }

    public function employeeSales(Request $request)
    {
        if ($deny = $this->authorizeStaff($request)) {
            return $deny;
        }
        return ResponseHelper::SuccessResponse($this->employeeSalesData(), 'data fetched successfully', 200);
    }

    // ----- data builders -----------------------------------------------------

    private function overviewData(): array
    {
        $revenue = (float) Order::sum('total');
        $orders = (int) Order::count();
        // Guard-agnostic role match (the app uses the "api" guard for Sanctum).
        $customers = (int) User::whereHas('roles', fn ($q) => $q->where('name', 'customer'))->count();
        $best = $this->topCustomersData(1)[0] ?? null;

        return [
            'revenue' => round($revenue, 2),
            'orders' => $orders,
            'customers' => $customers,
            'avg_order_value' => $orders ? round($revenue / $orders, 2) : 0,
            'best_customer' => $best,
        ];
    }

    /** Best customers — ranked by total spend, with order counts. */
    private function topCustomersData(int $limit): array
    {
        return Order::query()
            ->select('user_id')
            ->selectRaw('COUNT(*) as orders_count')
            ->selectRaw('SUM(total) as total_spent')
            ->selectRaw('MAX(placed_at) as last_order')
            ->groupBy('user_id')
            ->orderByDesc('total_spent')
            ->with('customer:id,name,email')
            ->limit($limit)
            ->get()
            ->map(fn ($row) => [
                'id' => $row->user_id,
                'name' => $row->customer?->name ?? 'Unknown',
                'email' => $row->customer?->email,
                'orders' => (int) $row->orders_count,
                'total_spent' => round((float) $row->total_spent, 2),
                'avg_order' => $row->orders_count ? round($row->total_spent / $row->orders_count, 2) : 0,
                'last_order' => $row->last_order ? substr($row->last_order, 0, 10) : null,
            ])
            ->values()
            ->all();
    }

    /** Each employee and how much they sold, grouped under their branch. */
    private function employeeSalesData(): array
    {
        return Order::query()
            ->whereNotNull('employee_id')
            ->select('employee_id')
            ->selectRaw('COUNT(*) as orders_count')
            ->selectRaw('SUM(total) as total_sold')
            ->groupBy('employee_id')
            ->orderByDesc('total_sold')
            ->with('employee:id,name,position,branch_id', 'employee.branch:id,name')
            ->get()
            ->map(fn ($row) => [
                'id' => $row->employee_id,
                'name' => $row->employee?->name ?? 'Unknown',
                'position' => $row->employee?->position,
                'branch' => $row->employee?->branch?->name,
                'orders' => (int) $row->orders_count,
                'total_sold' => round((float) $row->total_sold, 2),
            ])
            ->values()
            ->all();
    }

    private function branchPerformanceData(): array
    {
        return Order::query()
            ->whereNotNull('branch_id')
            ->select('branch_id')
            ->selectRaw('COUNT(*) as orders_count')
            ->selectRaw('SUM(total) as revenue')
            ->groupBy('branch_id')
            ->orderByDesc('revenue')
            ->with('branch:id,name,city')
            ->get()
            ->map(fn ($row) => [
                'id' => $row->branch_id,
                'name' => $row->branch?->name ?? 'Unknown',
                'city' => $row->branch?->city,
                'orders' => (int) $row->orders_count,
                'revenue' => round((float) $row->revenue, 2),
            ])
            ->values()
            ->all();
    }

    private function salesByMonthData(): array
    {
        return Order::query()
            ->selectRaw("substr(placed_at, 1, 7) as month")
            ->selectRaw('SUM(total) as revenue')
            ->selectRaw('COUNT(*) as orders_count')
            ->whereNotNull('placed_at')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn ($row) => [
                'month' => $row->month,
                'revenue' => round((float) $row->revenue, 2),
                'orders' => (int) $row->orders_count,
            ])
            ->values()
            ->all();
    }

    private function recentOrdersData(): array
    {
        return Order::query()
            ->with(['customer:id,name', 'employee:id,name', 'branch:id,name'])
            ->latest('placed_at')
            ->limit(8)
            ->get()
            ->map(fn ($o) => [
                'order_number' => $o->order_number,
                'customer' => $o->customer?->name,
                'employee' => $o->employee?->name,
                'branch' => $o->branch?->name,
                'channel' => $o->channel,
                'total' => round((float) $o->total, 2),
                'placed_at' => optional($o->placed_at)->toDateString(),
            ])
            ->values()
            ->all();
    }
}
