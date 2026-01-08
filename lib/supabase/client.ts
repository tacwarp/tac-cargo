/**
 * @fileoverview Supabase browser client configuration
 * @module lib/supabase/client
 *
 * Creates a Supabase client instance for browser-side operations.
 * Uses environment variables for secure configuration.
 */

import { createBrowserClient } from "@supabase/ssr";

/**
 * Gets and validates Supabase URL from environment
 * @throws {Error} If NEXT_PUBLIC_SUPABASE_URL is missing
 */
function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
  }
  return url;
}

/**
 * Gets and validates Supabase anon key from environment
 * @throws {Error} If NEXT_PUBLIC_SUPABASE_ANON_KEY is missing
 */
function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable",
    );
  }
  return key;
}

/**
 * Creates a Supabase client for browser-side operations.
 *
 * This client is configured for client-side usage and handles:
 * - Authentication state management
 * - Real-time subscriptions
 * - Database queries from React components
 *
 * @returns {ReturnType<typeof createBrowserClient>} Configured Supabase client instance
 *
 * @example
 * ```tsx
 * import { createClient } from '@/lib/supabase/client'
 *
 * const supabase = createClient()
 * const { data, error } = await supabase.from('shipments').select('*')
 * ```
 *
 * @security
 * - Uses anon key (safe for browser exposure)
 * - RLS policies enforce data access control
 * - Do not expose service role key in browser
 */
export function createClient() {
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
}
