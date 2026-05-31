<?php

namespace App\Http\Controllers;

use App\Models\Fees;
use App\Models\HouseHistories;
use App\Models\Houses;
use App\Models\Residents;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class HousesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {


        $houses = Houses::with(['houseHistories.resident', 'payments', 'currentResident'])->get();
        $activeResident = HouseHistories::whereNull('end_date')->pluck('resident_id');
        $residents = Residents::whereNotIn('id', $activeResident)->get(['id', 'full_name']);
        $totalRequiredFee = Fees::sum('amount');

        $houses->map(function ($house) use ($totalRequiredFee) {
            $house->current_resident_name = $house->currentResident?->resident?->full_name ?? "-";
            $billingHistoryMap = [];

            foreach ($house->houseHistories as $history) {
                $start = Carbon::parse($history->start_date)->startOfMonth();
                $end = $history->end_date ? Carbon::parse($history->end_date)->startOfMonth() : now()->startOfMonth();

                while ($start->lte($end)) {
                    $periodKey = $start->format('Y-m');
                    $payments = $house->payments->filter(function ($p) use ($start, $history) {
                        return Carbon::parse($p->period_date)->startOfMonth()->eq($start) &&
                            $p->resident_id == $history->resident_id;
                    });

                    $totalPaid = $payments->sum('amount');
                    if (!isset($billingHistoryMap[$periodKey]) || $totalPaid > 0) {
                        $billingHistoryMap[$periodKey] = [
                            'resident_name' => $history->resident->full_name ?? 'Unknown',
                            'period' => $periodKey,
                            'status' => ($totalPaid >= $totalRequiredFee) ? 'Lunas' : 'Belum Lunas',
                            'amount_paid' => $totalPaid,
                        ];
                    }

                    $start->addMonth();
                }
            }

            $house->billing_history = collect($billingHistoryMap)->sortByDesc('period')->values();
            return $house;
        });

        return response()->json([
            'success' => true,
            'data' => [
                'houses' => $houses,
                'residents' => $residents
            ]
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'house_number' => 'required|string|max:255',
            'current_resident_id' => 'nullable|exists:residents,id',
            'start_date' => 'nullable|date',
        ]);
        $status = $request->filled('current_resident_id') ? 'Dihuni' : 'Tidak Dihuni';
        $house = Houses::create([
            'house_number' => $request->house_number,
            'status' => $status,
        ]);
        if ($request->filled('current_resident_id')) {
            $house->houseHistories()->create([
                'house_id' => $house->id,
                'resident_id' => $request->current_resident_id,
                'start_date' => $request->start_date ?? now(),
                'end_date' => null,
            ]);

        }
        return response()->json(['success' => true, 'message' => 'House created successfully', 'data' => $house->load('currentResident')], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Houses $House)
    {
        $activeResident = HouseHistories::whereNull('end_date')->pluck('resident_id');
        $residents = Residents::whereNotIn('id', $activeResident)->get(['id', 'full_name']);
        return response()->json(['success' => true, 'message' => 'House retrieved successfully', 'data' => ['house' => $House->load('currentResident'), 'resident' => $residents]], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Houses $House)
    {
        $request->validate([
            'house_number' => 'sometimes|required|string|max:255',
            'current_resident_id' => 'nullable|exists:residents,id',
            'start_date' => 'nullable|date',
        ]);


        $currentHistory = $House->houseHistories()->whereNull('end_date')->first();
        $currentResidentId = $currentHistory?->resident_id;

        if ($request->current_resident_id == $currentResidentId) {
            $House->update([
                'house_number' => $request->house_number ?? $House->house_number,
            ]);
            if ($currentHistory && $request->filled('start_date')) {
                $currentHistory->update(['start_date' => $request->start_date]);
            }

        } elseif (!$request->filled('current_resident_id')) {
            if ($currentHistory) {
                $currentHistory->update(['end_date' => now()]);
            }
            $House->update([
                'house_number' => $request->house_number ?? $House->house_number,
                'status' => 'Tidak Dihuni',
            ]);


        } else {
            if ($currentHistory) {
                $currentHistory->update(['end_date' => now()]);
            }
            $House->houseHistories()->create([
                'house_id' => $House->id,
                'resident_id' => $request->current_resident_id,
                'start_date' => $request->start_date ?? now(),
                'end_date' => null,
            ]);
            $House->update([
                'house_number' => $request->house_number ?? $House->house_number,
                'status' => 'Dihuni',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'House updated successfully',
            'data' => $House->load('currentResident')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Houses $House)
    {
        $House->houseHistories()->whereNull('end_date')->update(['end_date' => now()]);
        $House->delete();
        return response()->json(['success' => true, 'message' => 'House deleted successfully'], 200);
    }
}
