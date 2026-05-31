<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Expenses extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'description',
        'amount',
        'expense_date',
    ];
}
