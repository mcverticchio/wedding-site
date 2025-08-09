# Style Guide

A concise design system for Caroline & Zach’s wedding website inspired by the Zola “Deep Creek Fall” aesthetic. This guide documents color, typography, layout, components, imagery, accessibility, and authoring patterns to maintain a consistent, elegant experience.

## Colors (WCAG AA)

Tokens are defined in assets/css/base.css under :root. All pairings below meet or exceed AA on body text; large display text has more flexibility.

- Ink (text): #1e1d1a
- Autumn Green (primary): #2e4b3f
- Burnt Orange (accent): #b5562b
- Warm Sand (tint): #e9dfd3
- Cream (page background): #f7f3ee
- Slate (muted text): #5c6a66
- Gold Accent (highlights): #c8a36a
- Status: error #a4302f, success #2e7d32

Usage:
- Buttons: primary background Autumn Green, text white.
- Links: Autumn Green; hover transitions to Burnt Orange.
- Contrasted sections use Warm Sand background with white cards to preserve hierarchy.

## Typography

- Headings: “Cormorant Garamond”, serif (loaded from system or Google Fonts if added)
- Body: “Inter”, system sans fallback

Sizes (mobile-first):
- Display: clamp(40px, 6vw, 72px)
- H2: clamp(28px, 3.2vw, 40px)
- Body: 16px base, 1.6 line-height
- Small/help: 13–14px

Guidelines:
- Headline case for H1/H2, sentence case for longer card titles.
- Avoid all-caps for long strings; acceptable for short badges.
- Keep body copy to max 65ch for readability.

## Layout and Spacing

- Max content width: 1200px with .wrap horizontal padding of 24px.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64 (tokens --space-1 … --space-8)
- Sections use .section with generous top/bottom spacing.
- Use .grid utilities (e.g., .grid--two) for two-column layouts; fallback to single column below 900–1000px.

## Components

Buttons
- .button: primary pill with strong contrast and subtle shadow.
- .button--ghost: transparent with white text when used on hero imagery.
- .button--link: inline text-styled button without box.

Cards
- .card: white background with soft border and shadow.
- .card--media: image on top with fixed height, object-fit: cover.
- .card__title, .card__meta for hierarchy.
- Use .cards grid for responsive collections (hotels, schedule).

Timeline
- .timeline list with vertical line and gold markers.
- .timeline__date, .timeline__content maintain semantic grouping.

Accordion (FAQs)
- .accordion groups questions; .accordion__button toggles .accordion__panel with ARIA attributes.
- Keep answers concise and scannable.

Forms
- .form grid, .form__row for 2-up grouping.
- .label, .input/.select/.textarea with clear focus state.
- .error for validation messaging, .help for hints.

Gallery
- .gallery uses CSS columns for masonry effect; figures avoid column breaks.
- Always include descriptive alt text.

Map Embed
- .map-embed provides an aspect-ratio container and border treatment for iframes.

## Imagery

- Home hero: High-resolution landscape with warm fall tones, subtle overlay.
- Aspect ratios: portrait 4:5 or 3:4 in story; 4:3 or 16:9 for venues and schedule.
- Use picture with AVIF/WebP sources and JPG fallback:
  <picture> <source type="image/avif"> <source type="image/webp"> <img>

Optimization:
- Export responsive dimensions (e.g., 1500px width for hero, 1200px for cards).
- Compress aggressively; preserve natural color warmth.

## Accessibility

- Semantic structure with headings in order (H1 once, then H2 sections).
- Skip link available; sticky header with adequate contrast.
- Focus styles via :focus-visible; do not remove outlines.
- Form labels are explicit; errors use role="alert" and aria-live.
- Images require alt; decorative images should have empty alt="".
- Color contrast: ensure primary buttons and text meet AA.
- Motion: reduce with prefers-reduced-motion where appropriate.

## Content Authoring

- Keep copy friendly, concise, and inclusive.
- Use consistent date and time formats: “October 18, 2025 — 4:00 PM”.
- “Black tie optional”, “Smart casual”, “Casual” phrasing for dress codes.
- For places: Link to Google Maps with target="_blank" and rel="noopener".

## SEO and Social

- Each page sets a specific title and description.
- og:title, og:description, and og:image included on key pages; ensure og:image is an absolute URL in production (configure in data/site.json).
- robots.txt and sitemap.xml present under /public.
- Use concise, human-readable filenames for images.

## Analytics

- Toggle in data/site.json. Prefer Plausible for privacy-friendly analytics.
- If enabled, include provider script once (can be injected from a small analytics.js).

## Supabase RSVP

- Client inserts via PostgREST using anon key and RLS policy allowing insert.
- Consider adding reCAPTCHA or hCaptcha; form has honeypot as baseline.
- Export instructions live in docs/RSVP_EXPORT.md.

## Changelog Practice

- Use small, atomic commits: “content: update hotels”, “style: refine buttons”, “feat: add RSVP email.”
- For asset updates, include optimized sources and keep originals archived outside repo when possible.
