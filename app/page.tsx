import { Button } from '../components';
import Image from 'next/image';
import type { Metadata } from 'next';
import { loadSiteData } from '../lib/site';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to our wedding website with details, RSVP, schedule, travel, and more.',
  openGraph: {
    title: 'Home | Wedding Site',
    description: 'Welcome to our wedding website with details, RSVP, schedule, travel, and more.',
    url: '/',
    type: 'website',
  },
};

export default function Home() {
  const site = loadSiteData();

  return (
    <main className="container py-6">
      <section className="grid place-items-center py-4">
        <div className="text-center max-w-2xl">
          <h1 className="font-display text-6xl md:text-7xl font-bold tracking-tight text-ink">
            {site.names ?? 'Our Wedding'}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-ink/80">
            {site.date_display ?? 'Date TBA'} • {site.city ?? 'Location TBA'}
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button as="link" href="/rsvp">RSVP</Button>
            <Button as="link" href="/schedule" variant="secondary">View Schedule</Button>
          </div>
        </div>
        <div className="mt-6 overflow-hidden rounded-lg border border-warmSand/60 shadow-soft bg-white max-w-3xl w-full">
          <Image
            src="/images/story/story-3.jpg"
            alt="Couple photo"
            width={1600}
            height={900}
            className="h-auto w-full object-cover"
            priority
          />
        </div>
      </section>
    </main>
  );
}