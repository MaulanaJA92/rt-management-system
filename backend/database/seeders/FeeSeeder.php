<?php

namespace Database\Seeders;

use App\Models\Fees;
use Illuminate\Database\Seeder;

class FeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Fees::create([
            'fee_type' => 'satpam',
            'amount' => 100000,
        ]);
        Fees::create([
            'fee_type' => 'kebersihan',
            'amount' => 15000,
        ]);
    }
}
