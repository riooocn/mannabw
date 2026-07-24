'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';
import { Loader2, Minus, Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface QuickViewModalProps {
  productSlug: string | null;
  onClose: () => void;
}

export function QuickViewModal({ productSlug, onClose }: QuickViewModalProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!productSlug) return;

    let isMounted = true;
    setLoading(true);
    setError(false);

    fetchApi(`/api/products/${productSlug}`)
      .then((data) => {
        if (isMounted) {
          setProduct(data);
          if (data.variants && data.variants.length > 0) {
              setSelectedVariantId(data.variants[0].id);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [productSlug]);

  const defaultImage = product?.images && product.images.length > 0 
    ? product.images[0] 
    : "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80";

  return (
    <Modal isOpen={!!productSlug} onClose={onClose}>
      <div className="w-full h-full min-h-[50vh] bg-surface flex items-center justify-center">
        {loading && (
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="font-anton uppercase tracking-widest text-sm">Loading Product...</p>
          </div>
        )}
        
        {error && !loading && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <p className="font-anton uppercase tracking-widest text-xl mb-2 text-red-600">Error</p>
            <p className="font-inter text-sm mb-6">Failed to load product details.</p>
            <Button variant="secondary" onClick={onClose}>Close</Button>
          </div>
        )}

        {!loading && !error && product && (
          <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
            {/* Left side: Image */}
            <div className="relative w-full h-[40vh] md:h-full min-h-[400px] border-b-4 md:border-b-0 md:border-r-4 border-primary">
              <Image 
                src={defaultImage}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            
            {/* Right side: Details */}
            <div className="p-8 flex flex-col justify-center">
              <h2 className="font-anton text-4xl uppercase leading-none mb-2">{product.name}</h2>
              <p className="font-inter font-medium text-xl mb-6">
                Rp {parseFloat(product.price).toLocaleString('id-ID')}
              </p>

              <div className="mb-8">
                <p className="font-inter text-sm text-on-surface-variant line-clamp-3">
                  {product.description}
                </p>
              </div>

              {/* Status Badge */}
              <div className="mb-6 flex gap-2">
                {product.type === 'pre_order' ? (
                  <span className="bg-primary text-on-primary font-bold uppercase text-xs tracking-widest px-3 py-1">
                    Pre-Order
                  </span>
                ) : (
                  <span className="bg-green-600 text-white font-bold uppercase text-xs tracking-widest px-3 py-1">
                    Ready Stock
                  </span>
                )}
              </div>

              {/* Variants / Sizes */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <p className="font-bold text-xs uppercase tracking-widest mb-2">Pilih Ukuran</p>
                  <div className="flex gap-2">
                    {product.variants.map((v: any) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`w-12 h-12 flex items-center justify-center border font-bold uppercase transition-colors ${
                          selectedVariantId === v.id 
                            ? 'border-primary bg-primary text-on-primary' 
                            : 'border-primary/20 text-primary hover:border-primary'
                        }`}
                      >
                        {v.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <p className="font-bold text-xs uppercase tracking-widest mb-2">Jumlah</p>
                <div className="flex items-center border border-primary w-fit">
                    <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="w-12 h-12 flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-primary"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-on-surface">
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

              <div className="flex flex-col gap-3 mt-auto">
                <Button 
                    variant="primary" 
                    className="w-full py-6 text-lg"
                    onClick={() => {
                        if (selectedVariantId) {
                            addToCart(selectedVariantId, quantity);
                            onClose();
                        } else {
                            alert('Pilih ukuran terlebih dahulu');
                        }
                    }}
                >
                  ADD TO CART
                </Button>
                <Link href={`/products/${product.slug}`} className="w-full">
                  <Button variant="secondary" className="w-full py-6 text-lg border-2">
                    VIEW FULL DETAILS
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
