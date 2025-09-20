import { Card, CardBody, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';

export type Venue = {
  name?: string;
  address?: string;
  map_link?: string;
  embed_src?: string;
  parking?: string;
  arrival?: string;
  notes?: string;
};

export function VenueCard({ venue }: { venue: Venue }) {
  const addr = venue.address;
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-watercolorBlueDark">{venue.name}</h3>
        {addr ? <div className="mt-1 text-sm text-ink/80">{addr}</div> : null}
      </CardHeader>
      <CardBody>
        {venue.parking ? <p className="text-ink/80">Parking: {venue.parking}</p> : null}
        {venue.arrival ? <p className="mt-2 text-ink/80">Arrival: {venue.arrival}</p> : null}
        {venue.notes ? <p className="mt-2 text-ink/80">{venue.notes}</p> : null}
        {venue.map_link ? (
          <div className="mt-3">
            <Button
              as="a"
              href={venue.map_link as string}
              target="_blank"
              rel="noreferrer"
              variant="secondary"
            >
              Open in Google Maps
            </Button>
          </div>
        ) : null}
        {venue.embed_src ? (
          <div className="mt-4 overflow-hidden rounded-md border border-warmSand/60">
            <iframe
              src={venue.embed_src}
              className="h-64 w-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              aria-label={`${venue.name ?? 'Venue'} map`}
            />
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}
