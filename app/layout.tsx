import type { Metadata } from 'next';
import './globals.css';
import { loadSiteData } from '../lib/site';
import { Header, Footer, PasswordProtection } from '../components';

export const metadata: Metadata = {
  title: {
    default: 'Caroline & Zach',
    template: '%s | Caroline & Zach',
  },
  description: 'Details, schedule, accommodations, and RSVP for our wedding.',
  metadataBase: new URL('https://example.com'),
  openGraph: {
    title: 'Caroline & Zach',
    description: 'Details, schedule, accommodations, and RSVP for our wedding.',
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
  const pw = process.env.NEXT_PUBLIC_WEDDING_PASSWORD || "";

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen antialiased bg-cream text-ink">
        <PasswordProtection correctPassword={pw}>
          <Header brand={site.title ?? 'Caroline & Zach'} subtitle={site.subtitle} nav={site.nav ?? []} />
          <main className="flex-1">{children}</main>
          <Footer text={site.footer} email={undefined} />
        </PasswordProtection>
      </body>
    </html>
  );
}