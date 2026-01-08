/**
 * Uniform Server Action result type
 * All server actions must return this shape for consistent error handling
 */

export type ActionResult<T = void> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; code?: ActionErrorCode };

export type ActionErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR"
  | "DATABASE_ERROR"
  | "EXTERNAL_SERVICE_ERROR";

/**
 * Helper to create success result
 */
export function success<T>(data: T, message?: string): ActionResult<T> {
  return { success: true, data, message };
}

/**
 * Helper to create error result
 */
export function error<T = void>(
  message: string,
  code?: ActionErrorCode
): ActionResult<T> {
  return { success: false, error: message, code };
}
