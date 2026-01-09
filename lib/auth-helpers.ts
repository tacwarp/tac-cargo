/**
 * @fileoverview Authentication helper utilities
 * @module lib/auth-helpers
 *
 * Provides robust authentication operations with proper error handling
 * and state management to prevent authentication inconsistencies.
 *
 * @security
 * - Forces local session cleanup on sign-out failure
 * - Prevents authentication state inconsistency
 * - Clears all auth-related cookies and storage
 */

import { createClient } from "@/lib/supabase/client";
import { logger } from "@/lib/logger";

/**
 * Sign-out result with detailed status
 */
export interface SignOutResult {
  success: boolean;
  error?: Error;
  localCleanupPerformed: boolean;
}

/**
 * Performs a robust sign-out operation with forced local cleanup.
 *
 * This function ensures authentication state consistency by:
 * 1. Attempting Supabase sign-out (server-side session invalidation)
 * 2. If that fails, forcing local session cleanup anyway
 * 3. Clearing all auth-related browser storage
 * 4. Ensuring user cannot access protected routes
 *
 * @returns {Promise<SignOutResult>} Sign-out operation result
 *
 * @example
 * ```tsx
 * const result = await signOutUser()
 * if (result.success) {
 *   router.push('/login')
 * } else {
 *   // Still safe to redirect - local cleanup was performed
 *   router.push('/login')
 * }
 * ```
 *
 * @security
 * - Prevents authentication state inconsistency
 * - Forces local cleanup even on network failure
 * - Logs errors without exposing sensitive data
 */
export async function signOutUser(): Promise<SignOutResult> {
  const supabase = createClient();
  let localCleanupPerformed = false;

  try {
    // Attempt server-side sign-out
    const { error } = await supabase.auth.signOut();

    if (error) {
      // Server sign-out failed - force local cleanup
      logger.warn("Supabase sign-out failed, forcing local cleanup", {
        errorMessage: error.message,
      });

      // Force local session cleanup
      await forceLocalCleanup(supabase);
      localCleanupPerformed = true;

      return {
        success: false,
        error,
        localCleanupPerformed: true,
      };
    }

    // Server sign-out succeeded
    // Supabase client automatically cleans up local state
    return {
      success: true,
      localCleanupPerformed: false, // Not needed - server cleanup succeeded
    };
  } catch (error) {
    // Unexpected error (network failure, etc.)
    logger.error("Sign-out operation failed", error);

    // Force local cleanup to prevent state inconsistency
    try {
      await forceLocalCleanup(supabase);
      localCleanupPerformed = true;
    } catch (cleanupError) {
      logger.error("Local cleanup also failed", cleanupError);
    }

    return {
      success: false,
      error:
        error instanceof Error ? error : new Error("Unknown sign-out error"),
      localCleanupPerformed,
    };
  }
}

/**
 * Forces local session cleanup by clearing auth storage.
 *
 * This is a fallback mechanism when server-side sign-out fails.
 * It ensures the user cannot access protected routes even if
 * the server session wasn't properly invalidated.
 *
 * @param {ReturnType<typeof createClient>} supabase - Supabase client instance
 *
 * @security
 * - Clears all auth-related cookies
 * - Removes session from localStorage
 * - Prevents stale session access
 */
async function forceLocalCleanup(
  supabase: ReturnType<typeof createClient>,
): Promise<void> {
  try {
    // Clear Supabase auth storage
    // This removes the session from localStorage/cookies
    await supabase.auth.signOut({ scope: "local" });

    // Additional cleanup: clear any auth-related items from storage
    if (typeof globalThis !== "undefined") {
      // Clear localStorage items related to Supabase auth
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes("supabase") || key.includes("auth"))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));

      // Clear sessionStorage items related to Supabase auth
      const sessionKeysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.includes("supabase") || key.includes("auth"))) {
          sessionKeysToRemove.push(key);
        }
      }
      sessionKeysToRemove.forEach((key) => sessionStorage.removeItem(key));
    }

    logger.info("Local session cleanup completed");
  } catch (error) {
    logger.error("Force local cleanup failed", error);
    throw error;
  }
}

/**
 * Checks if user is currently authenticated.
 *
 * @returns {Promise<boolean>} True if user has valid session
 *
 * @example
 * ```tsx
 * const isAuth = await isAuthenticated()
 * if (!isAuth) {
 *   router.push('/login')
 * }
 * ```
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user !== null;
  } catch (error) {
    logger.error("Authentication check failed", error);
    return false;
  }
}

/**
 * Gets current user session.
 *
 * @returns {Promise<Session | null>} Current session or null
 */
export async function getCurrentSession() {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      logger.error("Failed to get current session", error);
      return null;
    }

    return user;
  } catch (error) {
    logger.error("Get session operation failed", error);
    return null;
  }
}
