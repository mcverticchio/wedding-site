import type { ComponentProps, ReactNode } from 'react';
import { Spinner } from './Spinner';

type Variants = 'primary' | 'secondary' | 'ghost';

const base =
  'inline-flex items-center justify-center rounded-md px-6 py-3 min-h-[44px] text-sm font-medium transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none touch-manipulation active:scale-[0.98] active:transition-transform active:duration-75';

const styles: Record<Variants, string> = {
  primary:
    'bg-autumnGreen text-cream hover:bg-autumnGreen/90 hover:shadow-lg focus-visible:ring-autumnGreen ring-offset-cream',
  secondary:
    'border border-autumnGreen/30 text-autumnGreen hover:bg-warmSand/40 hover:border-autumnGreen/50 hover:shadow-md focus-visible:ring-autumnGreen ring-offset-cream',
  ghost:
    'text-autumnGreen hover:bg-warmSand/40 hover:shadow-sm focus-visible:ring-autumnGreen ring-offset-cream',
};

export function Button({
  as = 'button',
  variant = 'primary',
  className = '',
  loading = false,
  children,
  ...props
}: {
  as?: 'button' | 'a' | 'link';
  variant?: Variants;
  className?: string;
  loading?: boolean;
  children: ReactNode;
} & ComponentProps<'button'> &
  ComponentProps<'a'> & { href?: string }) {
  const cls = `${base} ${styles[variant]} ${className}`.trim();
  const isDisabled = loading || props.disabled;

  const content = (
    <>
      {loading && <Spinner size="sm" className="mr-2" />}
      {children}
    </>
  );

  if (as === 'link') {
    const { href = '#', ...rest } = props;
    return (
      <a href={href} className={cls} {...rest}>
        {content}
      </a>
    );
  }

  if (as === 'a') {
    const { href = '#', ...rest } = props;
    return (
      <a href={href} className={cls} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button
      className={cls}
      disabled={isDisabled}
      {...(props as ComponentProps<'button'>)}
    >
      {content}
    </button>
  );
}