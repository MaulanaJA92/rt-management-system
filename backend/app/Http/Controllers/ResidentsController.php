<?php

namespace App\Http\Controllers;

use App\Models\HouseHistories;
use App\Models\Residents;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ResidentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $residents = Residents::all();

        return response()->json(['success' => true, 'data' => $residents], 200);
    }

    public function getAvailableResidents()
    {
        $activeResident = HouseHistories::whereNull('end_date')->pluck('resident_id');
        $residents = Residents::whereNotIn('id', $activeResident)->get(['id', 'full_name']);

        return response()->json(['success' => true, 'data' => $residents], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'full_name' => 'required|string|max:255',
                'ktp_photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
                'status' => 'required|string|max:50',
                'phone_number' => 'required|string|max:20',
                'is_married' => 'required|in:0,1,',
            ]);

            $path = $request->file('ktp_photo')->store('ktp_photos', 'public');

            $resident = Residents::create(array_merge($request->all(), ['ktp_photo' => $path]));
            return response()->json(['success' => true, 'message' => 'Resident created successfully', 'data' => $resident], 201);
        } catch (\Exception $e) {
            if (isset($path)) {
                Storage::disk('public')->delete($path);
            }
            return response()->json(['success' => false, 'message' => 'Failed to create resident', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Residents $resident)
    {
        Log::info('Residents retrieved successfully', ['residents' => $resident]);
        return response()->json(['success' => true, 'message' => 'Resident retrieved successfully', 'data' => $resident], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Residents $resident)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'ktp_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|string|max:50',
            'phone_number' => 'required|string|max:20',
            'is_married' => 'required|in:0,1',
        ]);
        $data = $request->except(['ktp_photo']);

        if ($request->hasFile('ktp_photo')) {

            if ($resident->ktp_photo) {
                Storage::disk('public')->delete($resident->ktp_photo);
            }
            $path = $request->file('ktp_photo')->store('ktp_photos', 'public');
            $data['ktp_photo'] = $path;
        }


        $resident->update($data);
        return response()->json(['success' => true, 'message' => 'Resident updated successfully', 'data' => $resident], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Residents $resident)
    {
        Storage::disk('public')->delete($resident->ktp_photo);
        $resident->delete();
        return response()->json(['success' => true, 'message' => 'Resident deleted successfully'], 200);
    }
}
