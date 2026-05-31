<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HouseHistories extends Model
{
    protected $fillable = ['house_id', 'resident_id', 'start_date', 'end_date'];

    public function house()
    {
        return $this->belongsTo(Houses::class, 'house_id');
    }

    public function resident()
    {
        return $this->belongsTo(Residents::class, 'resident_id');
    }
}
