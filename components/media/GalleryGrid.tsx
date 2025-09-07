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
}

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function GalleryGrid({ photos, engagementPhotos }: { photos: GalleryPhoto[], engagementPhotos: GalleryPhoto[] }) {
  const [layoutMode, setLayoutMode] = useState<'stacked' | 'grid'>('stacked');
  const [shuffledPhotos, setShuffledPhotos] = useState([...engagementPhotos, ...photos]);
  const [restackOffset, setRestackOffset] = useState(Math.floor(Math.random() * 10));

  useEffect(() => {
    setShuffledPhotos(shuffle(photos));
  }, []);

  const selectedPhotos = layoutMode === 'stacked' ? shuffledPhotos : photos;

  const items = [...engagementPhotos, ...selectedPhotos].map((p, idx) => ({
    title: p.caption || p.alt || 'Gallery Image',
    image: normalize(p.src),
    className: layoutMode === 'stacked' ? generateClassName(idx, restackOffset) : `grid-item col-span-1 row-span-1`,
  }));

  const handleToggleLayout = () => {
    console.log('Toggle layout clicked, current mode:', layoutMode);
    setLayoutMode(prev => {
      const newMode = prev === 'stacked' ? 'grid' : 'stacked';
      console.log('New mode:', newMode);
      return newMode;
    });
  };

  const handleRestack = () => {
    console.log('Restack clicked, current mode:', layoutMode);
    setLayoutMode('stacked');
    setRestackOffset(prev => (prev + 1) % 10);
    console.log('Set to stacked');
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
          {selectedPhotos.map((p, idx) => (
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
        {items.map((item, idx) => (
          <DraggableCardBody key={idx} className={`${item.className} shadow-sm border-2 border-neutral-200 dark:border-neutral-800`}>
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