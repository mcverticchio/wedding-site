import { Card, CardBody, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton';

export type ScheduleEvent = {
  id?: string;
  day?: string;
  title?: string;
  date?: string;
  time?: string;
  dress?: string;
  location?: string;
  address?: string;
  map?: string;
  description?: string;
  note?: string;
  image?: string;
  alt?: string;
};

export function ScheduleList({ events }: { events: ScheduleEvent[] }) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-ink/20 hidden sm:block" />

      <ul className="space-y-8">
        {events.map((e) => {
          const img = e.image
            ? `/images/${e.image.replace(/^\.{0,2}\/?assets\/images\//, '')}`
            : null;

          return (
            <li key={e.id ?? `${e.title}-${e.time}`} className="relative">
              {/* Timeline dot */}
              <div className="hidden absolute left-[25px] z-10 w-4 h-4 rounded-full border-4 border-cream bg-watercolorBlue sm:block" />

              {/* Content */}
              <div className="sm:ml-16">
                <Card>
                  <div className="flex flex-col md:flex-row md:min-h-[300px]">
                    {/* Image Section */}
                    {img ? (
                      <div className="overflow-hidden md:w-56 md:flex-shrink-0">
                        <ImageWithSkeleton
                          src={img}
                          alt={e.alt ?? e.title ?? 'Event image'}
                          width={400}
                          height={400}
                          className="object-cover w-full h-48 rounded-t-lg md:rounded-l-lg md:rounded-tr-none md:h-full md:min-h-[300px]"
                        />
                      </div>
                    ) : null}

                    {/* Text Content Section */}
                    <div className="flex-1">
                      <CardHeader>
                        <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-baseline">
                          <div className="text-2xl font-medium text-ink">{e.title}</div>
                          {e.time || e.day ? (
                            <div className="self-start px-2 py-1 text-sm font-medium rounded-full text-ink/70 bg-ink/5">
                              {[e.day, e.time].filter(Boolean).join(' • ')}
                            </div>
                          ) : null}
                        </div>
                        {e.date || e.dress ? (
                          <div className="mt-2 text-sm text-ink/70">
                            {[e.date, e.dress].filter(Boolean).join(' • ')}
                          </div>
                        ) : null}
                        {e.location ? (
                          <div className="mt-2 text-sm font-medium text-ink/80">
                            📍 {e.location} {e.address ? `• ${e.address}` : ''}
                          </div>
                        ) : null}
                      </CardHeader>
                      <CardBody>
                        {e.description ? (
                          <p className="leading-relaxed text-ink/80">{e.description}</p>
                        ) : null}
                        {e.note ? (
                          <div className="p-3 mt-3 bg-amber-50 rounded-lg border border-amber-200">
                            <p className="text-sm italic text-amber-800">💡 {e.note}</p>
                          </div>
                        ) : null}
                        {e.map ? (
                          <div className="mt-4">
                            <Button
                              as="a"
                              href={e.map as string}
                              target="_blank"
                              rel="noreferrer"
                              variant="secondary"
                            >
                              Open Map
                            </Button>
                          </div>
                        ) : null}
                      </CardBody>
                    </div>
                  </div>
                </Card>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
