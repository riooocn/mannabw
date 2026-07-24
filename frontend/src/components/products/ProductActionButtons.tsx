'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus } from 'lucide-react';

interface ProductActionButtonsProps {
  product: any;
  isPreOrder: boolean;
}

export function ProductActionButtons({ product, isPreOrder }: ProductActionButtonsProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h3 className="font-inter text-sm font-bold tracking-widest uppercase">Size</h3>
        <div className="grid grid-cols-4 gap-4">
          {product.variants && product.variants.length > 0 ? (
            product.variants.map((variant: any) => (
              <button 
                key={variant.id} 
                onClick={() => setSelectedVariantId(variant.id)}
                disabled={variant.stock <= 0 && !isPreOrder}
                className={`h-12 border font-anton text-xl uppercase transition-colors rounded-none ${
                    selectedVariantId === variant.id 
                    ? 'border-primary bg-primary text-on-primary' 
                    : 'border-primary/20 text-on-surface hover:border-primary'
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-on-surface`}
              >
                {variant.size}
              </button>
            ))
          ) : (
            <div className="col-span-4 text-sm text-on-surface-variant">No sizes available</div>
          )}
        </div>
        <button className="text-sm text-on-surface-variant underline underline-offset-4 text-left hover:text-on-surface mt-2 w-fit">View Size Chart</button>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="font-inter text-sm font-bold tracking-widest uppercase">Quantity</h3>
        <div className="flex items-center border border-primary w-fit">
            <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-12 h-12 flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-on-surface"
            >
                <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center text-xl font-anton uppercase pt-1">
                {quantity}
            </span>
            <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors"
            >
                <Plus className="w-4 h-4" />
            </button>
        </div>
      </div>

      <Button 
        variant="primary" 
        size="lg" 
        className="w-full mt-4 text-xl rounded-none py-6"
        onClick={() => {
            if (selectedVariantId) {
                addToCart(selectedVariantId, quantity);
            } else {
                alert('Pilih ukuran terlebih dahulu');
            }
        }}
      >
        {isPreOrder ? "PRE-ORDER NOW" : "ADD TO CART"}
      </Button>
    </div>
  );
}
