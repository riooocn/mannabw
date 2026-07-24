<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use App\Models\Order;
use App\Models\Product;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Revenue', 'Rp ' . number_format(Order::where('status', '!=', 'cancelled')->sum('total_amount'), 0, ',', '.'))
                ->description('All successful orders')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success'),
            Stat::make('New Orders', Order::where('status', 'processing')->count())
                ->description('Orders waiting to be shipped')
                ->descriptionIcon('heroicon-m-shopping-bag')
                ->color('warning'),
            Stat::make('Active Products', Product::where('is_published', true)->count())
                ->description('Currently visible on storefront')
                ->color('primary'),
        ];
    }
}
