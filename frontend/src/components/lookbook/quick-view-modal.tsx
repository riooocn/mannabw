'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

interface QuickViewModalProps {
  productSlug: string | null;
  onClose: () => void;
}

export function QuickViewModal({ productSlug, onClose }: QuickViewModalProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!productSlug) return;

    let isMounted = true;
    setLoading(true);
    setError(false);

    fetchApi(`/api/products/${productSlug}`)
      .then((data) => {
        if (isMounted) {
          setProduct(data);
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
            <Button variant="outline" onClick={onClose}>Close</Button>
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

              <div className="flex flex-col gap-3 mt-auto">
                <Link href={`/products/${product.slug}`} className="w-full">
                  <Button variant="primary" className="w-full py-6 text-lg">
                    View Full Details
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
