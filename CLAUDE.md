# Wedding Website Project Documentation

## Project Overview

This is a modern, password-protected wedding website for Caroline & Zach's wedding on June 27, 2026, in Spartanburg, South Carolina. Built with Next.js 14 + TypeScript, it features static site generation for GitHub Pages deployment and uses Supabase for RSVP management.

## Technical Stack

- **Framework**: Next.js 14.2.5 with App Router and TypeScript
- **Styling**: Tailwind CSS with custom autumn wedding theme
- **Database**: Supabase for RSVP submissions
- **Animations**: Framer Motion for interactive elements
- **Icons**: Heroicons React
- **Validation**: Zod for data validation
- **Deployment**: Static export optimized for GitHub Pages with custom domain support (cz26.site)

## Project Structure

```
wedding-site-main/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with password protection
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles and theme
│   ├── accommodations/page.tsx  # Hotel and travel information
│   ├── faqs/page.tsx           # FAQ accordion
│   ├── gallery/page.tsx        # Interactive photo gallery
│   ├── registry/page.tsx       # Gift registry links
│   ├── rsvp/page.tsx           # RSVP form with Supabase integration
│   └── schedule/page.tsx       # Wedding timeline
├── components/                  # Reusable components
│   ├── index.ts                # Barrel exports
│   ├── PasswordProtection.tsx  # Site authentication
│   ├── data/                   # Data display components
│   ├── layout/                 # Header and Footer
│   ├── map/                    # Map embedding
│   ├── media/                  # Gallery and image components
│   └── ui/                     # Base UI components
├── lib/                        # Utilities and data
│   ├── site.ts                 # Site configuration loader
│   ├── supabase.ts            # Database client
│   ├── utils.ts               # Utility functions
│   └── data/                  # JSON data files
└── public/images/             # Static assets
```

## Key Features

### Authentication

- Password-protected site using `NEXT_PUBLIC_WEDDING_PASSWORD` environment variable
- Session-based authentication with elegant login form
- Loading states and error handling

### Pages & Functionality

1. **Home Page** (`app/page.tsx`)
   - Hero section with couple names, date, location
   - Primary CTA buttons (RSVP, Schedule)
   - Featured engagement photo

2. **RSVP System** (`app/rsvp/page.tsx`)
   - Dynamic form with guest management (up to 3 additional guests)
   - Attendance confirmation, dietary restrictions, notes
   - Supabase integration for data storage
   - Environment variable detection for graceful degradation

3. **Schedule** (`app/schedule/page.tsx`)
   - Wedding timeline with ceremony and reception details
   - Venue information with map links
   - Event images and calendar integration

4. **Accommodations** (`app/accommodations/page.tsx`)
   - Hotel recommendations with booking codes and ratings
   - Airport information (GSP primary, CLT backup)
   - Travel logistics

5. **Gallery** (`app/gallery/page.tsx`)
   - Interactive photo display with two modes:
     - Grid view: Traditional photo grid
     - Stacked view: Draggable scattered photo layout
   - Separate engagement and relationship photo collections
   - Lazy loading and proper image optimization

6. **Registry** (`app/registry/page.tsx`)
   - Multiple gift options: Amazon, jewelry store, Venmo, Bitcoin
   - Custom descriptions and direct links

7. **FAQs** (`app/faqs/page.tsx`)
   - Expandable accordion with common wedding questions
   - Covers RSVP, dress code, dietary needs, parking, etc.

## Data Management

### Static Data (JSON-driven)

All content is managed through JSON files in `lib/data/`:

- `site.json` - Basic site configuration, couple info, theme colors
- `story.json` - Relationship timeline
- `schedule.json` - Wedding events with calendar integration
- `venues.json` - Venue details and travel information
- `hotels.json` - Accommodation recommendations
- `registry.json` - Gift registry links
- `gallery.json` - Photo collections with captions and dimensions
- `faqs.json` - Frequently asked questions

### Dynamic Data (Supabase)

- RSVP submissions stored in `rsvps` table
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Client-side integration with error handling and loading states

## Design System

### Color Palette

- **Autumn Green** (`#2e4b3f`) - Primary actions, navigation
- **Burnt Orange** (`#b5562b`) - Accent color
- **Warm Sand** (`#e9dfd3`) - Borders and dividers
- **Cream** (`#f7f3ee`) - Background
- **Ink** (`#1e1d1a`) - Text
- **Gold Accent** (`#c8a36a`) - Special highlights

### Components Architecture

**UI Components** (`components/ui/`)

- `Button.tsx` - Three variants (primary, secondary, ghost)
- `Card.tsx` - Modular card system with Header, Body, Footer
- `PageHeading.tsx` - Consistent page titles
- `Section.tsx` - Content sections
- `draggable-card.tsx` - Interactive gallery components

**Layout Components** (`components/layout/`)

- `Header.tsx` - Responsive navigation with mobile hamburger menu
- `Footer.tsx` - Simple footer with copyright and contact

**Data Components** (`components/data/`)

- `FAQAccordion.tsx` - Expandable Q&A sections
- `ScheduleList.tsx` - Event timeline display
- `VenueCard.tsx` - Venue information cards
- `HotelCard.tsx` - Accommodation details
- `RegistryGrid.tsx` - Gift registry display
- `Timeline.tsx` - Relationship story timeline

**Media Components** (`components/media/`)

- `GalleryGrid.tsx` - Interactive photo gallery with dual modes
- `ImageWithCaption.tsx` - Photo display with captions
- `Lightbox.tsx` - Photo viewing modal

## Configuration Files

### Next.js Configuration (`next.config.mjs`)

- Static export for GitHub Pages
- Base path handling for custom domains
- Image optimization disabled for static hosting
- Development redirects for legacy HTML routes

### Tailwind Configuration (`tailwind.config.js`)

- Custom color palette
- Extended border radius values
- Custom shadows and spacing
- Responsive breakpoints

### TypeScript Configuration (`tsconfig.json`)

- Path aliases for clean imports (`@/components/*`, `@/lib/*`)
- Strict type checking
- ES2022 target with modern features

## Environment Variables

### Required

- `NEXT_PUBLIC_WEDDING_PASSWORD` - Site access password
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

### Optional

- `NEXT_PUBLIC_BASE_PATH` - For GitHub Pages project pages

## Development & Deployment

### Scripts

- `npm run dev` - Development server
- `npm run build` - Production build with static export
- `npm run start` - Production server
- `npm run lint` - ESLint checking
- `npm run preview` - Build and start for testing

### Deployment

- Configured for GitHub Pages with custom domain
- Static export generates standalone HTML/CSS/JS
- CNAME file for custom domain (cz26.site)
- Assets optimized for CDN delivery

## Key Implementation Details

### Image Handling

- Organized in `/public/images/` with subfolders (gallery, events, travel, story)
- Path normalization from legacy asset structures
- Proper alt text and captions for accessibility
- Lazy loading for performance

### State Management

- React hooks for component state
- Session storage for authentication persistence
- Form state management with validation
- Interactive gallery mode switching

### Accessibility

- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management for modals and menus
- Screen reader compatible
- Semantic HTML structure

### Performance

- Static site generation for fast loading
- Optimized images with proper dimensions
- Lazy loading for non-critical content
- Minimal JavaScript bundle
- Efficient CSS with Tailwind purging

This documentation provides comprehensive context for understanding and working with the wedding website codebase.
