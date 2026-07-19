import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedText } from "@/components/ui/animated-text";
import { ParallaxImage } from "@/components/ui/parallax-image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      {/* Background massive 'M' watermark */}
      <div className="absolute top-0 left-0 w-full h-[90vh] flex items-center justify-center pointer-events-none opacity-[0.03] dark:opacity-[0.05] overflow-hidden z-0">
        <span className="font-anton text-[60rem] leading-none select-none">M</span>
      </div>

      {/* Hero Section */}
      <section className="px-4 md:px-16 py-16 md:py-32 flex flex-col md:flex-row items-center border-b-4 border-foreground min-h-[90vh] relative z-10">
        <div className="w-full md:w-1/2 flex flex-col items-start gap-8 z-10">
          <div className="relative">
            {/* Red accent badge */}
            <div className="absolute -top-6 -left-4 bg-red-600 text-white font-anton text-xl px-4 py-1 border-2 border-foreground uppercase transform -rotate-3 z-20">
              DROP #1
            </div>
            <AnimatedText 
              text={"BACK TO\nSERVE"} 
              el="h1" 
              className="text-7xl md:text-9xl leading-[0.85] tracking-tighter uppercase" 
            />
          </div>
          <AnimatedText 
            text="Share The Joy, Share The Truth ~" 
            el="p" 
            className="text-2xl font-anton uppercase text-on-surface-variant max-w-md" 
          />
          <p className="font-inter font-medium text-sm uppercase tracking-widest max-w-sm border-l-4 border-foreground pl-4 py-2">
            Dan Engkau memberikan kepada mereka Rohmu yang baik untuk mengajar mereka. Juga manna-Mu tidak Kau tahan dari mulut mereka dan Engkau memberikan air kepada mereka untuk melepaskan dahaga. (Nehemia 9:20)
          </p>
          <div className="flex gap-4 pt-4">
            <Link href="/products">
              <Button variant="primary">Shop Collection</Button>
            </Link>
            <Link href="/lookbook">
              <Button variant="secondary">View Lookbook</Button>
            </Link>
          </div>
        </div>
        <div className="w-full md:w-1/2 mt-16 md:mt-0 relative h-[60vh] md:h-[80vh] w-full">
          <ParallaxImage 
            src="logo.jpg" 
            alt="Hero Image" 
            className="w-full h-full"
            priority 
          />
        </div>
      </section>

      {/* Featured Products Marquee / Banner */}
      <div className="w-full border-b-4 border-foreground overflow-hidden bg-foreground text-background py-6 whitespace-nowrap flex items-center">
        <div className="animate-[marquee_20s_linear_infinite] flex gap-12 font-anton text-2xl uppercase tracking-widest">
          <span>DROP #1 LIVE NOW</span>
          <span>•</span>
          <span>LIMITED QUANTITIES</span>
          <span>•</span>
          <span>PRE-ORDER AVAILABLE</span>
          <span>•</span>
          <span>DROP #1 LIVE NOW</span>
          <span>•</span>
          <span>LIMITED QUANTITIES</span>
          <span>•</span>
          <span>PRE-ORDER AVAILABLE</span>
          <span>•</span>
        </div>
      </div>

      {/* Newsletter Section */}
      <section className="px-4 md:px-16 py-32 flex flex-col items-center text-center relative overflow-hidden">
        <AnimatedText text="JOIN THE WAITLIST" el="h2" className="text-5xl md:text-7xl mb-6 uppercase" />
        <p className="mb-12 font-medium max-w-md text-on-surface-variant uppercase tracking-widest text-sm font-inter">Sign up to get notified when the next drop goes live. No spam, just truth.</p>
        <form className="w-full max-w-md flex flex-col gap-6">
          <Input type="email" placeholder="ENTER YOUR EMAIL" variant="bottom-border" required />
          <Button type="button" className="w-full mt-4">Subscribe</Button>
        </form>
      </section>

    </main>
  );
}
