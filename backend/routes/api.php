<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('/login', [App\Http\Controllers\AuthController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [App\Http\Controllers\AuthController::class, 'destroy']);

    Route::apiResource('residents', App\Http\Controllers\ResidentsController::class);
    Route::get('/available-residents', [App\Http\Controllers\ResidentsController::class, 'getAvailableResidents']);
    Route::apiResource('houses', App\Http\Controllers\HousesController::class);
    Route::apiResource('payments', App\Http\Controllers\PaymentsController::class);
    Route::delete('house-histories/{id}', [App\Http\Controllers\HouseHistoriesController::class, 'destroy']);
    Route::apiResource('expenses', App\Http\Controllers\ExpensesController::class);
    Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index']);
    Route::get('/report', [App\Http\Controllers\ReportController::class, 'index']);
    Route::get('/active-houses', [App\Http\Controllers\PaymentsController::class, 'getActiveHouses']);
    Route::get('/payment-status', [App\Http\Controllers\PaymentsController::class, 'getPaymentStatus']);
});
