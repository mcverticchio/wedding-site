'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { DraggableCardBody, DraggableCardContainer } from '../index';

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
  if (/^(gallery|engagement)-\d+\.(jpe?g|png|webp|avif)$/i.test(filename)) {
    filename = `gallery/${filename}`;
  }
  return `/images/${filename}`;
}

function generateClassName(index: number, offset: number = 0) {
  const positions = [
    { top: '5', left: '10%', rotate: '-10deg' },
    { top: '50', left: '15%', rotate: '-15deg' },
    { top: '20', left: '30%', rotate: '12deg' },
    { top: '60', left: '40%', rotate: '15deg' },
    { top: '30', right: '30%', rotate: '5deg' },
    { top: '40', left: '50%', rotate: '-12deg' },
    { top: '15', left: '20%', rotate: '8deg' },
    { top: '70', left: '60%', rotate: '-8deg' },
    { top: '25', right: '20%', rotate: '10deg' },
    { top: '55', left: '70%', rotate: '-5deg' },
  ];
  const effectiveIndex = (index + offset) % positions.length;
  const pos = positions[effectiveIndex];
  if (pos.right) {
    return `absolute top-${pos.top} right-[${pos.right}] rotate-[${pos.rotate}]`;
  }
  return `absolute top-${pos.top} left-[${pos.left}] rotate-[${pos.rotate}]`;
};

export function GalleryGrid({ photos, engagementPhotos }: { photos: GalleryPhoto[], engagementPhotos: GalleryPhoto[] }) {
  const [layoutMode, setLayoutMode] = useState('grid');
  const [stackedPhotos, setStackedPhotos] = useState<{ title: string; image: string }[]>([]);
  const [restackOffset, setRestackOffset] = useState(Math.floor(Math.random() * 10));

  useEffect(() => {
    const items = [...engagementPhotos, ...photos].map((p) => ({
      title: p.caption || p.alt || 'Gallery Image',
      image: normalize(p.src),
    }));
    setStackedPhotos(items);
  }, [engagementPhotos, photos]);

  const handleToggleLayout = () => {
    setLayoutMode(prev => {
      const newMode = prev === 'stacked' ? 'grid' : 'stacked';
      return newMode;
    });
  };

  const handleRestack = () => {
    setLayoutMode('stacked');
    setRestackOffset(prev => (prev + 1) % 10);
  };

  if (layoutMode === 'grid') {
    return (
      <div className="relative">
        <Button onClick={handleToggleLayout} variant="primary" className="absolute top-[-4rem] right-0 col-span-full mb-4">
          Switch to Stacked View
        </Button>
        <h2 className="my-8 text-2xl font-bold text-center text-neutral-700 dark:text-neutral-300">Engagement Photos</h2>
        <div className="grid gap-4 w-full sm:grid-cols-2 lg:grid-cols-3">
          {engagementPhotos.map((p, idx) => (
            <DraggableCardBody key={idx} className="overflow-hidden relative p-6 rounded-md shadow-2xl min-h-96 bg-neutral-100 dark:bg-neutral-900">
              <img
                src={normalize(p.src)}
                alt={p.caption || p.alt || 'Gallery Image'}
                className="object-cover relative z-10 w-full h-96 pointer-events-none"
                loading="lazy"
              />
            </DraggableCardBody>
          ))}
        </div>
        <h2 className="my-8 text-2xl font-bold text-center text-neutral-700 dark:text-neutral-300">Gallery</h2>
        <div className="grid gap-4 w-full sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((p, idx) => (
            <DraggableCardBody key={idx} className="overflow-hidden relative p-6 rounded-md shadow-2xl min-h-96 bg-neutral-100 dark:bg-neutral-900">
              <img
                src={normalize(p.src)}
                alt={p.caption || p.alt || 'Gallery Image'}
                className="object-cover relative z-10 w-full h-96 pointer-events-none"
                loading="lazy"
              />
              <h3 className="mt-4 text-2xl font-bold text-center text-neutral-700 dark:text-neutral-300">
                {p.caption || p.alt || 'Gallery Image'}
              </h3>
            </DraggableCardBody>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex absolute justify-center mb-2 space-x-4 top-[-4rem] right-0">
        <Button onClick={handleToggleLayout} variant="primary" className="p-2">
          View Grid
        </Button>
        <Button onClick={handleRestack} variant="secondary" className="p-2">
          Restack
        </Button>
      </div>
      <DraggableCardContainer key={restackOffset} className="flex overflow-visible relative justify-center w-full">
        {stackedPhotos.map((item, idx) => (
          <DraggableCardBody key={idx} className={`${generateClassName(idx, restackOffset)} shadow-sm border-2 border-neutral-200 dark:border-neutral-800`}>
            <img
              src={item.image}
              alt={item.title}
              className="object-cover relative z-10 w-96 h-96 pointer-events-none"
              loading="lazy"
              draggable="false"
            />
            <h3 className="mt-4 text-2xl font-bold text-center pointer-events-none text-neutral-700 dark:text-neutral-300">
              {item.title}
            </h3>
          </DraggableCardBody>
        ))}
      </DraggableCardContainer>
    </div>
  );
}