import { Card, CardBody, CardHeader, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton';

export type Hotel = {
  name?: string;
  address?: string;
  distance?: string;
  rating?: number;
  link?: string; // booking or website
  map?: string;
  image?: string;
  alt?: string;
  notes?: string;
  block?: { name?: string; code?: string; deadline?: string };
};

export function HotelCard({ hotel }: { hotel: Hotel }) {
  const addr = hotel.address;
  const img = hotel.image ? `/images/${hotel.image}` : null;

  return (
    <Card>
      {img ? (
        <ImageWithSkeleton
          src={img}
          alt={hotel.alt ?? hotel.name ?? 'Hotel'}
          width={400}
          height={176}
          className="object-cover w-full h-44 rounded-t-lg"
        />
      ) : null}
      <CardHeader>
        <div className="flex flex-wrap gap-2 justify-between items-baseline">
          <h3 className="text-lg font-medium text-watercolorBlueDark">{hotel.name}</h3>
          {hotel.distance ? <div className="text-sm text-ink/70">{hotel.distance} away</div> : null}
        </div>
        {addr ? <div className="mt-1 text-sm text-ink/80">{addr}</div> : null}
        {typeof hotel.rating === 'number' ? (
          <div className="mt-1 text-sm text-ink/80">
            {'⭐'.repeat(Math.max(0, Math.min(5, hotel.rating)))}
          </div>
        ) : null}
      </CardHeader>
      <CardBody>
        {hotel.block?.name ? (
          <p className="text-ink/80">
            Room Block: <span className="font-medium">{hotel.block.name}</span>
            {hotel.block.code ? <span> • Code: {hotel.block.code}</span> : null}
            {hotel.block.deadline ? <span> • Reserve by {hotel.block.deadline}</span> : null}
          </p>
        ) : null}
        {hotel.notes ? <p className="mt-2 text-ink/80">{hotel.notes}</p> : null}
      </CardBody>
      {hotel.link || hotel.map ? (
        <CardFooter>
          <div className="flex flex-wrap gap-3">
            {hotel.link ? (
              <Button as="a" href={hotel.link as string} target="_blank" rel="noreferrer">
                Book / Website
              </Button>
            ) : null}
            {hotel.map ? (
              <Button
                as="a"
                href={hotel.map as string}
                target="_blank"
                rel="noreferrer"
                variant="secondary"
              >
                View Map
              </Button>
            ) : null}
          </div>
        </CardFooter>
      ) : null}
    </Card>
  );
}
