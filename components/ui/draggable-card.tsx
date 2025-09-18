'use client';

import { cn } from '@/lib/utils';
import React from 'react';

export const DraggableCardBody = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'overflow-hidden relative p-6 rounded-md shadow-2xl min-h-96 bg-cream border border-warmSand/30',
        className,
      )}
    >
      {children}
    </div>
  );
};

export const DraggableCardContainer = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return <div className={cn('', className)}>{children}</div>;
};
