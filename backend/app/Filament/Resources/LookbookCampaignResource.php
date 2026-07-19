<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LookbookCampaignResource\Pages;
use App\Filament\Resources\LookbookCampaignResource\RelationManagers;
use App\Models\LookbookCampaign;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class LookbookCampaignResource extends Resource
{
    protected static ?string $model = LookbookCampaign::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Campaign Details')->schema([
                    Forms\Components\TextInput::make('title')
                        ->required()
                        ->maxLength(255),
                    Forms\Components\Textarea::make('description')
                        ->columnSpanFull(),
                    Forms\Components\FileUpload::make('background_image')
                        ->image()
                        ->directory('lookbook'),
                    Forms\Components\Toggle::make('is_active')
                        ->default(false),
                ])->columns(2),

                Forms\Components\Section::make('Lookbook Images')->schema([
                    Forms\Components\Repeater::make('images')
                        ->schema([
                            Forms\Components\FileUpload::make('image')
                                ->image()
                                ->directory('lookbook')
                                ->required()
                                ->columnSpanFull(),
                            Forms\Components\Select::make('product_id')
                                ->label('Linked Product')
                                ->options(\App\Models\Product::where('is_published', true)->pluck('name', 'id'))
                                ->searchable()
                                ->preload()
                                ->nullable(),
                            Forms\Components\Select::make('size')
                                ->options([
                                    'small' => 'Small (1/3 Width)',
                                    'medium' => 'Medium (1/2 Width)',
                                    'large' => 'Large (2/3 Width)',
                                    'full' => 'Full Width',
                                ])
                                ->required()
                                ->default('medium'),
                            Forms\Components\Toggle::make('is_grayscale')
                                ->label('Grayscale')
                                ->default(false),
                        ])
                        ->columns(3)
                        ->collapsible()
                        ->defaultItems(1),
                ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->searchable(),
                Tables\Columns\ImageColumn::make('background_image'),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListLookbookCampaigns::route('/'),
            'create' => Pages\CreateLookbookCampaign::route('/create'),
            'edit' => Pages\EditLookbookCampaign::route('/{record}/edit'),
        ];
    }
}
