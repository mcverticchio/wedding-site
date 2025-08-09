import fs from 'node:fs';
import path from 'node:path';

export type NavItem = { label: string; href: string };

export type SiteData = {
  title?: string;
  subtitle?: string;
  nav?: NavItem[];
  footer?: string;
  // Optional fields used by the Home page
  names?: string;
  date_display?: string;
  city?: string;
};

const defaultNav: NavItem[] = [

  { label: 'Schedule', href: '/schedule' },
  { label: 'Travel', href: '/travel' },
  { label: 'Registry', href: '/registry' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'RSVP', href: '/rsvp' },
];

export function loadSiteData(): SiteData {
  try {
    const filePath = path.join(process.cwd(), 'lib', 'data', 'site.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw) as SiteData;
    return {
      nav: parsed.nav?.length ? parsed.nav : defaultNav,
      title: parsed.title ?? 'Caroline & Zach',
      subtitle: parsed.subtitle,
      footer: parsed.footer ?? '© ' + new Date().getFullYear() + ' Caroline & Zach',
      date_display: parsed.date_display ?? 'TBA',
      city: parsed.city ?? 'TBA',
      names: parsed.names
    };
  } catch {
    return { nav: defaultNav, title: 'Wedding Site', footer: '© ' + new Date().getFullYear() };
  }
}