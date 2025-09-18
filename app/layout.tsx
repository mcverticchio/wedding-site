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
  metadataBase: new URL('https://cz26.site'),
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
  const pw = process.env.NEXT_PUBLIC_WEDDING_PASSWORD || '';

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen antialiased bg-cream text-ink">
        <PasswordProtection correctPassword={pw}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-autumnGreen text-white px-4 py-2 rounded-md font-medium z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-autumnGreen"
          >
            Skip to main content
          </a>
          <Header
            brand={site.title ?? 'Caroline & Zach'}
            subtitle={site.subtitle}
            nav={site.nav ?? []}
          />
          <div className="flex-1">{children}</div>
          <Footer text={site.footer} email={undefined} />
        </PasswordProtection>
      </body>
    </html>
  );
}
