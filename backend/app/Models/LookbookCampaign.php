<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LookbookCampaign extends Model
{
    protected $fillable = [
        'title',
        'description',
        'background_image',
        'is_active',
        'images',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'images' => 'array',
        ];
    }
}
