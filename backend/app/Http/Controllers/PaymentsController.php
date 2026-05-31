<?php

namespace App\Http\Controllers;

use App\Models\Fees;
use App\Models\HouseHistories;
use App\Models\Houses;
use App\Models\Payments;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class PaymentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $month = $request->month ?? now()->format('m');
        $year = $request->year ?? now()->format('Y');
        $payments = Payments::with(['house:id,house_number', 'resident:id,full_name', 'fee:id,fee_type'])
            ->whereMonth('payment_date', $month)
            ->whereYear('payment_date', $year)
            ->orderBy('payment_date', 'desc')
            ->get()
            ->groupBy(function ($item) {

                return $item->payment_date . '_' . $item->house_id;
            });


        $formatPayments = $payments->map(function ($group) {
            return [
                'id' => $group->first()->id,
                'house_number' => $group->first()->house->house_number,
                'resident_name' => $group->first()->resident->full_name,
                'payment_date' => $group->first()->payment_date,
                'total_amount' => $group->sum('amount'),
                'details' => $group->map(function ($item) {
                    return [
                        'fee_name' => $item->fee->fee_type,
                        'period' => $item->period_date,
                        'amount' => $item->amount
                    ];
                })
            ];
        })->values();

        return response()->json(['success' => true, 'data' => $formatPayments], 200);
    }  /**
       * Store a newly created resource in storage.
       */
    public function store(Request $request)
    {

        $request->validate([
            'house_id' => 'required|exists:houses,id',
            'resident_id' => 'required|exists:residents,id',
            'payment_date' => 'required|date',
            'period_date' => 'required|date',
            'fees' => 'required|array|min:1',
            'fees.*.fee_id' => 'required|exists:fees,id',
            'fees.*.pay_yearly' => 'required|boolean',
        ]);

        $startDate = Carbon::parse($request->period_date)->startOfMonth();

        $requestedFeeIds = collect($request->fees)->pluck('fee_id');

        $feeAmounts = Fees::whereIn('id', $requestedFeeIds)->pluck('amount', 'id');

        $payments = [];

        foreach ($request->fees as $feeItem) {
            $feeId = $feeItem['fee_id'];
            $months = $feeItem['pay_yearly'] ? 12 : 1;
            $amount = $feeAmounts[$feeId];

            $requestedPeriods = [];
            for ($i = 0; $i < $months; $i++) {
                $requestedPeriods[] = $startDate->copy()->addMonths($i)->format('Y-m-d');
            }


            $existingPaidPeriods = Payments::where('house_id', $request->house_id)
                ->where('fee_id', $feeId)
                ->whereIn('period_date', $requestedPeriods)
                ->pluck('period_date')
                ->toArray();

            foreach ($requestedPeriods as $date) {

                if (in_array($date, $existingPaidPeriods)) {
                    continue;
                }

                $payments[] = [
                    'house_id' => $request->house_id,
                    'resident_id' => $request->resident_id,
                    'fee_id' => $feeId,
                    'payment_date' => $request->payment_date,
                    'period_date' => $date,
                    'amount' => $amount,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        if (empty($payments)) {
            return response()->json([
                'success' => true,
                'message' => 'nothing to insert, all requested fees for the period have already been paid.',
                'inserted_count' => 0
            ], 200);
        }

        Payments::insert($payments);

        return response()->json([
            'success' => true,
            'message' => 'Payment recorded successfully',
            'inserted_count' => count($payments)
        ], 201);
    }

    public function getActiveHouses()
    {

        $activeHouses = HouseHistories::with(['house', 'resident'])
            ->whereNull('end_date')
            ->get()
            ->map(function ($history) {
                return [
                    'house_id' => $history->house_id,
                    'house_number' => $history->house->house_number,
                    'resident_id' => $history->resident_id,
                    'resident_name' => $history->resident->full_name,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $activeHouses
        ], 200);
    }

    public function getPaymentStatus(Request $request)
    {
        $request->validate([
            'house_id' => 'required',
            'period_date' => 'required|date'
        ]);

        $period = Carbon::parse($request->period_date);

        $paidFeeIds = Payments::where('house_id', $request->house_id)
            ->whereMonth('period_date', $period->month)
            ->whereYear('period_date', $period->year)
            ->pluck('fee_id')
            ->toArray();

        $allFees = Fees::select('id', 'fee_type', 'amount')->get();
        $processedFees = $allFees->map(function ($fee) use ($paidFeeIds) {
            return [
                'id' => $fee->id,
                'name' => 'Iuran ' . ucfirst($fee->fee_type),
                'amount' => $fee->amount,
                'isPaid' => in_array($fee->id, $paidFeeIds)
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $processedFees
        ], 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Payments $payment)
    {

        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payments $payment)
    {
        $payment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Transaction successfully cancelled'
        ], 200);
    }
}
