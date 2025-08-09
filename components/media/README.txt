This file exists to help TypeScript/IDE pick up directory structure while components are being added incrementally.
Directories present:
- layout (Header, Footer)
- ui (Button, Card, PageHeading, Section)
- data (FAQAccordion, Timeline, ScheduleList, VenueCard, HotelCard, RegistryGrid)
- media (ImageWithCaption, GalleryGrid, Lightbox)
- map (MapEmbed)

If TypeScript still reports "Cannot find module" for files you can open them to force the TS server to refresh, or run `npm run dev` which triggers a full rebuild.