/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production';
// Use no basePath in dev so http://localhost:3000/ works.
// Use /wedding-site (or env) in production/export for GitHub Pages.
const repoBase = isDev ? '' : (process.env.NEXT_PUBLIC_BASE_PATH || '/wedding-site');

const nextConfig = {
  output: 'export',            // static export for GitHub Pages
  reactStrictMode: true,
  basePath: repoBase || undefined,
  assetPrefix: repoBase ? repoBase + '/' : undefined,
  images: { unoptimized: true },
  trailingSlash: true,
  experimental: { typedRoutes: true },
  // Note: Redirects do not run in static export; they help during dev only.
  async redirects() {
    return isDev
      ? [
          { source: '/index.html', destination: '/', permanent: true },
          { source: '/our-story.html', destination: '/our-story', permanent: true },
          { source: '/schedule.html', destination: '/schedule', permanent: true },
          { source: '/accommodations.html', destination: '/accommodations', permanent: true },
          { source: '/registry.html', destination: '/registry', permanent: true },
          { source: '/faqs.html', destination: '/faqs', permanent: true },
          { source: '/gallery.html', destination: '/gallery', permanent: true },
          { source: '/rsvp.html', destination: '/rsvp', permanent: true },
        ]
      : [];
  },
};
export default nextConfig;
