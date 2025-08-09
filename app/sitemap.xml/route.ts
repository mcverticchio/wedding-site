import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

export const dynamic = 'force-static';

function readJson<T>(p: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8')) as T;
  } catch {
    return null;
  }
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Known static routes
  const routes = [
    '/',
    '/schedule',
    '/travel',
    '/accommodations',
    '/registry',
    '/faqs',
    '/gallery',
    '/rsvp',
  ];

  // Optionally include dynamic items from data if needed in the future
  // Example: galleries, hotels, venues, etc.
  const dataDir = path.join(process.cwd(), 'lib', 'data');
  const site = readJson<{ sitemapExtra?: string[] }>(path.join(dataDir, 'site.json'));
  const extra = site?.sitemapExtra ?? [];

  const urls = [...new Set([...routes, ...extra])].map((route) => {
    const loc = new URL(route, baseUrl).toString();
    return `<url><loc>${loc}</loc></url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}