'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { HomeIcon } from '@heroicons/react/24/outline';

export type NavItem = { label: string; href: string };

export function Header({
  subtitle,
  nav,
}: {
  subtitle?: string;
  nav: NavItem[];
}) {
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
        <div className="relative flex h-14 items-center gap-4 overflow-visible rounded-2xl bg-watercolorBlue px-5 text-[#f6f6ee] shadow-watercolor">
          <div className="flex items-center gap-3 whitespace-nowrap">
            <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-lg bg-cream/10 hover:bg-cream/20 transition-colors">
              <HomeIcon className="w-6 h-6 text-[#f6f6ee]" />
            </Link>
            {subtitle ? (
              <div className="hidden sm:block text-sm leading-none text-[#f6f6ee]/80">{subtitle}</div>
            ) : null}
          </div>

          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
            className="ml-auto md:hidden inline-flex items-center justify-center gap-2 rounded-lg p-3 min-h-[44px] min-w-[44px] text-[#f6f6ee]/80 hover:bg-cream/10 active:scale-[.95] transition-all duration-200 touch-manipulation focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-autumnGreen"
            ref={firstFocusRef}
          >
            {open ? (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>

          <nav className="hidden md:flex items-center gap-x-8 ml-auto text-[#f6f6ee]/90 leading-none">
            <div className="flex items-center gap-x-6">
              {nav
                ?.filter((i) => i.href !== '/rsvp')
                .map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href as Route}
                      className={[
                        'inline-flex items-center whitespace-nowrap text-sm transition-all duration-200 py-2 px-3 rounded-md min-h-[44px] touch-manipulation hover:bg-cream/10 focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-autumnGreen',
                        active
                          ? 'text-[#f6f6ee] font-medium bg-cream/10'
                          : 'text-[#f6f6ee]/80 hover:text-[#f6f6ee]',
                      ].join(' ')}
                    >
                      {item.label}
                    </Link>
                  );
                })}
            </div>
            <Link
              href={'/rsvp' as Route}
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold rounded-md px-4 py-2 min-h-[44px] border border-cream bg-cream text-autumnGreen hover:bg-cream/90 hover:shadow-md shadow-sm transition-all duration-200 touch-manipulation active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-autumnGreen"
            >
              RSVP
            </Link>
          </nav>
        </div>
      </div>

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
              <nav className="grid max-h-[70vh] gap-2 overflow-y-auto px-6 py-4">
                {nav?.map((item) => {
                  const active = pathname === item.href;
                  const isRsvp = item.href === '/rsvp';
                  return (
                    <Link
                      key={item.href}
                      href={item.href as Route}
                      className={[
                        'rounded-lg px-6 py-4 text-lg min-h-[56px] flex items-center transition-all duration-200 touch-manipulation active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-autumnGreen',
                        isRsvp
                          ? 'bg-cream text-autumnGreen font-semibold shadow-md hover:bg-cream/90'
                          : active
                            ? 'bg-cream/10 text-cream font-medium'
                            : 'text-cream/90 hover:bg-cream/10 hover:text-cream',
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
