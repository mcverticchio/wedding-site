import { Button } from '../components';
import Image from 'next/image';
import type { Metadata } from 'next';
import { loadSiteData } from '../lib/site';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to our wedding website with details, RSVP, schedule, accommodations, and more.',
  openGraph: {
    title: 'Home | Wedding Site',
    description: 'Welcome to our wedding website with details, RSVP, schedule, accommodations, and more.',
    url: '/',
    type: 'website',
  },
};

export default function Home() {
  const site = loadSiteData();

  return (
    <main id="main-content" className="container py-6">
      <section className="grid place-items-center py-4">
        <div className="max-w-2xl text-center">
          <h1 className="text-6xl font-bold tracking-tight font-display md:text-7xl text-ink">
            {site.names ?? 'Our Wedding'}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-ink/80">
            {site.date_display ?? 'Date TBA'} • {site.city ?? 'Location TBA'}
          </p>
          <div className="flex gap-3 justify-center mt-8">
            <Button as="link" href="/rsvp">RSVP</Button>
            <Button as="link" href="/schedule" variant="secondary">View Schedule</Button>
          </div>
        </div>
        <div className="overflow-hidden mt-6 w-full max-w-3xl bg-white rounded-lg border border-warmSand/60 shadow-soft">
          <Image
            src="/images/gallery/engagement-12.jpeg"
            alt="Caroline and Zach engagement photo - featured wedding website image"
            width={1600}
            height={900}
            className="object-cover w-full h-auto"
            priority
          />
        </div>
      </section>
    </main>
  );
}