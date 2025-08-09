import type { ReactNode } from 'react';

export function ImageWithCaption({
  src,
  alt,
  caption,
  className = '',
  ratio = 'aspect-[4/3]',
}: {
  src: string;
  alt: string;
  caption?: ReactNode;
  className?: string;
  ratio?: string; // e.g., 'aspect-[4/3]' or 'aspect-video'
}) {
  return (
    <figure className={['overflow-hidden rounded-lg border border-warmSand/60 bg-white shadow-soft', className].join(' ')}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={['w-full object-cover', ratio].join(' ')} loading="lazy" />
      {caption ? <figcaption className="px-4 py-2 text-sm text-ink/80">{caption}</figcaption> : null}
    </figure>
  );
}