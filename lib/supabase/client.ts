/**
 * @fileoverview Supabase browser client configuration
 * @module lib/supabase/client
 * 
 * Creates a Supabase client instance for browser-side operations.
 * Uses environment variables for secure configuration.
 */

import { createBrowserClient } from '@supabase/ssr'

/**
 * Environment variable validation
 * @throws {Error} If required environment variables are missing
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
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
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
