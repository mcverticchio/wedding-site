'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export type NavItem = { label: string; href: string };

export function Header({ brand, subtitle, nav }: { brand: string; subtitle?: string; nav: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      firstFocusRef.current?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      };
      window.addEventListener('keydown', onKey);
      return () => {
        window.removeEventListener('keydown', onKey);
      };
    }
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = () => setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-transparent">
      <div className="container py-3 px-4 overflow-visible">
        <div className="relative flex h-14 items-center gap-4 overflow-visible rounded-2xl bg-autumnGreen px-5 text-cream shadow-[0_2px_30px_-10px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-3 whitespace-nowrap">
          <Link href="/" className="text-xl font-semibold tracking-tight text-cream whitespace-nowrap">
            {brand}
          </Link>
          {subtitle ? <div className="hidden sm:block text-sm leading-none text-cream/80">{subtitle}</div> : null}
        </div>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
          className="ml-auto md:hidden inline-flex items-center gap-2 rounded px-3 py-2 text-cream/80 hover:bg-cream/10 active:scale-[.98]"
          ref={firstFocusRef}
        >
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          )}
        </button>

        <nav className="hidden md:flex items-center gap-x-8 ml-auto text-cream/90 leading-none">
          <div className="flex items-center gap-x-6">
            {nav?.filter(i => i.href !== '/rsvp').map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href as Route}
                  className={[
                    'inline-flex items-center whitespace-nowrap text-sm transition-colors',
                    active ? 'text-cream font-medium' : 'text-cream/80 hover:text-cream',
                  ].join(' ')}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <Link
            href={'/rsvp' as Route}
            className="inline-flex items-center whitespace-nowrap text-sm font-semibold rounded-md px-3 py-1.5 border border-cream bg-cream text-autumnGreen hover:bg-cream/90 shadow-sm"
          >
            RSVP
          </Link>
        </nav>
      </div></div>

      {open ? (
        <div className="absolute left-0 right-0 z-50" aria-hidden={!open}>
          <div className="pointer-events-none">
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              className="pointer-events-auto mx-auto mt-2 w-full max-w-[820px] origin-top rounded-2xl rounded-t-none bg-autumnGreen text-cream shadow-[0_18px_50px_rgba(0,0,0,0.35)] ring-1 ring-black/20 animate-in fade-in-0 slide-in-from-top-2 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="grid max-h-[70vh] gap-1.5 overflow-y-auto px-6 py-4">
                {nav?.map((item) => {
                  const active = pathname === item.href;
                  const isRsvp = item.href === '/rsvp';
                  return (
                    <Link
                      key={item.href}
                      href={item.href as Route}
                      className={[
                        'rounded-md px-4 py-3 text-lg',
                        isRsvp ? 'bg-cream text-autumnGreen font-semibold' : (active ? 'bg-cream/10 text-cream' : 'text-cream/90 hover:bg-cream/10 hover:text-cream'),
                      ].join(' ')}
                    >
                      {isRsvp ? 'RSVP' : item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}