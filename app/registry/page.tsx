import fs from 'node:fs';
import path from 'node:path';
import { RegistryGrid } from '../../components';
import type { Metadata } from 'next';

type RegistryData = {
  note?: string;
  links?: { name?: string; url?: string; description?: string }[];
  title?: string;
  intro?: string;
};

function loadRegistryData(): RegistryData {
  const filePath = path.join(process.cwd(), 'lib', 'data', 'registry.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as RegistryData;
}

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Registry',
  description: 'Registry links and honeymoon fund information.',
  openGraph: {
    title: 'Registry | Wedding Site',
    description: 'Registry links and honeymoon fund information.',
    url: '/registry',
    type: 'website',
  },
};

export default function RegistryPage() {
  const data = loadRegistryData();
  return (
    <main className="container py-10">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight font-display text-ink">
          {data.title ?? 'Registry'}
        </h1>
        {data.intro ? <p className="mt-3 text-ink/80">{data.intro}</p> : null}
      </header>
      <RegistryGrid links={data.links ?? []} note={data.note} />
    </main>
  );
}