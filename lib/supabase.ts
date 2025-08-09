import { createClient } from '@supabase/supabase-js';

export type RsvpPayload = {
  full_name: string;
  email?: string;
  attending: boolean;
  guests?: number;
  notes?: string;
};

/**
 * Pure helper that creates a Supabase client using server-side env.
 * Not a Server Action. Safe to call from other server code.
 */
export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}