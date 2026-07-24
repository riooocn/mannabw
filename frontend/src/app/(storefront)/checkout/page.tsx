'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { fetchApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Truck, CheckCircle2 } from 'lucide-react';

declare global {
    interface Window {
        snap: any;
    }
}

export default function CheckoutPage() {
    const { cart, isLoading: isCartLoading, fetchCart } = useCart();
    const { user, isLoading: isUserLoading } = useAuth();
    const router = useRouter();

    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const items = cart?.items || [];
    const subtotal = items.reduce((acc, item) => acc + (parseFloat(item.product_variant.product.price) * item.quantity), 0);
    const shippingCost = 0; // Manual delivery, no shipping fee
    const total = subtotal + shippingCost;

    useEffect(() => {
        if (isUserLoading) return;
        
        if (!user) {
            router.push('/login');
            return;
        }
        
        // Fetch addresses
        fetchApi('/api/addresses')
            .then(data => {
                setAddresses(data);
                const defaultAddr = data.find((a: any) => a.is_default);
                if (defaultAddr) setSelectedAddressId(defaultAddr.id);
                else if (data.length > 0) setSelectedAddressId(data[0].id);
            })
            .catch(err => console.error(err));
    }, [user, router, isUserLoading]);

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            alert('Please select an address');
            return;
        }

        setIsPlacingOrder(true);
        try {
            const data = await fetchApi('/api/checkout', {
                method: 'POST',
                body: JSON.stringify({
                    address_id: selectedAddressId,
                    courier: 'manual',
                    courier_service: 'manual',
                    shipping_cost: 0
                })
            });
            
            if (data.snap_token) {
                window.snap.pay(data.snap_token, {
                    onSuccess: function(result: any){
                        setIsSuccess(true);
                        fetchCart();
                    },
                    onPending: function(result: any){
                        router.push('/orders');
                        fetchCart();
                    },
                    onError: function(result: any){
                        alert("Pembayaran gagal!");
                        setIsPlacingOrder(false);
                    },
                    onClose: function(){
                        router.push('/orders');
                        fetchCart();
                    }
                });
            } else {
                setIsSuccess(true);
                fetchCart(); // refresh cart (should be empty now)
            }
        } catch (error: any) {
            console.error('Failed to place order:', error);
            alert(error.data?.message || 'Failed to place order');
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface p-4">
                <div className="max-w-md w-full bg-surface-container border border-primary p-8 text-center flex flex-col items-center">
                    <CheckCircle2 className="w-16 h-16 text-primary mb-6" />
                    <h1 className="font-anton text-3xl uppercase mb-2">Order Placed!</h1>
                    <p className="font-inter text-on-surface-variant mb-8 text-sm">
                        Pesanan Anda berhasil dibuat dan sedang menunggu pembayaran.
                        (Simulasi tanpa Midtrans).
                    </p>
                    <Button variant="primary" className="w-full py-6 text-lg" onClick={() => router.push('/')}>
                        KEMBALI KE BERANDA
                    </Button>
                </div>
            </div>
        );
    }

    if (isCartLoading || !cart) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-surface">
                <h1 className="font-anton text-3xl uppercase tracking-widest mb-4">Keranjang Kosong</h1>
                <Button variant="outline" onClick={() => router.push('/lookbook')} className="py-6 px-8 text-lg border-2">
                    KEMBALI BELANJA
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface p-4 md:p-12">
            <h1 className="font-anton text-4xl uppercase tracking-widest mb-8 border-b-4 border-primary pb-4">Checkout</h1>
            
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column - Forms */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Address Selection */}
                    <div className="bg-surface-container border border-primary p-6">
                        <div className="flex items-center gap-2 mb-6 border-b border-primary pb-4">
                            <MapPin className="w-5 h-5" />
                            <h2 className="font-anton text-xl uppercase tracking-wider">Alamat Pengiriman</h2>
                        </div>
                        
                        {addresses.length === 0 ? (
                            <div className="text-center py-6">
                                <p className="mb-4 text-sm font-bold uppercase">Belum ada alamat tersimpan.</p>
                                <Button variant="outline" onClick={() => router.push('/address')}>Tambah Alamat</Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {addresses.map(addr => (
                                    <div 
                                        key={addr.id} 
                                        onClick={() => setSelectedAddressId(addr.id)}
                                        className={`border p-4 cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'border-primary bg-surface-container-low' : 'border-primary/20 hover:border-primary'}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="font-bold text-sm uppercase">{addr.label}</p>
                                            {addr.is_default && <span className="bg-primary text-on-primary text-[10px] px-2 py-1 font-bold uppercase tracking-widest">Utama</span>}
                                        </div>
                                        <p className="font-bold">{addr.recipient_name} | {addr.phone_number}</p>
                                        <p className="text-sm text-on-surface-variant mt-1">{addr.full_address}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Removed Shipping Rates Selection */}
                </div>

                {/* Right Column - Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-surface-container border border-primary p-6 sticky top-24">
                        <h2 className="font-anton text-xl uppercase tracking-wider mb-6 border-b border-primary pb-4">Ringkasan Pesanan</h2>
                        
                        <div className="space-y-4 mb-6">
                            {items.map(item => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-16 h-20 bg-surface-dim border border-primary relative flex-shrink-0">
                                        {item.product_variant.product.images?.[0] && (
                                            <Image 
                                                src={item.product_variant.product.images[0]} 
                                                alt={item.product_variant.product.name}
                                                fill
                                                className="object-cover grayscale"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 text-sm">
                                        <p className="font-bold uppercase leading-tight">{item.product_variant.product.name}</p>
                                        <p className="text-xs text-on-surface-variant font-bold mb-1">SIZE: {item.product_variant.size} | QTY: {item.quantity}</p>
                                        <p className="font-bold">Rp {(parseFloat(item.product_variant.product.price) * item.quantity).toLocaleString('id-ID')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2 border-t border-primary pt-4 mb-4 text-sm font-bold uppercase tracking-widest">
                            <div className="flex justify-between">
                                <span className="text-on-surface-variant">Subtotal</span>
                                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-on-surface-variant">Ongkos Kirim</span>
                                <span>{shippingCost > 0 ? `Rp ${shippingCost.toLocaleString('id-ID')}` : '-'}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center border-t-4 border-primary pt-4 mb-6">
                            <span className="font-anton text-xl uppercase">Total</span>
                            <span className="font-anton text-2xl uppercase">Rp {total.toLocaleString('id-ID')}</span>
                        </div>

                        <Button 
                            variant="primary" 
                            className="w-full py-6 text-lg"
                            onClick={handlePlaceOrder}
                            disabled={!selectedAddressId || isPlacingOrder}
                        >
                            {isPlacingOrder ? <Loader2 className="w-6 h-6 animate-spin" /> : "BUAT PESANAN"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
