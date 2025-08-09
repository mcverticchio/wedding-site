import type { Metadata } from 'next';
import './globals.css';
import { loadSiteData } from '../lib/site';
import { Header, Footer } from '../components';

export const metadata: Metadata = {
  title: {
    default: 'Caroline & Zach',
    template: '%s | Caroline & Zach',
  },
  description: 'Details, schedule, travel, and RSVP for our wedding.',
  metadataBase: new URL('https://example.com'),
  openGraph: {
    title: 'Caroline & Zach',
    description: 'Details, schedule, travel, and RSVP for our wedding.',
    type: 'website',
    url: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = loadSiteData();

  return (
    <html lang="en">
      <body className="min-h-screen bg-cream text-ink antialiased flex flex-col">
        <Header brand={site.title ?? 'Caroline & Zach'} subtitle={site.subtitle} nav={site.nav ?? []} />
        <main className="flex-1">{children}</main>
        <Footer text={site.footer} email={undefined} />
      </body>
    </html>
  );
}