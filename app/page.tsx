import { Button } from '../components';
import { ImageWithSkeleton } from '../components/ui/ImageWithSkeleton';
import Image from 'next/image';
import type { Metadata } from 'next';
import { loadSiteData } from '../lib/site';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Welcome to our wedding website with details, RSVP, schedule, accommodations, and more.',
  openGraph: {
    title: 'Home | Wedding Site',
    description:
      'Welcome to our wedding website with details, RSVP, schedule, accommodations, and more.',
    url: '/',
    type: 'website',
  },
};

export default function Home() {
  const site = loadSiteData();

  return (
    <main id="main-content" className="container py-6">
      <section className="grid place-items-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-4xl">
          {/* Image first */}
          <div className="overflow-hidden mb-8 w-full bg-white rounded-lg border border-warmSand/60 shadow-soft">
            <ImageWithSkeleton
              src="/images/gallery/engagement-12.jpeg"
              alt="Caroline and Zach engagement photo - featured wedding website image"
              width={1600}
              height={900}
              className="object-cover w-full h-[50vh] sm:h-[60vh]"
              priority
            />
          </div>
          
          {/* Text content below */}
          <div className="mx-auto max-w-2xl text-center">
            {/* Names as image */}
            <div className="mb-6">
              <Image
                src="/images/caroline-and-zach-names.png"
                alt="Caroline and Zach"
                width={600}
                height={120}
                className="mx-auto w-auto h-20 sm:h-24 md:h-28"
                priority
              />
            </div>
            <p className="mt-4 text-lg md:text-xl text-ink/80">
              {site.date_display ?? 'Date TBA'} • {site.city ?? 'Location TBA'}
            </p>
            <div className="flex gap-3 justify-center mt-8">
              <Button as="link" href="/rsvp">
                RSVP
              </Button>
              <Button as="link" href="/schedule" variant="secondary">
                View Schedule
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
