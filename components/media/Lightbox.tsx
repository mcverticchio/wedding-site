'use client';

import { useEffect } from 'react';
import { Button } from '../ui/Button';

export type LightboxPhoto = {
  src: string;
  alt?: string;
  caption?: string;
};

export function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  photos: LightboxPhoto[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const current = photos[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-5xl">
        {/* Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.src}
          alt={current.alt ?? current.caption ?? 'Photo'}
          className="max-h-[80vh] w-full rounded-lg object-contain shadow-soft"
        />

        {/* Caption */}
        {current.caption ? (
          <div className="mt-3 text-center text-sm text-cream/90">{current.caption}</div>
        ) : null}

        {/* Controls */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2">
          <button
            aria-label="Previous image"
            className="pointer-events-auto rounded-md bg-black/40 px-3 py-2 text-cream hover:bg-black/60"
            onClick={onPrev}
          >
            ‹
          </button>
          <button
            aria-label="Next image"
            className="pointer-events-auto rounded-md bg-black/40 px-3 py-2 text-cream hover:bg-black/60"
            onClick={onNext}
          >
            ›
          </button>
        </div>

        <div className="absolute right-2 top-2">
          <Button as="button" variant="secondary" className="bg-black/40 text-cream hover:bg-black/60" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}