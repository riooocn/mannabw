<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Models\Order;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Illuminate\Support\Facades\Http;
use Filament\Notifications\Notification;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-cart';
    protected static ?string $navigationGroup = 'Shop Management';
    protected static ?int $navigationSort = 1;

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Infolists\Components\Section::make('Status & Info Dasar')
                    ->schema([
                        Infolists\Components\TextEntry::make('id')->label('Order ID'),
                        Infolists\Components\TextEntry::make('created_at')->dateTime()->label('Tanggal Pemesanan'),
                        Infolists\Components\TextEntry::make('total_amount')->money('IDR')->label('Total Harga'),
                        Infolists\Components\TextEntry::make('status')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'pending_payment' => 'warning',
                                'processing' => 'info',
                                'shipped' => 'primary',
                                'completed' => 'success',
                                'cancelled' => 'danger',
                                default => 'gray',
                            }),
                    ])->columns(4),

                Infolists\Components\Section::make('Informasi Pelanggan (Pembeli)')
                    ->description('Hubungi kontak ini untuk urusan pembayaran atau pengembalian dana (refund).')
                    ->schema([
                        Infolists\Components\TextEntry::make('user.name')->label('Nama Pelanggan'),
                        Infolists\Components\TextEntry::make('user.email')->label('Email Pelanggan'),
                        Infolists\Components\TextEntry::make('user.phone_number')->label('No. HP Pelanggan')->default('-'),
                    ])->columns(3),

                Infolists\Components\Section::make('Informasi Penerima & Alamat Pengiriman')
                    ->description('Kirimkan pesanan ke kontak dan alamat di bawah ini.')
                    ->schema([
                        Infolists\Components\TextEntry::make('address.recipient_name')->label('Nama Penerima'),
                        Infolists\Components\TextEntry::make('address.phone_number')->label('No. HP Penerima'),
                        Infolists\Components\TextEntry::make('address.full_address')->label('Alamat Lengkap')->columnSpanFull(),
                    ])->columns(2),

                Infolists\Components\Section::make('Catatan Pengantaran')
                    ->schema([
                        Infolists\Components\TextEntry::make('courier')
                            ->label('Metode Pengiriman')
                            ->formatStateUsing(fn ($state) => $state === 'manual' ? 'Dikirim Penjual' : strtoupper($state ?? '')),
                        Infolists\Components\TextEntry::make('tracking_number')
                            ->label('Catatan Pengiriman / Nama Pengantar')
                            ->default('-'),
                    ])->columns(2),

                Infolists\Components\Section::make('Daftar Barang')
                    ->schema([
                        Infolists\Components\RepeatableEntry::make('items')
                            ->label('')
                            ->schema([
                                Infolists\Components\TextEntry::make('productVariant.product.name')->label('Nama Produk'),
                                Infolists\Components\TextEntry::make('productVariant.size')->label('Size'),
                                Infolists\Components\TextEntry::make('quantity')->label('Qty Dipesan'),
                                Infolists\Components\TextEntry::make('productVariant.stock')->label('Sisa Stok Saat Ini')
                                    ->badge()
                                    ->color(fn ($state) => $state > 5 ? 'success' : ($state > 0 ? 'warning' : 'danger')),
                                Infolists\Components\TextEntry::make('price')->money('IDR')->label('Harga Satuan'),
                            ])->columns(5),
                    ])
            ]);
    }

    // We don't need the form() anymore since we use Infolist for View and ManageOrders doesn't allow Create/Edit
    public static function form(Form $form): Form
    {
        return $form->schema([]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')->label('ID')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('user.name')->label('Pelanggan')->searchable(),
                Tables\Columns\TextColumn::make('total_amount')->label('Total Harga')->money('IDR')->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending_payment' => 'warning',
                        'processing' => 'info',
                        'shipped' => 'primary',
                        'completed' => 'success',
                        'cancelled' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('courier')
                    ->label('Metode Pengiriman')
                    ->formatStateUsing(fn ($state) => $state === 'manual' ? 'Dikirim Penjual' : strtoupper($state ?? '')),
                Tables\Columns\TextColumn::make('tracking_number')->label('Resi / Catatan')->searchable(),
                Tables\Columns\TextColumn::make('created_at')->label('Tanggal')->dateTime()->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending_payment' => 'Pending Payment',
                        'processing' => 'Processing (Ready to Ship)',
                        'shipped' => 'Shipped',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                    ]),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\Action::make('markAsShipped')
                    ->label('Tandai Dikirim')
                    ->icon('heroicon-o-check-circle')
                    ->color('primary')
                    ->requiresConfirmation()
                    ->modalHeading('Tandai Pesanan Sebagai Dikirim')
                    ->modalDescription('Apakah Anda yakin pesanan ini sudah diantar/dikirim? Anda dapat menambahkan catatan pengiriman opsional.')
                    ->form([
                        Forms\Components\Textarea::make('tracking_number')
                            ->label('Catatan Pengiriman / Nama Pengantar')
                            ->placeholder('Contoh: Diantar oleh Budi, atau biarkan kosong.')
                    ])
                    ->visible(fn (Order $record) => $record->status === 'processing')
                    ->action(function (Order $record, array $data) {
                        $record->update([
                            'tracking_number' => $data['tracking_number'] ?? null,
                            'status' => 'shipped'
                        ]);

                        Notification::make()->title('Pesanan berhasil ditandai sebagai dikirim!')->success()->send();
                    }),
                Tables\Actions\Action::make('markAsCompleted')
                    ->label('Tandai Selesai')
                    ->icon('heroicon-o-check-badge')
                    ->color('success')
                    ->requiresConfirmation()
                    ->modalHeading('Selesaikan Pesanan')
                    ->modalDescription('Apakah Anda yakin pesanan ini sudah sampai di tangan pembeli dengan selamat?')
                    ->visible(fn (Order $record) => $record->status === 'shipped')
                    ->action(function (Order $record) {
                        $record->update(['status' => 'completed']);
                        Notification::make()->title('Pesanan berhasil diselesaikan!')->success()->send();
                    }),
                Tables\Actions\Action::make('cancelOrder')
                    ->label('Batalkan Pesanan')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->modalHeading('Batalkan Pesanan')
                    ->modalDescription(fn (Order $record) => 
                        $record->status === 'processing' 
                        ? 'PERHATIAN: Pesanan ini sudah dibayar lunas oleh pelanggan. Jika dibatalkan, Anda WAJIB menghubungi pelanggan secara manual untuk mentransfer balik uangnya. Masukkan alasan pembatalan di bawah ini:'
                        : 'Apakah Anda yakin ingin membatalkan pesanan ini? Masukkan alasan pembatalan di bawah ini:'
                    )
                    ->form([
                        Forms\Components\Textarea::make('cancellation_reason')
                            ->label('Alasan Batal')
                            ->required()
                            ->placeholder('Contoh: Maaf, stok ternyata habis.')
                    ])
                    ->visible(fn (Order $record) => in_array($record->status, ['pending_payment', 'processing']))
                    ->action(function (Order $record, array $data) {
                        $record->update([
                            'tracking_number' => $data['cancellation_reason'],
                            'status' => 'cancelled'
                        ]);

                        Notification::make()->title('Pesanan berhasil dibatalkan!')->success()->send();
                    }),
            ])
            ->bulkActions([
                // 
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageOrders::route('/'),
        ];
    }
}
