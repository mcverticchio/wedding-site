import fs from 'node:fs';
import path from 'node:path';
import { GalleryGrid } from '../../components';
import type { Metadata } from 'next';

type Photo = {
  src: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
};

type GalleryData = { title?: string; intro?: string; photos?: Photo[] };

function loadGalleryData(): GalleryData {
  const filePath = path.join(process.cwd(), 'lib', 'data', 'gallery.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as GalleryData;
}

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photos from our adventures and engagement leading up to the big day.',
  openGraph: {
    title: 'Gallery | Wedding Site',
    description: 'Photos from our adventures and engagement leading up to the big day.',
    url: '/gallery',
    type: 'website',
  },
};

export default function GalleryPage() {
  const data = loadGalleryData();
  let allPhotos = (data.photos ?? []).map((p) => ({
    ...p,
    src: p.src ? p.src.replace(/^\.{0,2}\/?assets\/images\//, '') : '',
  })) ?? [];

  const selectedPhotos = allPhotos;

  return (
    <main className="container py-10">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink">{data.title ?? 'Gallery'}</h1>
        {data.intro ? <p className="mt-3 text-ink/80">{data.intro}</p> : null}
      </header>

      <GalleryGrid photos={selectedPhotos} />
    </main>
  );
}