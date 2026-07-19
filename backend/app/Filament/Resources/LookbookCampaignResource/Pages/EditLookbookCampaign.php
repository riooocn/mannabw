<?php

namespace App\Filament\Resources\LookbookCampaignResource\Pages;

use App\Filament\Resources\LookbookCampaignResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditLookbookCampaign extends EditRecord
{
    protected static string $resource = LookbookCampaignResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
