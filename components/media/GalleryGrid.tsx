'use client';

import { useState } from 'react';
import { DraggableCardBody } from '../index';
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton';
import { PhotoLightbox } from './PhotoLightbox';

export type GalleryPhoto = {
  src: string; // expected relative to /public/images, e.g. 'gallery/gallery-1.jpg'
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
};

function normalize(rel: string) {
  // Handle legacy inputs like '../assets/images/gallery-1.jpg'
  let filename = rel.replace(/^\.{0,2}\/?assets\/images\//, '').trim();
  if (/^(gallery|engagement)-\d+\.(jpe?g|png|webp|avif)$/i.test(filename)) {
    filename = `gallery/${filename}`;
  }
  return `/images/${filename}`;
}

export function GalleryGrid({
  photos,
  engagementPhotos,
}: {
  photos: GalleryPhoto[];
  engagementPhotos: GalleryPhoto[];
}) {
  // Combine all photos for lightbox navigation (engagement first, then gallery)
  const allPhotos = [...engagementPhotos, ...photos];

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handlePhotoClick = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
  };

  const handleNavigate = (index: number) => {
    setCurrentPhotoIndex(index);
  };

  return (
    <>
      <div className="relative">
        <h2 className="my-8 text-2xl font-medium text-center text-watercolorBlueDark">
          Engagement Photos
        </h2>
        <div className="grid gap-4 w-full sm:grid-cols-2 lg:grid-cols-3">
          {engagementPhotos.map((p, idx) => (
            <div
              key={idx}
              onClick={() => handlePhotoClick(idx)}
              className="overflow-hidden w-full transition-shadow duration-200 cursor-pointer hover:shadow-watercolor"
            >
              <DraggableCardBody className="overflow-hidden relative p-6 rounded-md border shadow-2xl min-h-96 bg-cream border-warmSand/30">
                <ImageWithSkeleton
                  src={normalize(p.src)}
                  alt={p.caption || p.alt || `Engagement photo ${idx + 1} of Caroline and Zach`}
                  width={p.width || 1200}
                  height={p.height || 1600}
                  className="object-cover relative z-10 w-full h-96"
                  priority={idx < 3}
                />
              </DraggableCardBody>
            </div>
          ))}
        </div>
        <h2 className="my-8 text-2xl font-medium text-center text-watercolorBlueDark">Gallery</h2>
        <div className="grid gap-4 w-full sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((p, idx) => {
            // Calculate the actual index in the combined array
            const actualIndex = engagementPhotos.length + idx;
            return (
              <div
                key={idx}
                onClick={() => handlePhotoClick(actualIndex)}
                className="overflow-hidden w-full transition-shadow duration-200 cursor-pointer hover:shadow-watercolor"
              >
                <DraggableCardBody className="overflow-hidden relative p-6 rounded-md border shadow-2xl min-h-96 bg-cream border-warmSand/30">
                  <ImageWithSkeleton
                    src={normalize(p.src)}
                    alt={p.caption || p.alt || `Wedding photo ${idx + 1} of Caroline and Zach`}
                    width={p.width || 1200}
                    height={p.height || 1600}
                    className="object-cover relative z-10 w-full h-96"
                    priority={idx < 6}
                  />
                  <h3 className="mt-4 text-2xl font-medium text-center text-watercolorBlueDark">
                    {p.caption || p.alt || `Photo ${idx + 1}`}
                  </h3>
                </DraggableCardBody>
              </div>
            );
          })}
        </div>
      </div>

      <PhotoLightbox
        photos={allPhotos}
        currentIndex={currentPhotoIndex}
        isOpen={lightboxOpen}
        onClose={handleCloseLightbox}
        onNavigate={handleNavigate}
      />
    </>
  );
}
