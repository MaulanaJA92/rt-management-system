<?php

namespace App\Http\Controllers;

use App\Models\HouseHistories;
use Illuminate\Http\Request;

class HouseHistoriesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(HouseHistories $HouseHistories)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, HouseHistories $HouseHistories)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    // HouseHistoriesController
   public function destroy(HouseHistories $history)
{
    
    if (is_null($history->end_date) && !is_null($history->house)) {
        $history->house->update(['status' => 'Tidak Dihuni']);
    } else {
        \Log::warning("History ID: " . $history->id);
    }

    $history->delete();

    return response()->json([
        'success' => true,
        'message' => 'History deleted successfully'
    ]);
}
}
