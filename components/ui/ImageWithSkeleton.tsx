'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Skeleton } from './Skeleton';

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean; // For responsive containers
}

export function ImageWithSkeleton({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
}: ImageWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative">
      {isLoading && (
        <Skeleton
          className={`absolute inset-0 ${className}`}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={`${className} ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } transition-opacity duration-300`}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
      {hasError && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-warmSand/20 ${className}`}
          role="img"
          aria-label="Failed to load image"
        >
          <div className="text-center text-sm text-ink/60">
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p>Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
}
