<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\HouseHistories;
use Illuminate\Database\Eloquent\SoftDeletes;
class Houses extends Model
{
    use SoftDeletes;
    protected $fillable = ['house_number', 'status'];

    public function houseHistories()
    {
        return $this->hasMany(HouseHistories::class, 'house_id')->with('resident');
    }

    public function currentResident()
    {
        return $this->hasOne(HouseHistories::class, 'house_id')->whereNull('end_date')->with('resident');
    }

    public function payments()
    {
      
        return $this->hasMany(Payments::class, 'house_id');
    }
}
