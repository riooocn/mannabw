import { Card, CardContent } from "@/components/ui/card";
import { AnimatedText } from "@/components/ui/animated-text";
import { ParallaxImage } from "@/components/ui/parallax-image";
import Link from "next/link";
import { API_URL } from "@/lib/api";

async function getProducts() {
  // Using native fetch, cache can be adjusted based on requirements
  const res = await fetch(`${API_URL}/api/products`, { next: { revalidate: 0 } });
  if (!res.ok) {
    return [];
  }
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="flex-1 flex flex-col min-h-screen">
      <div className="px-4 md:px-16 py-12 border-b border-primary">
        <AnimatedText text="ALL PRODUCTS" el="h1" className="text-5xl md:text-7xl mb-4" />
        <div className="flex gap-8 font-inter text-sm font-bold tracking-widest uppercase">
          <Link href="/products" className="text-primary underline underline-offset-8">ALL</Link>
          <Link href="/products?filter=ready" className="text-on-surface-variant hover:text-primary">READY STOCK</Link>
          <Link href="/products?filter=po" className="text-on-surface-variant hover:text-primary">PRE-ORDER</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 w-full border-t border-l border-primary">
        {products.map((product: any) => {
          const isPreOrder = product.type === 'pre_order';
          const defaultImage = product.images && product.images.length > 0 
            ? product.images[0] 
            : "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80"; // fallback

          return (
            <Link href={`/products/${product.slug}`} key={product.id} className="group border-b border-r border-primary relative block">
              <Card className="h-full border-none transition-colors group-hover:bg-primary group-hover:text-on-primary rounded-none">
                <div className="w-full aspect-[3/4] relative overflow-hidden border-b border-primary">
                  {isPreOrder && (
                    <div className="absolute top-4 left-4 z-10 bg-primary text-on-primary font-inter text-xs font-bold px-3 py-1 tracking-widest border border-primary group-hover:bg-on-primary group-hover:text-primary transition-colors">
                      PRE-ORDER
                    </div>
                  )}
                  {/* Scale up on hover, keeping the sharp brutalist feel */}
                  <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
                    <ParallaxImage src={defaultImage} alt={product.name} className="w-full h-full border-none rounded-none" />
                  </div>
                </div>
                <CardContent className="flex flex-col gap-2 p-6 rounded-none">
                  <h3 className="font-anton text-2xl uppercase tracking-wider">{product.name}</h3>
                  <p className="font-inter font-medium">Rp {Number(product.price).toLocaleString('id-ID')}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
        {products.length === 0 && (
          <div className="col-span-full py-32 text-center text-on-surface-variant uppercase tracking-widest font-inter">
            No products available yet.
          </div>
        )}
      </div>
    </main>
  );
}
