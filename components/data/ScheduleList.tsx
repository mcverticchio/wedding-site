import { Card, CardBody, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';

export type ScheduleEvent = {
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

export function ScheduleList({ events }: { events: ScheduleEvent[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 items-stretch">
      {events.map((e) => {
        const img = e.image ? `/images/${e.image.replace(/^\.{0,2}\/?assets\/images\//, '')}` : null;

        return (
          <li key={e.id ?? `${e.title}-${e.time}`}>
            <Card>
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img}
                  alt={e.alt ?? e.title ?? 'Event image'}
                  className="h-44 w-full rounded-t-lg object-cover"
                  loading="lazy"
                />
              ) : null}
              <CardHeader>
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-lg font-semibold text-ink">{e.title}</div>
                  {(e.time || e.day) ? (
                    <div className="text-sm text-ink/70">
                      {[e.day, e.time].filter(Boolean).join(' • ')}
                    </div>
                  ) : null}
                </div>
                {(e.date || e.dress) ? (
                  <div className="mt-1 text-sm text-ink/70">
                    {[e.date, e.dress].filter(Boolean).join(' • ')}
                  </div>
                ) : null}
                {e.location ? <div className="mt-1 text-sm text-ink/80">{e.location}</div> : null}
              </CardHeader>
              <CardBody>
                {e.description ? <p className="text-ink/80">{e.description}</p> : null}
                {e.parking ? <p className="mt-2 text-ink/70">Parking: {e.parking}</p> : null}
                {e.note ? <p className="mt-2 text-ink/70 italic">{e.note}</p> : null}
                <div className="mt-3 flex-1" />
                {e.map ? (
                  <div className="pt-3 mt-auto">
                    <Button as="a" href={e.map as string} target="_blank" rel="noreferrer" variant="secondary">
                      Open Map
                    </Button>
                  </div>
                ) : null}
              </CardBody>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}