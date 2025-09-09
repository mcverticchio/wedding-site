'use client';

import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { RsvpPayload } from '../../lib/supabase';
import { getSupabaseClient } from '../../lib/supabase';
import { PageHeading, Section, Button } from '../../components';

export default function RsvpPage() {
  const hasEnv = useMemo(() => {
    // Check if client-side Supabase environment variables are available
    return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }, []);

  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(null);
  const [submitting, setSubmitting] = useState(false);
  const [guestNames, setGuestNames] = useState<string[]>([]);

  const addGuest = () => {
    if (guestNames.length < 3) {
      setGuestNames([...guestNames, '']);
    }
  };

  const removeGuest = (index: number) => {
    setGuestNames(guestNames.filter((_, i) => i !== index));
  };

  const updateGuestName = (index: number, name: string) => {
    const updated = [...guestNames];
    updated[index] = name;
    setGuestNames(updated);
  };

  const getGuestCount = () => {
    return guestNames.length;
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload: RsvpPayload = {
      full_name: String(formData.get('full_name') || '').trim(),
      email: String(formData.get('email') || '').trim() || undefined,
      attending: String(formData.get('attending') || 'yes') === 'yes',
      guests: 1 + getGuestCount(), // 1 for the main person + guest count
      notes: String(formData.get('notes') || '').trim() || undefined,
    };

    if (!payload.full_name) {
      setStatus({ ok: false, msg: 'Full name is required.' });
      return;
    }

    setSubmitting(true);
    setStatus(null);
    
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setStatus({ ok: false, msg: 'Supabase not configured. Please contact the site administrator.' });
        return;
      }

      const { error } = await supabase.from('rsvps').insert({
        full_name: payload.full_name,
        email: payload.email ?? null,
        attending: payload.attending,
        guests: payload.guests ?? 0,
        notes: payload.notes ?? null,
        submitted_at: new Date().toISOString(),
      });

      if (error) {
        setStatus({ ok: false, msg: error.message });
      } else {
        setStatus({ ok: true, msg: 'RSVP submitted. Thank you!' });
        form.reset();
        setGuestNames([]);
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

      <form onSubmit={onSubmit} className="p-6 space-y-5 max-w-xl rounded-lg border shadow-sm border-warmSand bg-cream">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-ink">
            Full name *
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            className="px-3 py-2 mt-1 w-full rounded-md border shadow-sm border-warmSand focus:border-autumnGreen focus:outline-none"
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
            className="px-3 py-2 mt-1 w-full rounded-md border shadow-sm border-warmSand focus:border-autumnGreen focus:outline-none"
            placeholder="[email protected]"
          />
        </div>

        <div>
          <span className="block text-sm font-medium text-ink">Attending</span>
          <div className="flex gap-6 mt-2">
            <label className="inline-flex gap-2 items-center text-sm text-ink">
              <input className="w-4 h-4 accent-autumnGreen" type="radio" name="attending" value="yes" defaultChecked /> Yes
            </label>
            <label className="inline-flex gap-2 items-center text-sm text-ink">
              <input className="w-4 h-4 accent-autumnGreen" type="radio" name="attending" value="no" /> No
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink">
            Additional guests
          </label>
          
          <div className="mt-3 space-y-3">
            {guestNames.map((guestName, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => updateGuestName(index, e.target.value)}
                  placeholder={`Guest ${index + 1} name`}
                  className="flex-1 px-3 py-2 rounded-md border shadow-sm border-warmSand focus:border-autumnGreen focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeGuest(index)}
                  className="flex justify-center items-center w-8 h-8 text-red-600 rounded-full transition-colors hover:text-red-800 hover:bg-red-50"
                  aria-label={`Remove guest ${index + 1}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            
            {guestNames.length < 3 && (
              <button
                type="button"
                onClick={addGuest}
                className="flex gap-2 items-center px-4 py-2 text-sm font-medium rounded-md border transition-colors text-autumnGreen hover:text-autumnGreen/80 hover:bg-autumnGreen/5 border-autumnGreen/30 hover:border-autumnGreen/50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add guest
              </button>
            )}
          </div>
          
          {/* {guestNames.length > 0 && ( */}
            <p className="mt-2 text-sm text-ink/70">
              Total attending: {1 + getGuestCount()} {1 + getGuestCount() === 1 ? 'person' : 'people'}
            </p>
          {/* )} */}
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-ink">
            Notes (dietary needs, song requests, etc.)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            className="px-3 py-2 mt-1 w-full rounded-md border shadow-sm border-warmSand focus:border-autumnGreen focus:outline-none"
          /></div>

        <div className="flex gap-3 items-center">
          <Button as="button" type="submit" disabled={submitting || !hasEnv}>
            {submitting ? 'Submitting…' : 'Submit RSVP'}
          </Button>
          {!hasEnv && (
            <span className="text-sm text-slate">
              Supabase not configured; submission is disabled.
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