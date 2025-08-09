'use client';

import { useState } from 'react';

export type FAQ = { question: string; answer: string };

export function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-warmSand/60 rounded-lg border border-warmSand/60 bg-white">
      {faqs.map((f, idx) => {
        const isOpen = open === idx;
        return (
          <div key={idx}>
            <button
              className="flex w-full items-center justify-between px-4 py-3 text-left font-medium text-ink hover:bg-warmSand/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-autumnGreen"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : idx)}
            >
              <span>{f.question}</span>
              <span className="ml-4 text-sm text-ink/70">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div className="px-4 pb-4 text-slate">
                <div className="prose prose-slate max-w-none">{f.answer}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}