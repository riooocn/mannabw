import { Button } from "@/components/ui/button";
import { AnimatedText } from "@/components/ui/animated-text";
import { ParallaxImage } from "@/components/ui/parallax-image";
import { ProductActionButtons } from "@/components/products/ProductActionButtons";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { notFound } from "next/navigation";

async function getProduct(slug: string) {
  const res = await fetch(`${API_URL}/api/products/${slug}`, { next: { revalidate: 0 } });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch product');
  }
  return res.json();
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) {
    notFound();
  }

  const isPreOrder = product.type === "pre_order"; 
  const defaultImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80";
  
  return (
    <main className="flex-1 flex flex-col md:flex-row min-h-screen">
      {/* Product Image Section */}
      <div className="w-full md:w-1/2 border-r border-b md:border-b-0 border-primary relative">
        {isPreOrder && (
          <div className="absolute top-8 left-8 z-10 bg-primary text-on-primary font-inter text-sm font-bold px-4 py-2 tracking-widest border border-primary">
            PRE-ORDER
          </div>
        )}
        <div className="h-[60vh] md:h-screen w-full sticky top-0">
           <ParallaxImage 
              src={defaultImage} 
              alt={product.name} 
              className="w-full h-full border-none rounded-none" 
            />
        </div>
      </div>

      {/* Product Info Section */}
      <div className="w-full md:w-1/2 flex flex-col pt-16 md:pt-32 px-4 md:px-16 pb-32">
        <div className="flex flex-col gap-4 border-b border-primary pb-8 mb-8">
          <AnimatedText text={product.name} el="h1" className="text-5xl md:text-7xl leading-none uppercase" />
          <p className="text-2xl font-medium">Rp {Number(product.price).toLocaleString('id-ID')}</p>
        </div>

        <div className="flex flex-col gap-8">
          <p className="text-on-surface-variant font-medium leading-relaxed whitespace-pre-wrap">
            {product.description || 'No description available.'}
          </p>

          {isPreOrder && (
            <div className="bg-surface-container border border-primary p-4 rounded-none">
              <p className="font-inter text-sm font-bold tracking-widest uppercase mb-1">Pre-Order Information</p>
              <p className="text-sm text-on-surface-variant">Estimated Shipping: {product.po_estimated_shipping || 'TBA'}</p>
              {product.po_close_date && <p className="text-sm text-on-surface-variant">Close Date: {product.po_close_date}</p>}
            </div>
          )}

          <ProductActionButtons product={product} isPreOrder={isPreOrder} />

          {/* Details Accordion placeholder */}
          <div className="mt-16 flex flex-col border-t border-primary">
             <div className="py-6 border-b border-primary flex justify-between font-inter text-sm font-bold tracking-widest uppercase cursor-pointer hover:text-on-surface-variant">
               <span>Details</span>
               <span>+</span>
             </div>
             <div className="py-6 border-b border-primary flex justify-between font-inter text-sm font-bold tracking-widest uppercase cursor-pointer hover:text-on-surface-variant">
               <span>Shipping & Returns</span>
               <span>+</span>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}
