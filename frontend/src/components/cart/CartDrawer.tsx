'use client';

import React from 'react';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export function CartDrawer() {
    const { cart, isDrawerOpen, closeDrawer, updateQuantity, removeFromCart, isLoading } = useCart();

    const items = cart?.items || [];
    const total = items.reduce((acc, item) => {
        return acc + (parseFloat(item.product_variant.product.price) * item.quantity);
    }, 0);

    return (
        <AnimatePresence>
            {isDrawerOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeDrawer}
                        className="fixed inset-0 bg-black/50 z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed top-0 right-0 h-full w-3/4 max-w-md bg-surface border-l border-primary z-50 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-primary bg-surface">
                            <h2 className="font-anton text-2xl uppercase tracking-widest">Keranjang</h2>
                            <button onClick={closeDrawer} className="p-2 -mr-2 hover:bg-surface-dim transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface">
                            {isLoading && items.length === 0 ? (
                                <p className="text-center text-sm font-bold uppercase tracking-widest text-on-surface-variant mt-10">Memuat...</p>
                            ) : items.length === 0 ? (
                                <p className="text-center text-sm font-bold uppercase tracking-widest text-on-surface-variant mt-10">Keranjang Anda Kosong</p>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4 border border-primary p-4 bg-surface-container">
                                        {/* Product Image */}
                                        <div className="w-16 h-24 md:w-24 md:h-32 bg-surface-dim border border-primary flex-shrink-0 relative overflow-hidden">
                                            {item.product_variant.product.images?.[0] ? (
                                                <Image 
                                                    src={item.product_variant.product.images[0]} 
                                                    alt={item.product_variant.product.name}
                                                    fill
                                                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] md:text-xs text-on-surface-variant font-bold uppercase">No Img</div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 flex flex-col justify-between min-w-0">
                                            <div>
                                                <h3 className="font-bold text-sm uppercase leading-tight mb-1 truncate">
                                                    {item.product_variant.product.name}
                                                </h3>
                                                <p className="text-[10px] md:text-xs text-on-surface-variant font-bold mb-1 truncate">
                                                    SIZE: {item.product_variant.size}
                                                </p>
                                                <p className="font-bold text-xs md:text-sm text-on-surface">
                                                    Rp {parseFloat(item.product_variant.product.price).toLocaleString('id-ID')}
                                                </p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center border border-primary">
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        disabled={item.quantity <= 1}
                                                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-primary"
                                                    >
                                                        <Minus className="w-3 h-3 md:w-4 md:h-4" />
                                                    </button>
                                                    <span className="w-8 md:w-10 text-center text-xs md:text-sm font-bold text-on-surface">
                                                        {item.quantity}
                                                    </span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3 md:w-4 md:h-4" />
                                                    </button>
                                                </div>
                                                <button 
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-2 md:p-3 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0"
                                                >
                                                    <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="border-t border-primary p-6 bg-surface-container-low">
                                <div className="flex justify-between items-center mb-6 font-bold uppercase tracking-widest text-sm text-on-surface">
                                    <span>Subtotal</span>
                                    <span>Rp {total.toLocaleString('id-ID')}</span>
                                </div>
                                <Link 
                                    href="/checkout"
                                    onClick={closeDrawer}
                                    className="block w-full bg-primary text-on-primary text-center p-4 font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors"
                                >
                                    Checkout
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
