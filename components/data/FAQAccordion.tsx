'use client';

import { useState } from 'react';

export type FAQ = { question: string; answer: string };

export function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set([0]));

  const toggleAccordion = (index: number) => {
    const newOpen = new Set(open);
    if (newOpen.has(index)) {
      newOpen.delete(index);
    } else {
      newOpen.add(index);
    }
    setOpen(newOpen);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  return (
    <div className="space-y-2">
      {faqs.map((f, idx) => {
        const isOpen = open.has(idx);
        return (
          <div key={idx} className="overflow-hidden bg-white rounded-lg border shadow-sm border-warmSand/60">
            <button
              className="flex justify-between items-center px-6 py-5 w-full min-h-[64px] font-medium text-left transition-all duration-200 text-ink hover:bg-warmSand/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-autumnGreen focus-visible:ring-offset-2 touch-manipulation active:scale-[0.99]"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${idx}`}
              id={`faq-question-${idx}`}
              onClick={() => toggleAccordion(idx)}
            >
              <span className="text-lg">{f.question}</span>
              <span
                className="ml-4 flex items-center justify-center w-8 h-8 text-2xl font-light transition-transform duration-200 text-ink/60 hover:text-ink"
                style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            {isOpen && (
              <div
                id={`faq-answer-${idx}`}
                className="px-6 pb-6 border-t text-slate border-warmSand/30 bg-warmSand/5 custom-scrollbar"
                role="region"
                aria-labelledby={`faq-question-${idx}`}
              >
                <div className="pt-4 max-w-none prose prose-slate prose-p:leading-relaxed touch-manipulation">{f.answer}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}