<?php

namespace App\Http\Controllers;

use App\Models\Expenses;
use App\Models\Payments;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
      
        $totalIncome = Payments::sum('amount');
        $totalExpense = Expenses::sum('amount');
        $totalBalance = $totalIncome - $totalExpense;

        $chartData = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->startOfMonth()->subMonths($i);
            $month = $date->format('m');
            $year = $date->format('Y');
            $monthName = $date->format('M Y'); 

            $income = Payments::whereMonth('created_at', $month)
                             ->whereYear('created_at', $year)
                             ->sum('amount');

            $expense = Expenses::whereMonth('expense_date', $month)
                              ->whereYear('expense_date', $year)
                              ->sum('amount');

            $chartData[] = [
                'month' => $monthName,
                'income' => (int) $income,
                'expense' => (int) $expense,
                'balance' => (int) ($income - $expense)
            ];
        }

       
        return response()->json([
            'success' => true,
            'message' => 'Data dashboard successfully retrieved',
            'data' => [
                'summary' => [
                    'income' => (int) $totalIncome,
                    'expense' => (int) $totalExpense,
                    'balance' => (int) $totalBalance,
                ],
                'chart' => $chartData
            ]
        ], 200);
    }
}