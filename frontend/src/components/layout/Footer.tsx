import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-primary bg-surface py-12 px-4 md:px-16 mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4">
          <Link href="/" className="font-anton text-3xl tracking-widest uppercase">
            MANNABW
          </Link>
          <p className="text-sm font-medium max-w-xs text-on-surface-variant">
            Bold Minimalism. Brutalist Essentials. High-contrast streetwear for the modern era.
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          <h4 className="font-inter text-xs font-bold tracking-[0.2em] uppercase">Shop</h4>
          <Link href="/products" className="text-sm hover:underline underline-offset-4">All Products</Link>
          <Link href="/products?filter=ready" className="text-sm hover:underline underline-offset-4">Ready Stock</Link>
          <Link href="/products?filter=po" className="text-sm hover:underline underline-offset-4">Pre-Order</Link>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-inter text-xs font-bold tracking-[0.2em] uppercase">Support</h4>
          <Link href="/faq" className="text-sm hover:underline underline-offset-4">FAQ</Link>
          <Link href="/shipping" className="text-sm hover:underline underline-offset-4">Shipping & Returns</Link>
          <Link href="/contact" className="text-sm hover:underline underline-offset-4">Contact Us</Link>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-inter text-xs font-bold tracking-[0.2em] uppercase">Social</h4>
          <a href="#" className="text-sm hover:underline underline-offset-4">Instagram</a>
          <a href="#" className="text-sm hover:underline underline-offset-4">Twitter</a>
        </div>
      </div>
      <div className="mt-16 pt-8 border-t border-primary flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-on-surface-variant uppercase tracking-wider">
        <p>© {new Date().getFullYear()} MANNA BLESSINGWEAR.</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-primary">Privacy</Link>
          <Link href="/terms" className="hover:text-primary">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
