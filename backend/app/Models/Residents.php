<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Residents extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'full_name',
        'ktp_photo',
        'status',
        'phone_number',
        'is_married',
    ];


    protected function ktpPhoto(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value ? asset('storage/' . $value) : null,
        );
    }

    public function houseHistories()
    {
        return $this->hasMany(HouseHistories::class, 'resident_id');
    }
    public function currentHouse()
    {
        return $this->hasOne(HouseHistories::class, 'resident_id')->whereNull('end_date')->with('house');
    }
}
