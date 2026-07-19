<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'type',
        'images',
        'weight_grams',
        'po_quota',
        'po_close_date',
        'po_estimated_shipping',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'images' => 'array',
            'is_published' => 'boolean',
            'price' => 'decimal:2',
            'po_close_date' => 'date',
        ];
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }}
