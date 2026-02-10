'use client';

import { useState, type FormEvent } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Button } from '../ui/Button';
import type { Guest } from '../../app/rsvp/types';

interface RsvpFormProps {
  guest: Guest;
  onBackToSearch: () => void;
}

export function RsvpForm({ guest, onBackToSearch }: RsvpFormProps) {
  const [plusOneAttending, setPlusOneAttending] = useState(false);
  const [attendingFriday, setAttendingFriday] = useState<boolean | null>(null);
  const [attendingSaturday, setAttendingSaturday] = useState(true);
  const [showAdditionalGuests, setShowAdditionalGuests] = useState(false);
  const [additionalGuestNames, setAdditionalGuestNames] = useState<string[]>(['']);
  const [email, setEmail] = useState(guest.email || '');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const submitRsvp = useMutation(api.rsvps.submit);

  const addAdditionalGuest = () => {
    setAdditionalGuestNames([...additionalGuestNames, '']);
  };

  const removeAdditionalGuest = (index: number) => {
    setAdditionalGuestNames(additionalGuestNames.filter((_, i) => i !== index));
  };

  const updateAdditionalGuestName = (index: number, value: string) => {
    const updated = [...additionalGuestNames];
    updated[index] = value;
    setAdditionalGuestNames(updated);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Email is required
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    // At least one person must be attending Saturday
    if (!attendingSaturday) {
      errors.attending = 'Please confirm your attendance for the Saturday wedding';
    }

    // If Friday is shown, validate it
    if (guest.invited_to_friday && attendingFriday === null) {
      errors.friday = 'Please confirm your attendance for the Friday gathering';
    }

    // Validate additional guest names if any are filled
    additionalGuestNames.forEach((name, index) => {
      if (name.trim() && name.trim().length < 2) {
        errors[`additional_${index}`] = 'Guest name must be at least 2 characters';
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setSubmitStatus(null);

    try {
      // Filter out empty additional guest names
      const validAdditionalGuests = additionalGuestNames.filter((name) => name.trim().length > 0);

      await submitRsvp({
        guest_id: guest._id,
        attending_friday: guest.invited_to_friday ? attendingFriday : null,
        attending_saturday: attendingSaturday,
        plus_one_attending: guest.guest_plus_one ? plusOneAttending : null,
        additional_guests: validAdditionalGuests.length,
        additional_guest_names: validAdditionalGuests.length > 0 ? validAdditionalGuests : null,
        email: email.trim(),
        notes: notes.trim() || null,
      });

      setSubmitStatus({
        ok: true,
        msg: 'RSVP submitted successfully! Thank you!',
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setSubmitStatus({ ok: false, msg });
    } finally {
      setSubmitting(false);
      setCooldown(true);
      setTimeout(() => setCooldown(false), 3000);
    }
  };

  if (submitStatus?.ok) {
    return (
      <div className="py-6 text-center space-y-4">
        <div className="flex justify-center">
          <svg className="w-16 h-16 text-autumnGreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-ink">Thank you, {guest.full_name}!</h3>
        <p className="text-slate">Your RSVP has been submitted. We can&apos;t wait to celebrate with you!</p>
        <button
          type="button"
          onClick={onBackToSearch}
          className="mt-4 text-sm underline text-autumnGreen hover:text-autumnGreen/80"
        >
          RSVP for another guest
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-slate">Selected guest:</p>
          <p className="text-lg font-medium text-ink">{guest.full_name}</p>
          {guest.guest_plus_one && (
            <p className="text-sm text-slate">+ {guest.guest_plus_one}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onBackToSearch}
          className="text-sm underline rounded text-autumnGreen hover:text-autumnGreen/80 focus:outline-none focus:ring-2 focus:ring-autumnGreen focus:ring-offset-2"
        >
          Change
        </button>
      </div>

      <div className="pt-4 space-y-5 border-t border-warmSand">
        {/* Friday Night Gathering */}
        {guest.invited_to_friday && (
          <fieldset>
            <legend className="block mb-3 text-sm font-medium text-ink">
              Friday Night Gathering
            </legend>
            <div className="flex flex-col gap-3">
              <label className="inline-flex gap-3 items-center p-4 text-base text-ink cursor-pointer rounded-lg border transition-all duration-200 hover:bg-warmSand/20 has-[:checked]:bg-watercolorBlue/10 has-[:checked]:border-watercolorBlue touch-manipulation min-h-[56px]">
                <input
                  type="radio"
                  name="attending_friday"
                  checked={attendingFriday === true}
                  onChange={() => setAttendingFriday(true)}
                  className="w-5 h-5 accent-watercolorBlue focus:outline-none focus:ring-2 focus:ring-watercolorBlue focus:ring-offset-2"
                />
                <span className="font-medium">Yes, I will attend</span>
              </label>
              <label className="inline-flex gap-3 items-center p-4 text-base text-ink cursor-pointer rounded-lg border transition-all duration-200 hover:bg-warmSand/20 has-[:checked]:bg-watercolorBlue/10 has-[:checked]:border-watercolorBlue touch-manipulation min-h-[56px]">
                <input
                  type="radio"
                  name="attending_friday"
                  checked={attendingFriday === false}
                  onChange={() => setAttendingFriday(false)}
                  className="w-5 h-5 accent-watercolorBlue focus:outline-none focus:ring-2 focus:ring-watercolorBlue focus:ring-offset-2"
                />
                <span className="font-medium">No, I cannot attend</span>
              </label>
            </div>
            {fieldErrors.friday && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.friday}</p>
            )}
          </fieldset>
        )}

        {/* Saturday Wedding */}
        <fieldset>
          <legend className="block mb-3 text-sm font-medium text-ink">
            Saturday Wedding
          </legend>
          <div className="flex flex-col gap-3">
            <label className="inline-flex gap-3 items-center p-4 text-base text-ink cursor-pointer rounded-lg border transition-all duration-200 hover:bg-warmSand/20 has-[:checked]:bg-watercolorBlue/10 has-[:checked]:border-watercolorBlue touch-manipulation min-h-[56px]">
              <input
                type="radio"
                name="attending_saturday"
                checked={attendingSaturday === true}
                onChange={() => setAttendingSaturday(true)}
                className="w-5 h-5 accent-watercolorBlue focus:outline-none focus:ring-2 focus:ring-watercolorBlue focus:ring-offset-2"
              />
              <span className="font-medium">Yes, I will attend</span>
            </label>
            <label className="inline-flex gap-3 items-center p-4 text-base text-ink cursor-pointer rounded-lg border transition-all duration-200 hover:bg-warmSand/20 has-[:checked]:bg-watercolorBlue/10 has-[:checked]:border-watercolorBlue touch-manipulation min-h-[56px]">
              <input
                type="radio"
                name="attending_saturday"
                checked={attendingSaturday === false}
                onChange={() => setAttendingSaturday(false)}
                className="w-5 h-5 accent-watercolorBlue focus:outline-none focus:ring-2 focus:ring-watercolorBlue focus:ring-offset-2"
              />
              <span className="font-medium">No, I cannot attend</span>
            </label>
          </div>
          {fieldErrors.attending && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.attending}</p>
          )}
        </fieldset>

        {/* Guest Attendance Checkboxes */}
        <div>
          <p className="block mb-3 text-sm font-medium text-ink">Who is attending?</p>
          <div className="space-y-3">
            <label className="flex gap-3 items-center p-4 text-base text-ink cursor-pointer rounded-lg border transition-all duration-200 hover:bg-warmSand/20 has-[:checked]:bg-watercolorBlue/10 has-[:checked]:border-watercolorBlue touch-manipulation min-h-[56px] bg-watercolorBlue/10 border-watercolorBlue">
              <input
                type="checkbox"
                checked={true}
                disabled
                className="w-5 h-5 accent-watercolorBlue focus:outline-none focus:ring-2 focus:ring-watercolorBlue focus:ring-offset-2"
              />
              <span className="font-medium">{guest.full_name}</span>
            </label>

            {guest.guest_plus_one && (
              <label className="flex gap-3 items-center p-4 text-base text-ink cursor-pointer rounded-lg border transition-all duration-200 hover:bg-warmSand/20 has-[:checked]:bg-watercolorBlue/10 has-[:checked]:border-watercolorBlue touch-manipulation min-h-[56px]">
                <input
                  type="checkbox"
                  checked={plusOneAttending}
                  onChange={(e) => setPlusOneAttending(e.target.checked)}
                  className="w-5 h-5 accent-watercolorBlue focus:outline-none focus:ring-2 focus:ring-watercolorBlue focus:ring-offset-2"
                />
                <span className="font-medium">{guest.guest_plus_one}</span>
              </label>
            )}
          </div>
        </div>

        {/* Additional Guests */}
        <div>
          {!showAdditionalGuests ? (
            <button
              type="button"
              onClick={() => setShowAdditionalGuests(true)}
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
              Add additional guests
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="block text-sm font-medium text-ink">Additional guests</p>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdditionalGuests(false);
                    setAdditionalGuestNames(['']);
                  }}
                  className="text-sm underline text-slate hover:text-ink"
                >
                  Remove
                </button>
              </div>
              {additionalGuestNames.map((name, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => updateAdditionalGuestName(index, e.target.value)}
                    placeholder={`Guest ${index + 1} name`}
                    className={`flex-1 px-4 py-3 text-base rounded-lg border shadow-sm transition-all duration-200 focus:outline-none touch-manipulation min-h-[48px] ${ fieldErrors[`additional_${index}`]
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-warmSand focus:border-autumnGreen focus:ring-2 focus:ring-autumnGreen/20'
                    }`}
                    aria-describedby={fieldErrors[`additional_${index}`] ? `additional_${index}-error` : undefined}
                  />
                  {additionalGuestNames.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAdditionalGuest(index)}
                      className="flex justify-center items-center min-w-[44px] min-h-[44px] text-red-600 rounded-lg transition-all duration-200 hover:text-red-800 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 touch-manipulation active:scale-[0.95]"
                      aria-label={`Remove guest ${index + 1}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                  {fieldErrors[`additional_${index}`] && (
                    <p id={`additional_${index}-error`} className="absolute mt-12 text-sm text-red-600">
                      {fieldErrors[`additional_${index}`]}
                    </p>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addAdditionalGuest}
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
                Add another guest
              </button>
            </div>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink">
            Email *
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className={`px-4 py-3 mt-1 w-full rounded-lg border shadow-sm focus:outline-none transition-all duration-200 touch-manipulation min-h-[48px] text-base ${
              fieldErrors.email
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-warmSand focus:border-autumnGreen focus:ring-2 focus:ring-autumnGreen/20'
            }`}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            required
          />
          {fieldErrors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Notes Field */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-ink">
            Additional notes (optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Any dietary restrictions, song requests, or special accommodations"
            className="px-4 py-3 mt-1 w-full text-base rounded-lg border shadow-sm transition-all duration-200 resize-y focus:outline-none touch-manipulation border-warmSand focus:border-autumnGreen focus:ring-2 focus:ring-autumnGreen/20"
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 items-center">
          <Button as="button" type="submit" disabled={cooldown} loading={submitting}>
            Submit RSVP
          </Button>
        </div>

        {/* Error Message */}
        {submitStatus && !submitStatus.ok && (
          <div
            className="text-sm text-red-700"
            role="alert"
            aria-live="polite"
            aria-atomic="true"
          >
            {submitStatus.msg}
          </div>
        )}
      </div>
    </form>
  );
}
