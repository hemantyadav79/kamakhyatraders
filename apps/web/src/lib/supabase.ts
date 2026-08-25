import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// -----------------------------------------------------------------------------
// Supabase clients.
//   - `getSupabasePublic()`  : anon key, safe for reads (respects Row-Level
//                              Security). Used for public product listing.
//   - `getSupabaseAdmin()`   : service-role key, SERVER-ONLY, bypasses RLS.
//                              Used only in admin API routes for writes.
//
// If env vars are missing the helpers return null, and the data layer falls
// back to the built-in static catalogue — so the site works with zero config.
// -----------------------------------------------------------------------------

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}

let publicClient: SupabaseClient | null = null;
export function getSupabasePublic(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!publicClient) {
    publicClient = createClient(url, anonKey, {
      auth: { persistSession: false },
    });
  }
  return publicClient;
}

let adminClient: SupabaseClient | null = null;
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  if (!adminClient) {
    adminClient = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}
