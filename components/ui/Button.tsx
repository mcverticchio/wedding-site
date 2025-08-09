import type { ComponentProps, ReactNode } from 'react';

type Variants = 'primary' | 'secondary' | 'ghost';

const base =
  'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

const styles: Record<Variants, string> = {
  primary:
    'bg-autumnGreen text-cream hover:bg-autumnGreen/90 focus-visible:ring-autumnGreen ring-offset-cream',
  secondary:
    'border border-autumnGreen/30 text-autumnGreen hover:bg-warmSand/40 focus-visible:ring-autumnGreen ring-offset-cream',
  ghost:
    'text-autumnGreen hover:bg-warmSand/40 focus-visible:ring-autumnGreen ring-offset-cream',
};

export function Button({
  as = 'button',
  variant = 'primary',
  className = '',
  children,
  ...props
}: {
  as?: 'button' | 'a' | 'link';
  variant?: Variants;
  className?: string;
  children: ReactNode;
} & ComponentProps<'button'> &
  ComponentProps<'a'> & { href?: string }) {
  const cls = `${base} ${styles[variant]} ${className}`.trim();

  if (as === 'link') {
    const { href = '#', ...rest } = props;
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }

  if (as === 'a') {
    const { href = '#', ...rest } = props;
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button className={cls} {...(props as ComponentProps<'button'>)}>
      {children}
    </button>
  );
}