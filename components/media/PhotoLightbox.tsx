'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { GalleryPhoto } from './GalleryGrid';

interface PhotoLightboxProps {
  photos: GalleryPhoto[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

function normalize(rel: string) {
  let filename = rel.replace(/^\.{0,2}\/?assets\/images\//, '').trim();
  if (/^(gallery|engagement)-\d+\.(jpe?g|png|webp|avif)$/i.test(filename)) {
    filename = `gallery/${filename}`;
  }
  return `/images/${filename}`;
}

export function PhotoLightbox({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: PhotoLightboxProps) {
  const currentPhoto = photos[currentIndex];

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
        onNavigate(prevIndex);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
        onNavigate(nextIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, currentIndex, photos.length, onClose, onNavigate]);

  const handlePrev = useCallback(() => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
    onNavigate(prevIndex);
  }, [currentIndex, photos.length, onNavigate]);

  const handleNext = useCallback(() => {
    const nextIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
    onNavigate(nextIndex);
  }, [currentIndex, photos.length, onNavigate]);

  if (!isOpen || !currentPhoto) return null;

  return (
    <div
      className="flex fixed inset-0 z-50 justify-center items-center backdrop-blur-sm bg-black/90"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo lightbox"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 z-10 min-w-[44px] min-h-[44px] p-2 text-white rounded-md transition-colors duration-200 hover:text-goldAccent focus:outline-none focus:ring-2 focus:ring-goldAccent focus:ring-offset-2 focus:ring-offset-black/90 touch-manipulation sm:top-4 sm:right-4"
        aria-label="Close lightbox"
      >
        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Navigation buttons */}
      {photos.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-2 z-10 min-w-[44px] min-h-[44px] p-3 text-white rounded-md transition-colors duration-200 hover:text-goldAccent focus:outline-none focus:ring-2 focus:ring-goldAccent focus:ring-offset-2 focus:ring-offset-black/90 bg-black/30 hover:bg-black/50 touch-manipulation sm:left-4"
            aria-label="Previous photo"
          >
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-2 z-10 min-w-[44px] min-h-[44px] p-3 text-white rounded-md transition-colors duration-200 hover:text-goldAccent focus:outline-none focus:ring-2 focus:ring-goldAccent focus:ring-offset-2 focus:ring-offset-black/90 bg-black/30 hover:bg-black/50 touch-manipulation sm:right-4"
            aria-label="Next photo"
          >
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Photo container */}
      <div
        className="relative max-w-[95vw] max-h-[95vh] w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 md:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex relative justify-center items-center w-full h-full">
          <Image
            src={normalize(currentPhoto.src)}
            alt={currentPhoto.caption || currentPhoto.alt || `Photo ${currentIndex + 1}`}
            width={currentPhoto.width || 1200}
            height={currentPhoto.height || 1600}
            className="object-contain max-w-full max-h-[75vh] sm:max-h-[85vh] rounded-lg"
            priority
          />
        </div>

        {/* Photo counter and caption */}
        <div className="mt-4 text-center text-white sm:mt-6">
          <div className="mb-2 text-xs text-white/70 sm:text-sm">
            {currentIndex + 1} of {photos.length}
          </div>
          {(currentPhoto.caption || currentPhoto.alt) && (
            <div className="px-4 max-w-2xl text-sm font-medium text-white sm:px-0 sm:text-base md:text-lg">
              {currentPhoto.caption || currentPhoto.alt}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
