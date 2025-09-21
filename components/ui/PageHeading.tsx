import type { ReactNode } from 'react';

export function PageHeading({
  title,
  subtitle,
  right,
  className = '',
}: {
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={[
        'mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between',
        className,
      ].join(' ')}
    >
      <div>
        <h1 className="text-4xl font-medium tracking-tight text-watercolorBlueDark">{title}</h1>
        {subtitle ? <p className="mt-2 text-watercolorBlueDark">{subtitle}</p> : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </header>
  );
}
