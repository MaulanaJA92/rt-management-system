<?php

namespace App\Http\Controllers;

use App\Models\Expenses;
use App\Models\Payments;
use Illuminate\Http\Request;

class ReportController extends Controller
{

    public function index(Request $request)
    {


        $month = $request->month ?? now()->format('m');
        $year = $request->year ?? now()->format('Y');

       
        $incomes = Payments::with(['house.currentResident', 'fee'])
            ->whereMonth('created_at', $month)
            ->whereYear('created_at', $year)
            ->get();

        
        $expenses = Expenses::whereMonth('expense_date', $month)
            ->whereYear('expense_date', $year)
            ->get();

    
        $totalIncome = $incomes->sum('amount');
        $totalExpense = $expenses->sum('amount');
        $totalBalance = $totalIncome - $totalExpense;

        return response()->json([
            'success' => true,
            'message' => "Report data for $month-$year successfully retrieved",
            'data' => [
                'summary' => [
                    'total_income' => $totalIncome,
                    'total_expense' => $totalExpense,
                    'balance' => $totalBalance
                ],
                'details' => [
                    'incomes' => $incomes,
                    'expenses' => $expenses
                ]
            ]
        ], 200);
    }

}
