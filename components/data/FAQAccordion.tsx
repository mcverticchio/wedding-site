'use client';

import { useState } from 'react';

export type FAQ = { question: string; answer: string };

export function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set([0]));

  return (
    <div className="space-y-2">
      {faqs.map((f, idx) => {
        const isOpen = open.has(idx);
        return (
          <div key={idx} className="overflow-hidden bg-white rounded-lg border shadow-sm border-warmSand/60">
            <button
              className="flex justify-between items-center px-6 py-4 w-full font-medium text-left transition-colors duration-200 text-ink hover:bg-warmSand/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-autumnGreen"
              aria-expanded={isOpen}
              onClick={() => {
                const newOpen = new Set(open);
                if (isOpen) {
                  newOpen.delete(idx);
                } else {
                  newOpen.add(idx);
                }
                setOpen(newOpen);
              }}
            >
              <span className="text-lg">{f.question}</span>
              <span className="ml-4 text-xl font-light transition-transform duration-200 text-ink/60" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                +
              </span>
            </button>
            {isOpen && (
              <div className="px-6 pb-6 border-t text-slate border-warmSand/30 bg-warmSand/5">
                <div className="pt-4 max-w-none prose prose-slate prose-p:leading-relaxed">{f.answer}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}