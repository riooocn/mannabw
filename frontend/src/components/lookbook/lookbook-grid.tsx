'use client';

import { useState } from 'react';
import { ParallaxImage } from '@/components/ui/parallax-image';
import { QuickViewModal } from './quick-view-modal';

export interface LookbookImage {
  image: string;
  size: 'small' | 'medium' | 'large' | 'full';
  is_grayscale: boolean;
  product_slug: string | null;
}

interface LookbookGridProps {
  images: LookbookImage[];
}

const SIZE_MAP = {
  small: { span: 'col-span-12 md:col-span-4', height: 'h-[50vh] md:h-[70vh]' },
  medium: { span: 'col-span-12 md:col-span-6', height: 'h-[60vh] md:h-[80vh]' },
  large: { span: 'col-span-12 md:col-span-8', height: 'h-[70vh] md:h-[90vh]' },
  full: { span: 'col-span-12', height: 'h-[80vh] md:h-[100vh]' },
};

export function LookbookGrid({ images }: LookbookGridProps) {
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-12 w-full gap-0">
        {images.map((img, index) => {
          const layout = SIZE_MAP[img.size] || SIZE_MAP.medium;
          return (
            <div 
              key={index} 
              className={`${layout.span} ${layout.height} border-b md:border-r border-primary relative group overflow-hidden bg-black cursor-crosshair`}
              onClick={() => img.product_slug && setSelectedProductSlug(img.product_slug)}
            >
               <div className={`w-full h-full transition-all duration-700 ease-out group-hover:scale-[1.02] ${img.is_grayscale ? 'grayscale group-hover:grayscale-0' : ''}`}>
                  <ParallaxImage src={img.image} alt={`Lookbook ${index}`} className="w-full h-full border-none opacity-80 group-hover:opacity-100 transition-opacity" />
               </div>
               
               {/* Interactive Tag overlay (Hidden until hover) */}
               {img.product_slug && (
               <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="bg-surface text-on-surface font-anton text-xl uppercase px-6 py-3 border border-primary hover:bg-primary hover:text-on-primary transition-colors">
                    Shop This Look
                  </button>
               </div>
             )}
          </div>
          );
        })}
      </div>

      <QuickViewModal 
        productSlug={selectedProductSlug} 
        onClose={() => setSelectedProductSlug(null)} 
      />
    </>
  );
}
