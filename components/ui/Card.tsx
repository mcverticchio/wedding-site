import type { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={[
        'rounded-lg border border-warmSand/60 bg-white shadow-soft h-full flex flex-col',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={['px-4 py-3 border-b border-warmSand/60', className].join(' ')}>{children}</div>
  );
}

export function CardBody({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={['px-4 py-4 flex-1 flex flex-col', className].join(' ')}>{children}</div>;
}

export function CardFooter({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={['px-4 py-3 border-t border-warmSand/60', className].join(' ')}>{children}</div>
  );
}
