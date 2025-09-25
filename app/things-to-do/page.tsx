import fs from 'node:fs';
import path from 'node:path';
import { PageHeading } from '../../components';
import type { Metadata } from 'next';

type ThingToDo = {
  id?: string;
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  distance?: string;
  link?: string;
  image?: string;
  alt?: string;
};

type ThingsToDoData = { 
  title?: string; 
  intro?: string; 
  things?: ThingToDo[] 
};

function loadThingsToDoData(): ThingsToDoData {
  const filePath = path.join(process.cwd(), 'lib', 'data', 'things-to-do.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as ThingsToDoData;
}

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Things to Do',
  description: 'Fun activities and attractions near the wedding venue.',
  openGraph: {
    title: 'Things to Do | Wedding Site',
    description: 'Fun activities and attractions near the wedding venue.',
    url: '/things-to-do',
    type: 'article',
  },
};

export default function ThingsToDoPage() {
  const data = loadThingsToDoData();
  const things = data.things ?? [];

  return (
    <main id="main-content" className="container py-10">
      <PageHeading 
        title={data.title ?? 'Things to Do'} 
        subtitle={data.intro} 
      />

      {things.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {things.map((thing) => (
            <div
              key={thing.id ?? thing.title}
              className="p-6 bg-white rounded-lg border border-warmSand/60 shadow-soft"
            >
              {thing.image ? (
                <div className="mb-4 overflow-hidden rounded-md">
                  <img
                    src={`/images/${thing.image}`}
                    alt={thing.alt ?? thing.title ?? 'Activity image'}
                    className="w-full h-48 object-cover"
                  />
                </div>
              ) : null}
              
              <div className="space-y-3">
                <div>
                  <h3 className="text-2xl font-medium text-ink">{thing.title}</h3>
                  {thing.category ? (
                    <div className="text-sm text-ink/70 mt-1">{thing.category}</div>
                  ) : null}
                </div>
                
                {thing.description ? (
                  <p className="text-ink/80">{thing.description}</p>
                ) : null}
                
                <div className="flex flex-wrap gap-2 text-sm text-ink/70">
                  {thing.location ? (
                    <span>📍 {thing.location}</span>
                  ) : null}
                  {thing.distance ? (
                    <span>• {thing.distance} away</span>
                  ) : null}
                </div>
                
                {thing.link ? (
                  <div className="pt-2">
                    <a
                      href={thing.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-watercolorBlue hover:text-watercolorBlueDark transition-colors"
                    >
                      Learn More →
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-ink/70">No activities listed yet. Check back soon!</p>
        </div>
      )}
    </main>
  );
}