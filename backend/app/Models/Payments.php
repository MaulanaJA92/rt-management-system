<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Payments extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'house_id',
        'resident_id',
        'fee_id',
        'payment_date',
        'period_date',
        'amount',
    ];
    public function house()
    {
        return $this->belongsTo(Houses::class, 'house_id');
    }

   
    public function resident()
    {
        return $this->belongsTo(Residents::class, 'resident_id');
    }

      public function fee()
    {
        return $this->belongsTo(Fees::class, 'fee_id');
    }
}
