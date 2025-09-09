# Deployment Guide
This site is a static, multi-page website built Next.JS

It will be deployed on GitHub Pages.
## Project Structure

- public/ — All HTML pages and static SEO files (robots.txt, sitemap.xml, 404.html)
- assets/ — CSS and JS, plus fonts/images if added
- data/ — JSON content the pages load at runtime
- docs/ — Documentation

Ensure the hosting platform serves the repository root (/) as the site root so that:
- /public is the directory containing HTML pages
- /assets and /data must be available at top-level relative paths

If your provider requires a single publish directory, set it to the repository root and keep the structure as-is. The pages reference ../assets/ and ../data/ accordingly from public/.

## Netlify

1) Create a new site from Git.
2) Build command: none
3) Publish directory: . (repository root)
4) Deploy. Netlify will serve files directly.

Add a redirect for 404 if desired:
- Place public/404.html (already included). Netlify will use it automatically for missing routes.

Environment settings (optional):
- Configure a custom domain and enable HTTPS.
- Add a security header in Netlify config if you create a netlify.toml (optional).

## Vercel

1) Import the project.
2) Framework preset: Other.
3) Build command: none
4) Output directory: . (repository root)

Vercel will handle the 404.html as a static fallback for missing files.

## Custom Domain and SSL

- Point your domain DNS (A/AAAA/CNAME) to provider’s records.
- Enable HTTPS/SSL in provider dashboard.

## Updating Content

- Edit JSON files under /data (site.json, schedule.json, etc.)
- Commit and push. Hosting will redeploy automatically.

## Analytics

- If using Plausible:
  - Enable in data/site.json: "analytics.enabled": true
  - Set "provider": "plausible" and "domain": "yourdomain.com"
  - Add the Plausible script tag (see docs/STYLE_GUIDE.md notes or add via your hosting dashboard).

- If using GA4:
  - Replace analytics.js to include GA4 snippet or add via hosting dashboard.

## Supabase for RSVP

- In data/site.json, set:
  - "supabase.url": "https://YOUR-PROJECT.supabase.co"
  - "supabase.anon_key": "YOUR_ANON_PUBLIC_KEY"
  - "supabase.table": "rsvps"

- Create table rsvps with columns (at minimum):
  - first_name text
  - last_name text
  - email text
  - phone text
  - attendance text
  - events jsonb (or text[] if preferred)
  - guests integer
  - meal text
  - dietary text
  - song text
  - notes text
  - submitted_at timestamptz default now()

- Enable Row Level Security and add an INSERT policy for anon:
  Example policy:
  ```
  create policy "Allow anon insert rsvps"
  on public.rsvps for insert
  to anon
  with check (true);
  ```
  Consider adding rate-limiting or captcha; see docs/RSVP_EXPORT.md.

## Performance Tips

- Replace placeholder JPGs with optimized AVIF/WebP files. Keep JPG/PNG fallback as necessary using <picture>.
- Use properly sized images (not larger than needed).
- Ensure caching headers via hosting provider (default static caching is usually good).

## SEO

- Update robots.txt with your domain sitemap link.
- Update public/sitemap.xml URLs with your live domain.
- Each page includes basic Open Graph tags; add a production absolute og:image URL in data/site.json (ogImage).

## Environment Variables

The site uses environment variables for configuration. Create a `.env.local` file in the project root:

```bash
# Copy the example file
cp env.example .env.local
```

Then edit `.env.local` with your values:

```bash
# Password for accessing the wedding site
NEXT_PUBLIC_WEDDING_PASSWORD=your_secure_password_here
```

**Important:** 
- The `.env.local` file is already in `.gitignore` and won't be committed to version control
- Use `NEXT_PUBLIC_` prefix for client-side environment variables in Next.js
- For production deployment, set these environment variables in your hosting platform

## Local Preview

- You can use a simple static server for local dev:
  - Python: `python3 -m http.server`
  - Node: `npx serve .`
  Then open http://localhost:8000 or http://localhost:3000 depending on tool.
