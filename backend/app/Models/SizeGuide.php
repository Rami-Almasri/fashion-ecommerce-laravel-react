<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SizeGuide extends Model
{
    /** @use HasFactory<\Database\Factories\SizeGuideFactory> */
    use HasFactory;

    protected $fillable = ['sizes'];
    protected $casts = ['sizes' => 'array'];
}
