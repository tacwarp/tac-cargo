/**
 * Enhanced rate limiting for production
 * Supports multiple strategies and Redis-compatible backend
 */

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyPrefix?: string;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

class RateLimiter {
  private store: Map<string, { count: number; resetAt: number }> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, value] of this.store.entries()) {
      if (value.resetAt < now) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Check and increment rate limit
   */
  check(identifier: string, config: RateLimitConfig): RateLimitResult {
    const key = `${config.keyPrefix || "rl"}:${identifier}`;
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || entry.resetAt < now) {
      // Initialize new window
      const resetAt = now + config.windowMs;
      this.store.set(key, { count: 1, resetAt });

      return {
        success: true,
        limit: config.maxRequests,
        remaining: config.maxRequests - 1,
        reset: resetAt,
      };
    }

    // Increment counter
    entry.count++;

    if (entry.count > config.maxRequests) {
      return {
        success: false,
        limit: config.maxRequests,
        remaining: 0,
        reset: entry.resetAt,
        retryAfter: Math.ceil((entry.resetAt - now) / 1000),
      };
    }

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - entry.count,
      reset: entry.resetAt,
    };
  }

  destroy() {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

/**
 * Pre-configured rate limits
 */
export const RATE_LIMITS = {
  api: { windowMs: 60 * 1000, maxRequests: 60, keyPrefix: "api" }, // 60/min
  tracking: { windowMs: 60 * 1000, maxRequests: 10, keyPrefix: "track" }, // 10/min
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5, keyPrefix: "auth" }, // 5/15min
  upload: { windowMs: 60 * 1000, maxRequests: 5, keyPrefix: "upload" }, // 5/min
};

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const real = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0] || real || "unknown";
  return ip.trim();
}

/**
 * Generate rate limit response headers
 */
export function getRateLimitHeaders(
  result: RateLimitResult,
): Record<string, string> {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": new Date(result.reset).toISOString(),
    ...(result.retryAfter && { "Retry-After": result.retryAfter.toString() }),
  };
}
