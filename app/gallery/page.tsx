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

type GalleryData = { title?: string; intro?: string; photos?: Photo[], engagement?: Photo[] };

function loadGalleryData(): GalleryData {
  const filePath = path.join(process.cwd(), 'lib', 'data', 'gallery.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as GalleryData;
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
  const allPhotos = (data.photos ?? []).map((p) => ({
    ...p,
    src: p.src ? p.src.replace(/^\.{0,2}\/?assets\/images\//, '') : '',
  })) ?? [];

  const engagementPhotos = (data.engagement ?? []).map((p) => ({
    ...p,
    src: p.src ? p.src.replace(/^\.{0,2}\/?assets\/images\//, '') : '',
  })) ?? [];

  const selectedPhotos = allPhotos;

  return (
    <main className="container py-10">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight font-display text-ink">{data.title ?? 'Gallery'}</h1>
        {data.intro ? <p className="mt-3 text-ink/80">{data.intro}</p> : null}
      </header>

      <GalleryGrid photos={selectedPhotos} engagementPhotos={engagementPhotos} />
    </main>
  );
}