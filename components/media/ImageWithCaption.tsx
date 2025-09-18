import type { ReactNode } from 'react';
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton';

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
      <div className={ratio}>
        <ImageWithSkeleton
          src={src}
          alt={alt}
          width={600}
          height={450}
          className="w-full h-full object-cover"
        />
      </div>
      {caption ? <figcaption className="px-4 py-2 text-sm text-ink/80">{caption}</figcaption> : null}
    </figure>
  );
}