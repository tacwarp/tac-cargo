/**
 * @fileoverview Rate limiting utilities for API protection
 * @module lib/rate-limit
 *
 * Provides in-memory rate limiting for API endpoints.
 * For production, consider using Redis or a distributed cache.
 */

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
}

/**
 * Rate limit result
 */
export interface RateLimitResult {
  /** Whether the request is allowed */
  success: boolean;
  /** Number of requests remaining in the window */
  remaining: number;
  /** Time until the rate limit resets (ms) */
  resetIn: number;
  /** Total limit for the window */
  limit: number;
}

/**
 * In-memory storage for rate limit tracking
 * Key: identifier (IP address or user ID)
 * Value: { count, resetTime }
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Clean up expired entries periodically
 */
const CLEANUP_INTERVAL = 60000; // 1 minute

let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, CLEANUP_INTERVAL);
}

// Start cleanup on module load (server-side only)
if (typeof globalThis === "undefined") {
  startCleanup();
}

/**
 * Default rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  /** Public API endpoints (e.g., tracking) */
  api: {
    maxRequests: 60,
    windowMs: 60000, // 1 minute
  },
  /** Authentication endpoints */
  auth: {
    maxRequests: 5,
    windowMs: 60000, // 1 minute
  },
  /** Sensitive operations */
  sensitive: {
    maxRequests: 10,
    windowMs: 300000, // 5 minutes
  },
} as const satisfies Record<string, RateLimitConfig>;

/**
 * Check rate limit for a given identifier.
 *
 * @param {string} identifier - Unique identifier (IP, user ID, etc.)
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {RateLimitResult} Rate limit check result
 *
 * @example
 * ```tsx
 * const ip = request.headers.get('x-forwarded-for') || 'unknown'
 * const result = checkRateLimit(ip, RATE_LIMITS.api)
 *
 * if (!result.success) {
 *   return new Response('Too Many Requests', { status: 429 })
 * }
 * ```
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig,
): RateLimitResult {
  const now = Date.now();
  const key = identifier;
  const existing = rateLimitStore.get(key);

  // If no existing record or window expired, create new
  if (!existing || now > existing.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs,
      limit: config.maxRequests,
    };
  }

  // Increment count
  existing.count++;
  const remaining = Math.max(0, config.maxRequests - existing.count);
  const resetIn = existing.resetTime - now;

  return {
    success: existing.count <= config.maxRequests,
    remaining,
    resetIn,
    limit: config.maxRequests,
  };
}

/**
 * Get rate limit headers for HTTP response.
 *
 * @param {RateLimitResult} result - Rate limit check result
 * @returns {Record<string, string>} HTTP headers
 *
 * @example
 * ```tsx
 * const result = checkRateLimit(ip, config)
 * const headers = getRateLimitHeaders(result)
 * return NextResponse.json(data, { headers })
 * ```
 */
export function getRateLimitHeaders(
  result: RateLimitResult,
): Record<string, string> {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(result.resetIn / 1000).toString(),
  };
}

/**
 * Creates a rate limiter function for a specific configuration.
 *
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {(identifier: string) => RateLimitResult} Rate limiter function
 *
 * @example
 * ```tsx
 * const apiLimiter = createRateLimiter(RATE_LIMITS.api)
 * const result = apiLimiter(clientIp)
 * ```
 */
export function createRateLimiter(config: RateLimitConfig) {
  return (identifier: string): RateLimitResult => {
    return checkRateLimit(identifier, config);
  };
}

/**
 * Get client IP from request headers.
 * Handles common proxy headers.
 *
 * @param {Request} request - Incoming request
 * @returns {string} Client IP address or 'unknown'
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;

  // Check common proxy headers
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    // Take the first IP (original client)
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  // Cloudflare
  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  return "unknown";
}
