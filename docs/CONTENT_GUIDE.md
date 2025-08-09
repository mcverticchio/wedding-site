# Content Guide

This guide explains how to update all content on the site without touching HTML. Most text, links, and lists live in JSON under /data and are rendered dynamically.

## High-Level

- Global site info: data/site.json
- Story timeline: data/story.json
- Weekend schedule: data/schedule.json
- Venue & travel: data/venues.json
- Hotels: data/hotels.json
- Registry: data/registry.json
- FAQs: data/faqs.json
- Gallery: data/gallery.json

Pages load JSON via assets/js/data-loader.js (and small page scripts). After you edit JSON, redeploy to update live.

Tip: Validate JSON syntax using your editor or an online validator.

## Editing Global Site Info (site.json)

Fields:
- names: "Caroline & Zach"
- date_display: "June 28, 2026"
- event_timezone: "America/Denver"
- city: "Spartanburg, South Caroline"
- contact_email: "hello@example.com" (update this!)
- ogImage: "./assets/images/og-cover.webp" (absolute URL recommended in production)
- themeVars: override CSS variables (optional)
- supabase: RSVP storage settings (url, anon_key, table)
- analytics: { provider: "plausible" | "ga4", domain, enabled }

Example:
```
{
  "names": "Zach & Caroline",
  "date_display": "October 18, 2025",
  "event_timezone": "America/Denver",
  "city": "Denver, Colorado",
  "contact_email": "hello@example.com",
  "ogImage": "https://yourdomain.com/assets/images/og-cover.webp",
  "supabase": { "url": "...", "anon_key": "...", "table": "rsvps" },
  "analytics": { "provider": "plausible", "domain": "yourdomain.com", "enabled": true }
}
```

<!-- Our Story section removed -->

Timeline array of moments. Each item:
- date, title, text, image (relative path), alt

You can add more items or remove as needed. Images should have matching AVIF/WebP versions for performance if possible.

## Schedule (schedule.json)

events: array of schedule cards.
- id, day (Friday/Saturday/Sunday), title
- date (full text), time (text), dress (text)
- location (venue name), map (Google Maps link), parking (text)
- description, note (optional small text)
- image, alt
- calendar: { start, end } ISO strings for ICS download

Keep times in local timezone to make it simple for guests.

## Venue & Travel (venues.json)

- venues: array (first is used as main venue in travel.html)
  - name, address, map_link, embed_src (Google maps embed URL), parking, arrival
- travel: general hints (airports, rideshare, weather). You can expand this and render more cards as needed.

## Hotels (hotels.json)

hotels: array of card items.
- name, address, distance, rating (number), link (booking)
- map (Google Maps)
- image, alt
- block: { name, code?, deadline } (optional)
- notes (optional)

Room blocks are time-limited—update deadlines as they change.

members: array
- role (e.g., Maid of Honor), name, pronouns (optional), bio
- image, alt

You can add as many as needed. Maintain balanced grid by adding in multiples of two or three when possible.

## Registry (registry.json)

- note: short paragraph about preferences
- links: array of { name, url, description }

If you prefer cash fund only, remove others and update note accordingly.

## FAQs (faqs.json)

faqs: array of { q, a }.

Keep answers brief. If an answer grows large, consider linking to a page section or adding a new page.

## Gallery (gallery.json)

photos: array of images.
- src, alt, caption, width, height
Provide width/height to reduce CLS (layout shift). Use optimized images.

## Images & Assets

- Place final images under assets/images.
- Provide formats: AVIF (best), WebP (fallback), JPG/PNG (last resort).
- Keep filenames short and descriptive, all lowercase with dashes.

## Accessibility & Tone

- Write alt text that describes the image purposefully (not “image of …”).
- Keep language inclusive, warm, and concise.
- Use consistent style for dates, times, places, and names.

## After Edits

1) Commit your JSON changes.
2) Push to your host-integrated repo.
3) Verify on staging/live: Home hero text, schedule details, hotels, and RSVP submission flow.

If something doesn’t render, check the browser console for JSON parse errors or broken paths.
