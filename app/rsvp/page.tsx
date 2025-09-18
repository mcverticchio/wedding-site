'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { RsvpPayload } from '../../lib/supabase';
import { getSupabaseClient } from '../../lib/supabase';
import { validateRsvpForm, type FieldErrors, rsvpSchema } from '../../lib/validation';
import { z } from 'zod';
import { PageHeading, Button } from '../../components';

export default function RsvpPage() {
  const hasEnv = useMemo(() => {
    // Check if client-side Supabase environment variables are available
    return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }, []);

  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(null);
  const [submitting, setSubmitting] = useState(false);
  const [guestCount, setGuestCount] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

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
        const radioButtons = formRef.current?.querySelectorAll(
          `input[name="${name}"]`,
        ) as NodeListOf<HTMLInputElement>;
        radioButtons?.forEach((radio) => {
          radio.checked = radio.value === value;
        });
      } else {
        // Handle regular inputs
        const element = formRef.current?.querySelector(`[name="${name}"]`) as
          | HTMLInputElement
          | HTMLTextAreaElement;
        if (element) {
          element.value = value;
        }
      }
    });
  });

  const addGuest = () => {
    if (guestCount < 3) {
      saveFormValues();
      setGuestCount((prev) => prev + 1);
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
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
    setGuestCount((prev) => prev - 1);
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
  };

  // Real-time field validation
  const validateField = (fieldName: string, value: string) => {
    // Save form values before validation to prevent value loss
    saveFormValues();

    const currentErrors = { ...fieldErrors };
    const trimmedValue = value.trim();

    try {
      switch (fieldName) {
        case 'full_name':
          if (trimmedValue) {
            // Validate full name using the schema
            rsvpSchema.shape.full_name.parse(trimmedValue);
            delete currentErrors.full_name;
          } else {
            // Required field - show error if empty
            currentErrors.full_name = 'Full name is required';
          }
          break;

        case 'email':
          if (trimmedValue) {
            // Validate email format using the schema
            rsvpSchema.shape.email.parse(trimmedValue);
            delete currentErrors.email;
          } else {
            // Email is optional - clear any errors if empty
            delete currentErrors.email;
          }
          break;

        case 'notes':
          if (trimmedValue) {
            // Validate notes length using the schema
            rsvpSchema.shape.notes.parse(trimmedValue);
            delete currentErrors.notes;
          } else {
            // Notes are optional - clear any errors if empty
            delete currentErrors.notes;
          }
          break;

        default:
          // Handle guest fields
          if (fieldName.startsWith('guest_')) {
            if (trimmedValue) {
              // Validate guest name
              const guestSchema = z
                .string()
                .min(2, 'Guest name must be at least 2 characters')
                .max(100, 'Guest name must be less than 100 characters');
              guestSchema.parse(trimmedValue);
              delete currentErrors[fieldName as keyof FieldErrors];
            } else {
              // Empty guest name is an error if the field exists
              currentErrors[fieldName as keyof FieldErrors] = 'Guest name is required';
            }
          }
          break;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        currentErrors[fieldName as keyof FieldErrors] = error.errors[0]?.message || 'Invalid input';
      }
    }

    setFieldErrors(currentErrors);
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Clear previous errors
    setFieldErrors({});
    setStatus(null);

    // Validate form data with Zod
    const validation = validateRsvpForm(formData, guestCount);

    if (!validation.success) {
      setFieldErrors(validation.errors);
      setStatus({ ok: false, msg: 'Please fix the errors below and try again.' });
      return;
    }

    // Convert validated data to payload format
    const validatedData = validation.data;
    const payload: RsvpPayload = {
      full_name: validatedData.full_name,
      email: validatedData.email,
      attending: validatedData.attending === 'yes',
      guests: 1 + guestCount, // 1 for the main person + guest count
      guest_names: validatedData.guest_names,
      notes: validatedData.notes,
    };

    setSubmitting(true);
    setStatus(null);

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setStatus({
          ok: false,
          msg: 'Supabase not configured. Please contact the site administrator.',
        });
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
        setFieldErrors({});
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setStatus({ ok: false, msg });
    } finally {
      setSubmitting(false);
    }
  }

  // Helper function to render field errors
  const renderFieldError = (fieldName: keyof FieldErrors) => {
    const error = fieldErrors[fieldName];
    if (!error) return null;

    return (
      <p
        id={`${fieldName}-error`}
        className="mt-1 text-sm text-red-600"
        role="alert"
        aria-live="polite"
      >
        {error}
      </p>
    );
  };

  return (
    <main id="main-content" className="container py-10">
      <PageHeading title="RSVP" subtitle="Please RSVP by March 31, 2027." />

      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="p-6 space-y-5 max-w-xl rounded-lg border shadow-sm border-warmSand bg-cream"
      >
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-ink">
            Full name *
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            className={`px-4 py-3 mt-1 w-full rounded-lg border shadow-sm focus:outline-none transition-all duration-200 touch-manipulation min-h-[48px] text-base ${
              fieldErrors.full_name
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-warmSand focus:border-autumnGreen focus:ring-2 focus:ring-autumnGreen/20'
            }`}
            placeholder="Your full name"
            aria-describedby={fieldErrors.full_name ? 'full_name-error' : undefined}
            onBlur={(e) => validateField('full_name', e.target.value)}
          />
          {renderFieldError('full_name')}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink">
            Email (optional)
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`px-4 py-3 mt-1 w-full rounded-lg border shadow-sm focus:outline-none transition-all duration-200 touch-manipulation min-h-[48px] text-base ${
              fieldErrors.email
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-warmSand focus:border-autumnGreen focus:ring-2 focus:ring-autumnGreen/20'
            }`}
            placeholder="email"
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            onBlur={(e) => validateField('email', e.target.value)}
          />
          {renderFieldError('email')}
        </div>

        <fieldset>
          <legend className="block text-sm font-medium text-ink">
            Will you be attending the wedding?
          </legend>
          <div
            className="flex flex-col sm:flex-row gap-3 mt-3"
            role="radiogroup"
            aria-labelledby="attending-legend"
          >
            <label className="inline-flex gap-3 items-center p-4 text-base text-ink cursor-pointer rounded-lg border transition-all duration-200 hover:bg-warmSand/20 has-[:checked]:bg-autumnGreen/10 has-[:checked]:border-autumnGreen touch-manipulation min-h-[56px]">
              <input
                className="w-5 h-5 accent-autumnGreen focus:outline-none focus:ring-2 focus:ring-autumnGreen focus:ring-offset-2"
                type="radio"
                name="attending"
                value="yes"
                defaultChecked
                aria-describedby="attending-yes-desc"
              />
              <span className="font-medium">Yes, I will attend</span>
            </label>
            <label className="inline-flex gap-3 items-center p-4 text-base text-ink cursor-pointer rounded-lg border transition-all duration-200 hover:bg-warmSand/20 has-[:checked]:bg-autumnGreen/10 has-[:checked]:border-autumnGreen touch-manipulation min-h-[56px]">
              <input
                className="w-5 h-5 accent-autumnGreen focus:outline-none focus:ring-2 focus:ring-autumnGreen focus:ring-offset-2"
                type="radio"
                name="attending"
                value="no"
                aria-describedby="attending-no-desc"
              />
              <span className="font-medium">No, I cannot attend</span>
            </label>
          </div>
          {renderFieldError('attending')}
        </fieldset>

        <div>
          <fieldset>
            <legend className="block text-sm font-medium text-ink">
              Additional guests (optional)
            </legend>

            <div className="mt-3 space-y-3" role="group" aria-label="Additional guest information">
              {guestCount >= 1 && (
                <div>
                  <div className="flex gap-2 items-center">
                    <label htmlFor="guest_0" className="sr-only">
                      First additional guest name
                    </label>
                    <input
                      id="guest_0"
                      type="text"
                      name="guest_0"
                      placeholder="Guest 1 name"
                      aria-label="First additional guest full name"
                      className={`flex-1 px-4 py-3 rounded-lg border shadow-sm focus:outline-none transition-all duration-200 touch-manipulation min-h-[48px] text-base ${
                        fieldErrors.guest_0
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-warmSand focus:border-autumnGreen focus:ring-2 focus:ring-autumnGreen/20'
                      }`}
                      aria-describedby={fieldErrors.guest_0 ? 'guest_0-error' : undefined}
                      onBlur={(e) => validateField('guest_0', e.target.value)}
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
                      className="flex justify-center items-center min-w-[44px] min-h-[44px] text-red-600 rounded-lg transition-all duration-200 hover:text-red-800 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 touch-manipulation active:scale-[0.95]"
                      aria-label="Remove guest 1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  {renderFieldError('guest_0')}
                </div>
              )}

              {guestCount >= 2 && (
                <div>
                  <div className="flex gap-2 items-center">
                    <label htmlFor="guest_1" className="sr-only">
                      Second additional guest name
                    </label>
                    <input
                      id="guest_1"
                      type="text"
                      name="guest_1"
                      placeholder="Guest 2 name"
                      aria-label="Second additional guest full name"
                      className={`flex-1 px-4 py-3 rounded-lg border shadow-sm focus:outline-none transition-all duration-200 touch-manipulation min-h-[48px] text-base ${
                        fieldErrors.guest_1
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-warmSand focus:border-autumnGreen focus:ring-2 focus:ring-autumnGreen/20'
                      }`}
                      aria-describedby={fieldErrors.guest_1 ? 'guest_1-error' : undefined}
                      onBlur={(e) => validateField('guest_1', e.target.value)}
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
                      className="flex justify-center items-center min-w-[44px] min-h-[44px] text-red-600 rounded-lg transition-all duration-200 hover:text-red-800 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 touch-manipulation active:scale-[0.95]"
                      aria-label="Remove guest 2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  {renderFieldError('guest_1')}
                </div>
              )}

              {guestCount >= 3 && (
                <div>
                  <div className="flex gap-2 items-center">
                    <label htmlFor="guest_2" className="sr-only">
                      Third additional guest name
                    </label>
                    <input
                      id="guest_2"
                      type="text"
                      name="guest_2"
                      placeholder="Guest 3 name"
                      aria-label="Third additional guest full name"
                      className={`flex-1 px-4 py-3 rounded-lg border shadow-sm focus:outline-none transition-all duration-200 touch-manipulation min-h-[48px] text-base ${
                        fieldErrors.guest_2
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-warmSand focus:border-autumnGreen focus:ring-2 focus:ring-autumnGreen/20'
                      }`}
                      aria-describedby={fieldErrors.guest_2 ? 'guest_2-error' : undefined}
                      onBlur={(e) => validateField('guest_2', e.target.value)}
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
                      className="flex justify-center items-center min-w-[44px] min-h-[44px] text-red-600 rounded-lg transition-all duration-200 hover:text-red-800 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 touch-manipulation active:scale-[0.95]"
                      aria-label="Remove guest 3"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  {renderFieldError('guest_2')}
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
                  className="flex gap-3 items-center justify-center px-6 py-3 min-h-[48px] text-base font-medium rounded-lg border transition-all duration-200 text-autumnGreen hover:text-autumnGreen/80 hover:bg-autumnGreen/5 border-autumnGreen/30 hover:border-autumnGreen/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-autumnGreen focus-visible:ring-offset-2 touch-manipulation active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
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
            aria-describedby={`notes-description${fieldErrors.notes ? ' notes-error' : ''}`}
            className={`px-4 py-3 mt-1 w-full rounded-lg border shadow-sm focus:outline-none transition-all duration-200 touch-manipulation text-base resize-y ${
              fieldErrors.notes
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-warmSand focus:border-autumnGreen focus:ring-2 focus:ring-autumnGreen/20'
            }`}
            onBlur={(e) => validateField('notes', e.target.value)}
          />
          {renderFieldError('notes')}
          <p id="notes-description" className="mt-1 text-xs text-ink/60">
            Please let us know about any dietary needs, song requests, or special accommodations
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <Button as="button" type="submit" disabled={!hasEnv} loading={submitting}>
            Submit RSVP
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
