'use client';

import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { RsvpPayload } from '../../lib/supabase';
import { submitRsvp } from '../server-actions/rsvp';
import { PageHeading, Section, Button } from '../../components';

export default function RsvpPage() {
  const hasEnv = useMemo(() => {
    // These envs are only available on the server; for client awareness we rely on a server flag.
    // Since this is a purely static/export setup, we can infer capability from a server-injected flag later.
    // For now, we conservatively allow submit; the server action will no-op if env is missing and return a message.
    return true;
  }, []);

  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload: RsvpPayload = {
      full_name: String(formData.get('full_name') || '').trim(),
      email: String(formData.get('email') || '').trim() || undefined,
      attending: String(formData.get('attending') || 'yes') === 'yes',
      guests: Number(formData.get('guests') || 0),
      notes: String(formData.get('notes') || '').trim() || undefined,
    };

    if (!payload.full_name) {
      setStatus({ ok: false, msg: 'Full name is required.' });
      return;
    }

    setSubmitting(true);
    setStatus(null);
    try {
      const res = await submitRsvp(payload);
      if (res.ok) {
        setStatus({ ok: true, msg: 'RSVP submitted. Thank you!' });
        form.reset();
      } else {
        setStatus({ ok: false, msg: res.error || 'Submission failed' });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setStatus({ ok: false, msg });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Section>
      <PageHeading title="RSVP" subtitle="Please RSVP by March 31, 2027." />

      <form onSubmit={onSubmit} className="max-w-xl space-y-5 rounded-lg border border-warmSand bg-cream p-6 shadow-sm">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-ink">
            Full name *
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            className="mt-1 w-full rounded-md border border-warmSand px-3 py-2 shadow-sm focus:border-autumnGreen focus:outline-none"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink">
            Email (optional)
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="mt-1 w-full rounded-md border border-warmSand px-3 py-2 shadow-sm focus:border-autumnGreen focus:outline-none"
            placeholder="[email protected]"
          />
        </div>

        <div>
          <span className="block text-sm font-medium text-ink">Attending</span>
          <div className="mt-2 flex gap-6">
            <label className="inline-flex items-center gap-2 text-sm text-ink">
              <input className="h-4 w-4 accent-autumnGreen" type="radio" name="attending" value="yes" defaultChecked /> Yes
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-ink">
              <input className="h-4 w-4 accent-autumnGreen" type="radio" name="attending" value="no" /> No
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-ink">
            Number of guests (including you)
          </label>
          <input
            id="guests"
            name="guests"
            type="number"
            min={0}
            defaultValue={1}
            className="mt-1 w-40 rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-slate-400 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-ink">
            Notes (dietary needs, song requests, etc.)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            className="mt-1 w-full rounded-md border border-warmSand px-3 py-2 shadow-sm focus:border-autumnGreen focus:outline-none"
          /></div>

        <div className="flex items-center gap-3">
          <Button as="button" type="submit" disabled={submitting || !hasEnv}>
            {submitting ? 'Submitting…' : 'Submit RSVP'}
          </Button>
          {!hasEnv && (
            <span className="text-sm text-slate">
              Backend not configured; submission is disabled.
            </span>
          )}
        </div>

        {status && (
          <div className={`text-sm ${status.ok ? 'text-green-700' : 'text-red-700'}`}>
            {status.msg}
          </div>
        )}
      </form>
    </Section>
  );
}