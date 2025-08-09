import type { ReactNode } from 'react';

export function Section({
  title,
  subtitle,
  children,
  className = '',
  container = true,
  id,
}: {
  title?: string;
  subtitle?: string | ReactNode;
  children: ReactNode;
  className?: string;
  container?: boolean;
  id?: string;
}) {
  const Wrap = ({ children }: { children: ReactNode }) =>
    container ? <div className="container">{children}</div> : <>{children}</>;

  return (
    <section id={id} className={['py-10', className].join(' ')}>
      <Wrap>
        {title ? (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-ink">{title}</h2>
            {subtitle ? <p className="mt-2 text-slate">{subtitle}</p> : null}
          </div>
        ) : null}
        {children}
      </Wrap>
    </section>
  );
}