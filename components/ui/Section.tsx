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
  const content = (
    <>
      {title ? (
        <div className="mb-6">
          <h2 className="text-2xl font-medium tracking-tight text-watercolorBlueDark">{title}</h2>
          {subtitle ? <p className="mt-2 text-slate">{subtitle}</p> : null}
        </div>
      ) : null}
      {children}
    </>
  );

  return (
    <section id={id} className={['py-10', className].join(' ')}>
      {container ? <div className="container">{content}</div> : content}
    </section>
  );
}
