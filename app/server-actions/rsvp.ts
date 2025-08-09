'use server';

import { getSupabase, type RsvpPayload } from '../../lib/supabase';

/**
 * Server Action invoked by the client RSVP form.
 * Uses server-side SUPABASE_URL and SUPABASE_ANON_KEY envs.
 */
export async function submitRsvp(payload: RsvpPayload) {
  const supabase = getSupabase();
  if (!supabase) {
    return { ok: false, error: 'Supabase environment variables not set. Skipping submission.' };
  }

  try {
    const { error } = await supabase.from('rsvps').insert({
      full_name: payload.full_name,
      email: payload.email ?? null,
      attending: payload.attending,
      guests: payload.guests ?? 0,
      notes: payload.notes ?? null,
      submitted_at: new Date().toISOString(),
    });

    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false, error: msg };
  }
}