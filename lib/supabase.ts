import { createClient } from '@supabase/supabase-js';

export type RsvpPayload = {
  full_name: string;
  email?: string;
  attending: boolean;
  guests?: number;
  guest_names?: string[];
  notes?: string;
};

/**
 * Creates a Supabase client for client-side usage.
 * Uses NEXT_PUBLIC_ environment variables that are available in the browser.
 */
export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn('Supabase environment variables not configured');
    return null;
  }
  
  return createClient(url, key, { 
    auth: { persistSession: false } 
  });
}

/**
 * Server-side Supabase client (for server actions - deprecated for static export)
 * @deprecated Use getSupabaseClient() for client-side usage instead
 */
export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}