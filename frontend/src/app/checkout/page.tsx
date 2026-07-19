import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedText } from "@/components/ui/animated-text";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  return (
    <main className="flex-1 flex flex-col lg:flex-row min-h-screen">
      {/* Checkout Form - Left */}
      <div className="w-full lg:w-3/5 p-4 md:p-16 border-r border-primary flex flex-col">
        <AnimatedText text="SECURE CHECKOUT" el="h1" className="text-4xl md:text-5xl mb-12" />
        
        <form className="flex flex-col gap-12 max-w-2xl">
          {/* Contact Info */}
          <section className="flex flex-col gap-6">
            <h2 className="font-inter font-bold tracking-widest uppercase text-sm border-b border-primary pb-2">Contact Information</h2>
            <Input type="email" placeholder="Email Address" required />
            <Input type="tel" placeholder="Phone Number" required />
          </section>

          {/* Shipping Address */}
          <section className="flex flex-col gap-6">
            <h2 className="font-inter font-bold tracking-widest uppercase text-sm border-b border-primary pb-2">Shipping Address</h2>
            <div className="flex gap-4">
              <Input type="text" placeholder="First Name" required className="w-1/2" />
              <Input type="text" placeholder="Last Name" required className="w-1/2" />
            </div>
            <Input type="text" placeholder="Full Address" required />
            <Input type="text" placeholder="Apartment, suite, etc. (optional)" />
            <div className="flex gap-4">
              <Input type="text" placeholder="City" required className="w-1/3" />
              <Input type="text" placeholder="Province" required className="w-1/3" />
              <Input type="text" placeholder="Postal Code" required className="w-1/3" />
            </div>
          </section>

          {/* Shipping Method (Biteship simulation) */}
          <section className="flex flex-col gap-6">
            <h2 className="font-inter font-bold tracking-widest uppercase text-sm border-b border-primary pb-2">Shipping Method</h2>
            <div className="border border-primary p-4 flex justify-between items-center bg-surface-container-low cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full border border-primary bg-primary"></div>
                <div>
                  <p className="font-bold">Standard Delivery (J&T Express)</p>
                  <p className="text-sm text-on-surface-variant">2-3 Working Days</p>
                </div>
              </div>
              <p className="font-bold">IDR 25,000</p>
            </div>
            <div className="border border-primary p-4 flex justify-between items-center cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full border border-primary"></div>
                <div>
                  <p className="font-bold">Next Day Delivery (JNE YES)</p>
                  <p className="text-sm text-on-surface-variant">1 Working Day</p>
                </div>
              </div>
              <p className="font-bold">IDR 45,000</p>
            </div>
          </section>

          {/* Payment (Midtrans simulation) */}
          <section className="flex flex-col gap-6">
            <h2 className="font-inter font-bold tracking-widest uppercase text-sm border-b border-primary pb-2">Payment</h2>
            <p className="text-sm text-on-surface-variant mb-4">All transactions are secure and encrypted. Powered by Midtrans.</p>
            <Button type="button" size="lg" className="w-full text-xl">PROCEED TO PAYMENT</Button>
          </section>
        </form>
      </div>

      {/* Order Summary - Right */}
      <div className="w-full lg:w-2/5 p-4 md:p-16 bg-surface-container-lowest">
        <h2 className="font-inter font-bold tracking-widest uppercase text-sm border-b border-primary pb-2 mb-8">Order Summary</h2>
        
        <div className="flex flex-col gap-6 mb-8 border-b border-primary pb-8">
          <div className="flex gap-4 items-center">
            <div className="w-20 h-24 bg-surface-dim border border-primary relative overflow-hidden">
               <Image src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80" alt="Item" fill className="object-cover" />
               <span className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-on-primary text-xs flex items-center justify-center font-bold">1</span>
            </div>
            <div className="flex-1">
              <h3 className="font-anton text-xl uppercase">OVERSIZED HOODIE</h3>
              <p className="text-sm text-on-surface-variant">Size: L</p>
              <span className="inline-block mt-1 bg-primary text-on-primary text-[10px] px-2 py-0.5 font-bold tracking-widest">PRE-ORDER</span>
            </div>
            <p className="font-bold">IDR 499,000</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 font-inter text-sm mb-8 border-b border-primary pb-8">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Subtotal</span>
            <span className="font-bold">IDR 499,000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Shipping</span>
            <span className="font-bold">Calculated at next step</span>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <span className="font-inter font-bold tracking-widest uppercase text-sm">Total</span>
          <span className="font-anton text-3xl">IDR 499,000</span>
        </div>
      </div>
    </main>
  );
}
