'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from './AuthContext';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: string;
    images: string[];
}

interface ProductVariant {
    id: number;
    product_id: number;
    size: string;
    stock: number;
    product: Product;
}

export interface CartItem {
    id: number;
    cart_id: number;
    product_variant_id: number;
    quantity: number;
    product_variant: ProductVariant;
}

interface Cart {
    id: number;
    user_id: number;
    items: CartItem[];
}

interface CartContextType {
    cart: Cart | null;
    isLoading: boolean;
    isDrawerOpen: boolean;
    openDrawer: () => void;
    closeDrawer: () => void;
    addToCart: (productVariantId: number, quantity: number) => Promise<void>;
    updateQuantity: (itemId: number, quantity: number) => Promise<void>;
    removeFromCart: (itemId: number) => Promise<void>;
    fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Cart | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { user } = useAuth();

    const openDrawer = () => setIsDrawerOpen(true);
    const closeDrawer = () => setIsDrawerOpen(false);

    const fetchCart = async () => {
        if (!user) {
            setCart(null);
            return;
        }
        setIsLoading(true);
        try {
            const data = await fetchApi('/api/cart');
            setCart(data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const addToCart = async (productVariantId: number, quantity: number) => {
        if (!user) {
            alert('Silakan login terlebih dahulu untuk menambahkan ke keranjang.');
            return;
        }
        try {
            const data = await fetchApi('/api/cart/add', {
                method: 'POST',
                body: JSON.stringify({
                    product_variant_id: productVariantId,
                    quantity,
                })
            });
            setCart(data);
            openDrawer();
        } catch (error: any) {
            console.error('Error adding to cart:', error);
            alert(error.data?.message || 'Gagal menambahkan ke keranjang');
        }
    };

    const updateQuantity = async (itemId: number, quantity: number) => {
        try {
            const data = await fetchApi(`/api/cart/update/${itemId}`, { 
                method: 'PUT',
                body: JSON.stringify({ quantity })
            });
            setCart(data);
        } catch (error: any) {
            console.error('Error updating quantity:', error);
            alert(error.data?.message || 'Gagal mengubah jumlah');
        }
    };

    const removeFromCart = async (itemId: number) => {
        try {
            const data = await fetchApi(`/api/cart/remove/${itemId}`, { method: 'DELETE' });
            setCart(data);
        } catch (error) {
            console.error('Error removing from cart:', error);
            alert('Gagal menghapus item dari keranjang');
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            isLoading,
            isDrawerOpen,
            openDrawer,
            closeDrawer,
            addToCart,
            updateQuantity,
            removeFromCart,
            fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
