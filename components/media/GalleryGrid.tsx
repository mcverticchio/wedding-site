'use client';

import { useState } from 'react';
import { Lightbox } from './Lightbox';

export type GalleryPhoto = {
  src: string;      // expected relative to /public/images, e.g. 'gallery/gallery-1.jpg'
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
};

function normalize(rel: string) {
  // Handle legacy inputs like '../assets/images/gallery-1.jpg'
  let filename = rel.replace(/^\.{0,2}\/?assets\/images\//, '').trim();
  if (/^gallery-\d+\.(jpe?g|png|webp|avif)$/i.test(filename)) {
    filename = `gallery/${filename}`;
  }
  return `/images/${filename}`;
}

export function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((p, idx) => {
          const src = normalize(p.src);
          return (
            <figure
              key={idx}
              className="group cursor-zoom-in overflow-hidden rounded-lg border border-warmSand/60 bg-white shadow-soft"
              onClick={() => setOpenIdx(idx)}
              role="button"
              aria-label="Open image"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setOpenIdx(idx);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={p.alt ?? p.caption ?? 'Gallery image'}
                className="aspect-[4/3] h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              {p.caption ? (
                <figcaption className="px-3 py-2 text-sm text-ink/80">{p.caption}</figcaption>
              ) : null}
            </figure>
          );
        })}
      </div>

      {openIdx !== null ? (
        <Lightbox
          photos={photos.map((p) => ({
            ...p,
            src: normalize(p.src),
          }))}
          index={openIdx}
          onClose={() => setOpenIdx(null)}
          onPrev={() => setOpenIdx((i) => (i! > 0 ? i! - 1 : photos.length - 1))}
          onNext={() => setOpenIdx((i) => (i! + 1) % photos.length)}
        />
      ) : null}
    </>
  );
}