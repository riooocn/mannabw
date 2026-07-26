import { AnimatedText } from "@/components/ui/animated-text";
import { LookbookGrid, LookbookImage } from "@/components/lookbook/lookbook-grid";
import { fetchApi } from "@/lib/api";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface LookbookCampaign {
  id: number;
  title: string;
  description: string | null;
  background_image: string | null;
  images: LookbookImage[];
}

export default async function LookbookPage() {
  const campaigns: LookbookCampaign[] = await fetchApi('/api/lookbook').catch(() => []) || [];

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-surface">
      {campaigns.length === 0 && (
        <div className="py-32 text-center text-on-surface">No campaigns active.</div>
      )}

      {campaigns.map((campaign, index) => (
        <div key={campaign.id} className="flex flex-col w-full">
          {/* Video Background / Hero Section */}
          <div className="relative px-4 md:px-16 py-32 flex flex-col items-center justify-center text-center border-b-4 border-primary min-h-[50vh] overflow-hidden bg-black text-white">
            {campaign.background_image && (
              <div 
                className="absolute inset-0 opacity-30 pointer-events-none" 
                style={{ 
                  backgroundImage: `url("${campaign.background_image}")`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center', 
                  filter: 'grayscale(100%) contrast(150%)' 
                }}
              />
            )}
            
            <div className="relative z-10 flex flex-col items-center">
              <p className="font-inter font-bold tracking-[0.3em] uppercase text-sm mb-4 text-white/70">
                Volume {campaigns.length - index}
              </p>
              <AnimatedText text={campaign.title} el="h1" className="text-6xl md:text-9xl tracking-tight leading-none mb-6 text-white uppercase" />
              {campaign.description && (
                <p className="font-inter font-medium text-lg text-white/80 max-w-lg mt-4">
                  {campaign.description}
                </p>
              )}
            </div>
          </div>

          <LookbookGrid images={campaign.images} />
        </div>
      ))}
    </main>
  );
}
