import fs from 'node:fs';
import path from 'node:path';
import { ScheduleList } from '../../components';
import type { Metadata } from 'next';

type EventItem = {
  id?: string;
  day?: string;
  title?: string;
  date?: string;
  time?: string;
  dress?: string;
  location?: string;
  map?: string;
  parking?: string;
  description?: string;
  note?: string;
  image?: string;
  alt?: string;
};

type ScheduleData = { events?: EventItem[]; title?: string; intro?: string };

function loadScheduleData(): ScheduleData {
  const filePath = path.join(process.cwd(), 'lib', 'data', 'schedule.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as ScheduleData;
}

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Schedule',
  description: 'Weekend schedule with times, locations, dress code, parking, and map links.',
  openGraph: {
    title: 'Schedule | Wedding Site',
    description: 'Weekend schedule with times, locations, dress code, parking, and map links.',
    url: '/schedule',
    type: 'article',
  },
};

export default function SchedulePage() {
  const data = loadScheduleData();
  const events = (data.events ?? []).map((e) => {
    // Normalize legacy asset paths to organized /public/images subfolders
    // Examples:
    //  "../assets/images/rehearsal.jpg" -> "events/rehearsal.jpg"
    //  "../assets/images/ceremony.jpg"  -> "events/ceremony.jpg"
    //  "../assets/images/reception.jpg" -> "events/reception.jpg"
    //  "../assets/images/brunch.jpg"    -> "events/brunch.jpg"
    let normalized: string | undefined = undefined;
    if (e.image) {
      const filename = e.image.replace(/^\.{0,2}\/?assets\/images\//, '').trim();
      if (filename) {
        if (/^(rehearsal|ceremony|reception|brunch)\.(jpe?g|png|webp|avif)$/i.test(filename)) {
          normalized = `events/${filename}`;
        } else if (/^story-\d+\.(jpe?g|png|webp|avif)$/i.test(filename)) {
          normalized = `story/${filename}`;
        } else if (/^gallery-\d+\.(jpe?g|png|webp|avif)$/i.test(filename)) {
          normalized = `gallery/${filename}`;
        } else {
          normalized = filename; // fallback to images root
        }
      }
    }
    return { ...e, image: normalized };
  });

  return (
    <main className="container py-10">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink">
          {data.title ?? 'Schedule'}
        </h1>
        {data.intro ? <p className="mt-3 text-ink/80">{data.intro}</p> : null}
      </header>

      <ScheduleList events={events} />
    </main>
  );
}