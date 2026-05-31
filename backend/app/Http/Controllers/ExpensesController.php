<?php

namespace App\Http\Controllers;

use App\Models\Expenses;
use Illuminate\Http\Request;

class ExpensesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $month = $request->month ?? now()->format('m');
        $year = $request->year ?? now()->format('Y');

        $expenses = Expenses::whereMonth('expense_date', $month)
            ->whereYear('expense_date', $year)
            ->orderBy('expense_date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Expenses retrieved successfully',
            'data' => $expenses
        ], 200);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric',
            'expense_date' => 'required|date',
        ]);

        $expense = Expenses::create([
            'description' => $request->description,
            'amount' => $request->amount,
            'expense_date' => $request->expense_date,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Expense created successfully',
            'data' => $expense
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Expenses $expense)
    {
        return response()->json([
            'success' => true,
            'message' => 'Expense retrieved successfully',
            'data' => $expense
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Expenses $expense)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expenses $expense)
    {
        $expense->delete();

        return response()->json([
            'success' => true,
            'message' => 'Expense deleted successfully'
        ], 200);
    }
}
