/**
 * @fileoverview Supabase server client configuration
 * @module lib/supabase/server
 *
 * Creates a Supabase client instance for server-side operations.
 * Handles cookie-based session management for Next.js App Router.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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
 * Creates a Supabase client for server-side operations.
 *
 * This client is configured for Server Components and API routes:
 * - Handles cookie-based authentication
 * - Supports session refresh
 * - Works with Next.js App Router
 *
 * @returns {Promise<ReturnType<typeof createServerClient>>} Configured Supabase server client
 *
 * @example
 * ```tsx
 * // In a Server Component or API route
 * import { createClient } from '@/lib/supabase/server'
 *
 * export async function GET() {
 *   const supabase = await createClient()
 *   const { data: { user } } = await supabase.auth.getUser()
 *   // ...
 * }
 * ```
 *
 * @security
 * - Uses httpOnly cookies for session storage
 * - Automatically refreshes expired sessions
 * - RLS policies enforce server-side data access
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      /**
       * Retrieves all cookies from the request
       * @returns {Array<{name: string, value: string}>} Array of cookie objects
       */
      getAll() {
        return cookieStore.getAll();
      },
      /**
       * Sets multiple cookies in the response
       * @param cookiesToSet - Array of cookies to set
       */
      setAll(
        cookiesToSet: {
          name: string;
          value: string;
          options?: Record<string, unknown>;
        }[],
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}
