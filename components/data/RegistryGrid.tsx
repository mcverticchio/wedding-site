import { Card, CardBody, CardFooter, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';

export type RegistryLink = {
  name?: string;
  url?: string;
  description?: string;
};

export function RegistryGrid({ links, note }: { links: RegistryLink[]; note?: string }) {
  return (
    <div className="space-y-6">
      {note ? <p className="text-ink/80">{note}</p> : null}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l, idx) => (
          <Card key={idx}>
            <CardHeader>
              <h3 className="text-lg font-semibold text-ink">{l.name}</h3>
            </CardHeader>
            <CardBody>
              {l.description ? <p className="text-ink/80">{l.description}</p> : null}
            </CardBody>
            <CardFooter>
              {l.url ? (
                <Button as="a" href={l.url as string} target="_blank" rel="noreferrer">
                  Open Registry
                </Button>
              ) : null}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}