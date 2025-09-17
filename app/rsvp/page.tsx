'use client';

import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { RsvpPayload } from '../../lib/supabase';
import { getSupabaseClient } from '../../lib/supabase';
import { PageHeading, Button } from '../../components';

export default function RsvpPage() {
  const hasEnv = useMemo(() => {
    // Check if client-side Supabase environment variables are available
    return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }, []);

  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(null);
  const [submitting, setSubmitting] = useState(false);
  const [guestCount, setGuestCount] = useState(0);

  // Use refs for stable uncontrolled inputs
  const formRef = useRef<HTMLFormElement>(null);
  const preservedValues = useRef<Record<string, string>>({});

  // Save current form values before any state change
  const saveFormValues = () => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const values: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      values[key] = value.toString();
    }
    preservedValues.current = values;
  };

  // Restore form values after re-render
  useEffect(() => {
    if (!formRef.current || Object.keys(preservedValues.current).length === 0) return;

    Object.entries(preservedValues.current).forEach(([name, value]) => {
      if (name === 'attending') {
        // Handle radio buttons specially - need to check all radio buttons with this name
        const radioButtons = formRef.current?.querySelectorAll(`input[name="${name}"]`) as NodeListOf<HTMLInputElement>;
        radioButtons?.forEach(radio => {
          radio.checked = radio.value === value;
        });
      } else {
        // Handle regular inputs
        const element = formRef.current?.querySelector(`[name="${name}"]`) as HTMLInputElement | HTMLTextAreaElement;
        if (element) {
          element.value = value;
        }
      }
    });
  });

  const addGuest = () => {
    if (guestCount < 3) {
      saveFormValues();
      setGuestCount(prev => prev + 1);
    }
  };

  const removeGuest = (index: number) => {
    saveFormValues();
    // Remove the specific guest value from preserved values
    delete preservedValues.current[`guest_${index}`];
    // Shift remaining guest values down
    for (let i = index + 1; i < 3; i++) {
      if (preservedValues.current[`guest_${i}`]) {
        preservedValues.current[`guest_${i - 1}`] = preservedValues.current[`guest_${i}`];
        delete preservedValues.current[`guest_${i}`];
      }
    }
    setGuestCount(prev => prev - 1);
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Collect guest names from form
    const guestNames: string[] = [];
    for (let i = 0; i < guestCount; i++) {
      const guestName = String(formData.get(`guest_${i}`) || '').trim();
      if (guestName) {
        guestNames.push(guestName);
      }
    }

    const payload: RsvpPayload = {
      full_name: String(formData.get('full_name') || '').trim(),
      email: String(formData.get('email') || '').trim() || undefined,
      attending: String(formData.get('attending') || 'yes') === 'yes',
      guests: 1 + guestCount, // 1 for the main person + guest count
      guest_names: guestNames,
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
        preservedValues.current = {};
        setGuestCount(0);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setStatus({ ok: false, msg });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main id="main-content" className="container py-10">
      <PageHeading title="RSVP" subtitle="Please RSVP by March 31, 2027." />

      <form ref={formRef} onSubmit={onSubmit} className="p-6 space-y-5 max-w-xl rounded-lg border shadow-sm border-warmSand bg-cream">
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
            placeholder="email"
          />
        </div>

        <fieldset>
          <legend className="block text-sm font-medium text-ink">Will you be attending the wedding?</legend>
          <div className="flex gap-6 mt-2" role="radiogroup" aria-labelledby="attending-legend">
            <label className="inline-flex gap-2 items-center text-sm text-ink cursor-pointer">
              <input className="w-4 h-4 accent-autumnGreen focus:outline-none focus:ring-2 focus:ring-autumnGreen focus:ring-offset-2" type="radio" name="attending" value="yes" defaultChecked aria-describedby="attending-yes-desc" /> Yes, I will attend
            </label>
            <label className="inline-flex gap-2 items-center text-sm text-ink cursor-pointer">
              <input className="w-4 h-4 accent-autumnGreen focus:outline-none focus:ring-2 focus:ring-autumnGreen focus:ring-offset-2" type="radio" name="attending" value="no" aria-describedby="attending-no-desc" /> No, I cannot attend
            </label>
          </div>
        </fieldset>

        <div>
          <fieldset>
            <legend className="block text-sm font-medium text-ink">
              Additional guests (optional)
            </legend>

            <div className="mt-3 space-y-3" role="group" aria-label="Additional guest information">
              {guestCount >= 1 && (
                <div className="flex gap-2 items-center">
                  <label htmlFor="guest_0" className="sr-only">First additional guest name</label>
                  <input
                    id="guest_0"
                    type="text"
                    name="guest_0"
                    placeholder="Guest 1 name"
                    aria-label="First additional guest full name"
                    className="flex-1 px-3 py-2 rounded-md border shadow-sm border-warmSand focus:border-autumnGreen focus:outline-none"
                  />
                <button
                  type="button"
                  onClick={() => removeGuest(0)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      removeGuest(0);
                    }
                  }}
                  className="flex justify-center items-center w-8 h-8 text-red-600 rounded-full transition-colors hover:text-red-800 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  aria-label="Remove guest 1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {guestCount >= 2 && (
              <div className="flex gap-2 items-center">
                <label htmlFor="guest_1" className="sr-only">Second additional guest name</label>
                <input
                  id="guest_1"
                  type="text"
                  name="guest_1"
                  placeholder="Guest 2 name"
                  aria-label="Second additional guest full name"
                  className="flex-1 px-3 py-2 rounded-md border shadow-sm border-warmSand focus:border-autumnGreen focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeGuest(1)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      removeGuest(1);
                    }
                  }}
                  className="flex justify-center items-center w-8 h-8 text-red-600 rounded-full transition-colors hover:text-red-800 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  aria-label="Remove guest 2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {guestCount >= 3 && (
              <div className="flex gap-2 items-center">
                <label htmlFor="guest_2" className="sr-only">Third additional guest name</label>
                <input
                  id="guest_2"
                  type="text"
                  name="guest_2"
                  placeholder="Guest 3 name"
                  aria-label="Third additional guest full name"
                  className="flex-1 px-3 py-2 rounded-md border shadow-sm border-warmSand focus:border-autumnGreen focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeGuest(2)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      removeGuest(2);
                    }
                  }}
                  className="flex justify-center items-center w-8 h-8 text-red-600 rounded-full transition-colors hover:text-red-800 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  aria-label="Remove guest 3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            {guestCount < 3 && (
              <button
                type="button"
                onClick={addGuest}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    addGuest();
                  }
                }}
                className="flex gap-2 items-center px-4 py-2 text-sm font-medium rounded-md border transition-colors text-autumnGreen hover:text-autumnGreen/80 hover:bg-autumnGreen/5 border-autumnGreen/30 hover:border-autumnGreen/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-autumnGreen focus-visible:ring-offset-2"
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
                Total attending: {1 + guestCount} {1 + guestCount === 1 ? 'person' : 'people'}
              </p>
            {/* )} */}
          </fieldset>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-ink">
            Additional notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Any dietary restrictions, song requests, or special accommodations"
            aria-describedby="notes-description"
            className="px-3 py-2 mt-1 w-full rounded-md border shadow-sm border-warmSand focus:border-autumnGreen focus:outline-none"
          />
          <p id="notes-description" className="mt-1 text-xs text-ink/60">
            Please let us know about any dietary needs, song requests, or special accommodations
          </p></div>

        <div className="flex gap-3 items-center">
          <Button as="button" type="submit" disabled={submitting || !hasEnv}>
            {submitting ? 'Submitting…' : 'Submit RSVP'}
          </Button>
          {!hasEnv && (
            <span className="text-sm text-slate" role="alert">
              Supabase not configured; submission is disabled.
            </span>
          )}
        </div>

        {status && (
          <div
            className={`text-sm ${status.ok ? 'text-green-700' : 'text-red-700'}`}
            role="alert"
            aria-live="polite"
            aria-atomic="true"
          >
            {status.msg}
          </div>
        )}
      </form>
    </main>
  );
}