import fs from 'node:fs';
import path from 'node:path';
import { HotelCard, PageHeading } from '../../components';
import { ImageWithSkeleton } from '../../components/ui/ImageWithSkeleton';
import type { Metadata } from 'next';

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

function loadAccommodationsData() {
  const dataDir = path.join(process.cwd(), 'lib', 'data');
  const hotels = safeRead<{ hotels?: Hotel[] }>(path.join(dataDir, 'hotels.json'));
  const venues = safeRead<{ travel?: TravelData['travel'] }>(path.join(dataDir, 'venues.json'));
  return {
    intro: venues?.travel?.intro,
    hotels: (hotels?.hotels ?? []).map((h) => ({
      ...h,
      image: h.image ? h.image.replace(/^\.?\.?\/assets\/images\//, '') : h.image,
    })),
    travel: {
      airports: (venues?.travel?.airports ?? []).map((a) => ({
        ...a,
        image: a?.image ? a.image.replace(/^\.?\.?\/assets\/images\//, '') : a?.image,
      })),
      rideshare: venues?.travel?.rideshare,
      weather: venues?.travel?.weather,
    },
  };
}

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Accommodations',
  description:
    'Hotel details, airports, rideshare info, weather, and embedded maps for the wedding.',
  openGraph: {
    title: 'Accommodations | Wedding Site',
    description:
      'Hotel details, airports, rideshare info, weather, and embedded maps for the wedding.',
    url: '/accommodations',
    type: 'article',
  },
};

export default function AccommodationsPage() {
  const data = loadAccommodationsData() as ReturnType<typeof loadAccommodationsData> & {
    hotels: Hotel[];
  };

  return (
    <main id="main-content" className="container py-10">
      <PageHeading 
        title="Accommodations" 
        subtitle={data.intro} 
      />

      {data.travel.airports.length > 0 ? (
        <section className="mb-12">
          <h2 className="text-2xl font-medium text-watercolorBlueDark">Airports</h2>
          <ul className="grid gap-4 mt-4 sm:grid-cols-2">
            {data.travel.airports.map((a, idx) => (
              <li
                key={idx}
                className="p-4 bg-white rounded-lg border border-warmSand/60 shadow-soft"
              >
                {a.image ? (
                  <ImageWithSkeleton
                    src={`/images/${a.image}`}
                    alt={a.alt ?? a.name ?? 'Airport'}
                    width={400}
                    height={160}
                    className="object-cover mb-3 w-full rounded-md h-[300px]"
                  />
                ) : null}
                <div className="font-medium text-ink">
                  {a.name} {a.code ? `(${a.code})` : ''}
                </div>
                {a.notes ? <p className="mt-1 text-ink/80">{a.notes}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {data.hotels?.length ? (
        <section className="mb-12">
          <h2 className="text-2xl font-medium text-watercolorBlueDark">Hotels</h2>
          <div className="grid gap-6 mt-4 sm:grid-cols-2">
            {data.hotels.map((h, idx) => (
              <HotelCard key={idx} hotel={h} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
