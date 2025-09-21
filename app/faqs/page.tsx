import fs from 'node:fs';
import path from 'node:path';
import { FAQAccordion, PageHeading } from '../../components';
import type { Metadata } from 'next';

type FaqItem = { q?: string; a?: string };
type FaqsData = { title?: string; intro?: string; faqs?: FaqItem[] };

function loadFaqsData(): FaqsData {
  const filePath = path.join(process.cwd(), 'lib', 'data', 'faqs.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as FaqsData;
}

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'FAQs',
  description: 'Answers to common questions about our wedding day and weekend.',
  openGraph: {
    title: 'FAQs | Wedding Site',
    description: 'Answers to common questions about our wedding day and weekend.',
    url: '/faqs',
    type: 'website',
  },
};

export default function FaqsPage() {
  const data = loadFaqsData();
  const faqs = (data.faqs ?? []).map((f) => ({ question: f.q ?? '', answer: f.a ?? '' }));

  return (
    <main id="main-content" className="container py-10">
      <PageHeading 
        title={data.title ?? 'FAQs'} 
        subtitle={data.intro} 
      />

      <FAQAccordion faqs={faqs} />
    </main>
  );
}
