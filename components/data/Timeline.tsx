import type { ReactNode } from 'react';
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton';

export type TimelineItem = {
  date?: string;
  title?: string;
  text?: ReactNode;
  image?: string; // expected relative to /public/images, e.g. 'story/story-1.jpg'
  alt?: string;
};

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative space-y-10">
      {items.map((it, idx) => {
        // Items should already be normalized by the page, but keep a tiny safety for legacy inputs.
        let rel = it.image ?? '';
        if (rel.startsWith('assets/images/')) rel = rel.replace(/^assets\/images\//, '');
        const img = rel ? `/images/${rel}` : null;

        return (
          <li key={idx} className="grid items-start gap-6 md:grid-cols-[200px,1fr]">
            <div className="md:text-right">
              {it.date ? (
                <div className="text-sm font-medium text-autumnGreen">{it.date}</div>
              ) : null}
            </div>
            <div className="overflow-hidden bg-white rounded-lg border border-warmSand/60 shadow-soft">
              {img ? (
                <ImageWithSkeleton
                  src={img}
                  alt={it.alt ?? it.title ?? 'Timeline image'}
                  width={600}
                  height={224}
                  className="object-cover w-full h-56"
                />
              ) : null}
              <div className="p-4">
                {it.title ? (
                  <h3 className="text-lg font-medium text-watercolorBlueDark">{it.title}</h3>
                ) : null}
                {it.text ? <p className="mt-2 text-slate">{it.text}</p> : null}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
