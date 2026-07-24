import { AnimatedText } from "@/components/ui/animated-text";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen px-4 py-32 bg-background relative overflow-hidden">
      
      {/* Background massive 'M' watermark like the IG posts */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0">
        <span className="font-anton text-[40rem] leading-none select-none">M</span>
      </div>

      <div className="z-10 w-full max-w-4xl flex flex-col gap-12 text-center items-center">
        
        {/* Graphic Header similar to "BACK TO SERVE" poster */}
        <div className="flex flex-col items-center -space-y-4 md:-space-y-8">
          <AnimatedText 
            text="SHARE" 
            el="h1" 
            className="font-anton text-7xl md:text-[12rem] uppercase leading-none tracking-tighter"
          />
          <AnimatedText 
            text="THE JOY" 
            el="h1" 
            className="font-anton text-7xl md:text-[12rem] uppercase leading-none tracking-tighter text-transparent"
            style={{ WebkitTextStroke: "2px currentColor" }}
          />
        </div>

        <div className="w-full max-w-lg border-t-8 border-primary pt-8 mt-8">
          <p className="font-anton text-2xl md:text-4xl uppercase mb-8">
            Share The Truth ~
          </p>

          <div className="flex flex-col gap-6 text-left border-4 border-primary p-8 bg-surface relative">
            {/* Red accent badge like "JOHN 3:16" */}
            <div className="absolute -top-4 -right-4 bg-red-600 text-white font-anton text-xl px-4 py-1 border-2 border-primary uppercase transform rotate-3">
              CONTACT US
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-inter font-bold text-sm text-on-surface-variant uppercase tracking-widest">Admin / Orders (Misael)</span>
              <a href="https://wa.me/6285800043312" className="font-anton text-3xl hover:text-red-600 transition-colors">
                085-8000-43312
              </a>
            </div>

            <div className="w-full h-[2px] bg-primary/20"></div>

            <div className="flex flex-col gap-2">
              <span className="font-inter font-bold text-sm text-on-surface-variant uppercase tracking-widest">General Inquiries (Yanu)</span>
              <a href="https://wa.me/6281908143308" className="font-anton text-3xl hover:text-red-600 transition-colors">
                0819-0814-3308
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex gap-4">
          <a href="https://instagram.com/mannabw" target="_blank" rel="noopener noreferrer">
            <Button variant="primary" className="text-xl px-8 py-6">
              FOLLOW INSTAGRAM
            </Button>
          </a>
        </div>
      </div>
    </main>
  );
}
