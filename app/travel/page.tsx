import fs from 'node:fs';
import path from 'node:path';
import { VenueCard, HotelCard } from '../../components';
import type { Metadata } from 'next';

type Venue = {
  name?: string;
  address?: string;
  map_link?: string;
  embed_src?: string;
  parking?: string;
  arrival?: string;
  notes?: string;
};

type Hotel = {
  name?: string;
  address?: string;
  distance?: string;
  rating?: number;
  link?: string;
  map?: string;
  image?: string;
  alt?: string;
  notes?: string;
  block?: { name?: string; code?: string; deadline?: string };
};

type TravelData = {
  venues?: Venue[];
  travel?: {
    airports?: { code?: string; name?: string; notes?: string; image?: string; alt?: string }[];
    rideshare?: string;
    weather?: string;
    intro?: string;
  };
};

function safeRead<T>(p: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8')) as T;
  } catch {
    return null;
  }
}

function loadTravelData() {
  const dataDir = path.join(process.cwd(), 'lib', 'data');
  const venues = safeRead<TravelData>(path.join(dataDir, 'venues.json'));
  const hotels = safeRead<{ hotels?: Hotel[] }>(path.join(dataDir, 'hotels.json'));
  const site = safeRead<{ travel?: TravelData['travel'] }>(path.join(dataDir, 'site.json'));
  return {
    title: 'Travel',
    intro: site?.travel?.intro,
    venues: venues?.venues ?? [],
    hotels: (hotels?.hotels ?? []).map((h) => ({ ...h, image: h.image ? h.image.replace(/^\.?\.?\/assets\/images\//, '') : h.image })),
    travel: {
      airports: (site?.travel?.airports ?? venues?.travel?.airports ?? []).map((a) => ({
        ...a,
        image: a?.image ? a.image.replace(/^\.?\.?\/assets\/images\//, '') : a?.image,
      })),
      rideshare: site?.travel?.rideshare ?? venues?.travel?.rideshare,
      weather: site?.travel?.weather ?? venues?.travel?.weather,
    },
  };
}

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Travel',
  description: 'Venue details, airports, rideshare info, weather, and embedded maps for the wedding.',
  openGraph: {
    title: 'Travel | Wedding Site',
    description: 'Venue details, airports, rideshare info, weather, and embedded maps for the wedding.',
    url: '/travel',
    type: 'article',
  },
};

export default function TravelPage() {
  const data = loadTravelData() as ReturnType<typeof loadTravelData> & { hotels: Hotel[] };

  return (
    <main className="container py-10">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink">{data.title}</h1>
        {data.intro ? <p className="mt-3 text-ink/80">{data.intro}</p> : null}
      </header>

      {data.travel.airports.length > 0 ? (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-ink">Airports</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {data.travel.airports.map((a, idx) => (
              <li key={idx} className="rounded-lg border border-warmSand/60 bg-white p-4 shadow-soft">
                {a.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/images/${a.image}`} alt={a.alt ?? a.name ?? 'Airport'} className="mb-3 h-40 w-full rounded-md object-cover" loading="lazy" />
                ) : null}
                <div className="font-medium text-ink">{a.name} {a.code ? `(${a.code})` : ''}</div>
                {a.notes ? <p className="mt-1 text-ink/80">{a.notes}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {data.venues.length > 0 ? (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-ink">Venues</h2>
          <ul className="mt-4 grid gap-6 sm:grid-cols-2">
            {[...data.venues].sort((a, b) => {
              const order = ['First Presbyterian Church — The Chapel', 'The Piedmont Club'];
              const ia = order.indexOf(a.name || '');
              const ib = order.indexOf(b.name || '');
              return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
            }).map((v, idx) => (
              <li key={idx}>
                <VenueCard venue={v} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {data.hotels?.length ? (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-ink">Hotels</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {data.hotels.map((h, idx) => (
              <HotelCard key={idx} hotel={h} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
