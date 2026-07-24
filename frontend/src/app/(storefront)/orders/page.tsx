'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

declare global {
    interface Window {
        snap: any;
    }
}

export default function OrdersPage() {
    const { user, isLoading: isUserLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isUserLoading) return;
        
        if (!user) {
            router.push('/login');
            return;
        }

        fetchOrders();
    }, [user, router, isUserLoading]);

    const fetchOrders = () => {
        fetchApi('/api/orders')
            .then(data => {
                setOrders(data);
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    };

    const handlePay = (snapToken: string) => {
        if (window.snap && snapToken) {
            window.snap.pay(snapToken, {
                onSuccess: function(result: any){
                    fetchOrders();
                },
                onPending: function(result: any){
                    fetchOrders();
                },
                onError: function(result: any){
                    alert("Pembayaran gagal!");
                },
                onClose: function(){
                    fetchOrders();
                }
            });
        } else {
            alert('Token pembayaran tidak ditemukan.');
        }
    };

    const handleCancel = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) return;
        try {
            await fetchApi(`/api/orders/${id}/cancel`, { method: 'PUT' });
            fetchOrders();
        } catch (error: any) {
            alert(error.data?.message || 'Gagal membatalkan pesanan');
        }
    };

    const handleComplete = async (id: number) => {
        if (!confirm('Apakah Anda yakin sudah menerima pesanan ini dengan baik?')) return;
        try {
            await fetchApi(`/api/orders/${id}/complete`, { method: 'PUT' });
            fetchOrders();
        } catch (error: any) {
            alert(error.data?.message || 'Gagal menyelesaikan pesanan');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'pending_payment':
                return { label: 'Menunggu Pembayaran', icon: <Clock className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-800 border-yellow-800' };
            case 'processing':
                return { label: 'Diproses', icon: <Package className="w-4 h-4" />, color: 'bg-blue-100 text-blue-800 border-blue-800' };
            case 'shipped':
                return { label: 'Dikirim', icon: <Truck className="w-4 h-4" />, color: 'bg-indigo-100 text-indigo-800 border-indigo-800' };
            case 'completed':
                return { label: 'Selesai', icon: <CheckCircle className="w-4 h-4" />, color: 'bg-green-100 text-green-800 border-green-800' };
            case 'cancelled':
                return { label: 'Dibatalkan', icon: <XCircle className="w-4 h-4" />, color: 'bg-red-100 text-red-800 border-red-800' };
            default:
                return { label: status, icon: <Package className="w-4 h-4" />, color: 'bg-gray-100 text-gray-800 border-gray-800' };
        }
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="min-h-screen bg-surface p-4 md:p-12">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8 border-b-4 border-primary pb-4">
                    <Link href="/profile" className="text-sm font-bold uppercase hover:underline">
                        &larr; KEMBALI KE PROFIL
                    </Link>
                    <h1 className="font-anton text-4xl uppercase tracking-widest ml-auto">Riwayat Pesanan</h1>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-12 bg-surface-container border border-primary">
                        <Package className="w-12 h-12 mx-auto mb-4 text-on-surface-variant" />
                        <h2 className="font-anton text-2xl uppercase tracking-widest mb-2">Belum Ada Pesanan</h2>
                        <p className="text-sm text-on-surface-variant font-bold uppercase mb-6">Anda belum pernah melakukan transaksi.</p>
                        <Button variant="primary" onClick={() => router.push('/lookbook')} className="py-4 px-8">
                            MULAI BELANJA
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => {
                            const statusConfig = getStatusConfig(order.status);
                            
                            return (
                                <div key={order.id} className="bg-surface-container border border-primary p-0 overflow-hidden">
                                    {/* Header */}
                                    <div className="bg-surface-container-low border-b border-primary p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <p className="text-xs font-bold uppercase text-on-surface-variant mb-1">Tanggal Pesanan</p>
                                            <p className="font-bold">{formatDate(order.created_at)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase text-on-surface-variant mb-1">Total</p>
                                            <p className="font-bold text-lg">Rp {parseFloat(order.total_amount).toLocaleString('id-ID')}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase text-on-surface-variant mb-1">Status</p>
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 border text-xs font-bold uppercase tracking-widest ${statusConfig.color}`}>
                                                {statusConfig.icon}
                                                {statusConfig.label}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="p-4 md:p-6">
                                        <div className="space-y-4 mb-6">
                                            {order.items.map((item: any) => (
                                                <div key={item.id} className="flex gap-4">
                                                    <div className="w-20 h-24 bg-surface-dim border border-primary relative flex-shrink-0">
                                                        {item.product_variant?.product?.images?.[0] ? (
                                                            <Image 
                                                                src={item.product_variant.product.images[0]} 
                                                                alt={item.product_variant.product.name}
                                                                fill
                                                                className="object-cover grayscale"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold uppercase text-on-surface-variant">NO IMG</div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-center">
                                                        <Link href={`/products/${item.product_variant?.product?.slug || '#'}`} className="font-bold text-lg uppercase leading-tight hover:underline">
                                                            {item.product_variant?.product?.name || 'Produk Tidak Diketahui'}
                                                        </Link>
                                                        <p className="text-xs text-on-surface-variant font-bold mt-1 mb-2">SIZE: {item.product_variant?.size} | QTY: {item.quantity}</p>
                                                        <p className="font-bold">Rp {parseFloat(item.price).toLocaleString('id-ID')}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Footer / Extra Info */}
                                        <div className="border-t border-primary pt-4 flex flex-col md:flex-row justify-between text-sm">
                                            <div>
                                                <p className="font-bold uppercase text-xs text-on-surface-variant mb-1">Kurir Pengiriman</p>
                                                <p className="font-bold uppercase">
                                                    {order.courier === 'manual' ? 'Dikirim Penjual' : `${order.courier} - ${order.courier_service}`}
                                                </p>
                                                {order.tracking_number && (
                                                    <p className="mt-1">Catatan: <span className="font-mono bg-surface-dim px-2 py-0.5 border border-primary">{order.tracking_number}</span></p>
                                                )}
                                            </div>
                                            
                                            {order.status === 'pending_payment' && (
                                                <div className="mt-4 md:mt-0 flex flex-row w-full md:w-auto gap-2">
                                                    <Button 
                                                        variant="secondary" 
                                                        className="flex-1 md:w-auto text-red-600 border-red-600 hover:bg-red-50 text-xs md:text-sm px-2 md:px-6"
                                                        onClick={() => handleCancel(order.id)}
                                                    >
                                                        BATALKAN
                                                    </Button>
                                                    <Button 
                                                        variant="primary" 
                                                        className="flex-1 md:w-auto text-xs md:text-sm px-2 md:px-6"
                                                        onClick={() => handlePay(order.snap_token)}
                                                    >
                                                        BAYAR SEKARANG
                                                    </Button>
                                                </div>
                                            )}

                                            {order.status === 'shipped' && (
                                                <div className="mt-4 md:mt-0 flex items-end">
                                                    <Button 
                                                        variant="primary" 
                                                        className="w-full md:w-auto"
                                                        onClick={() => handleComplete(order.id)}
                                                    >
                                                        PESANAN DITERIMA
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
