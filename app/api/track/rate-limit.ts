/**
 * Simple in-memory rate limiter for tracking API
 * Production: Use Redis or Upstash Rate Limit
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetAt: number
  }
}

const store: RateLimitStore = {}

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach((key) => {
    if (store[key].resetAt < now) {
      delete store[key]
    }
  })
}, 5 * 60 * 1000)

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Rate limit tracker by IP address
 * @param identifier - IP address or user identifier
 * @param limit - Maximum requests allowed per window
 * @param windowMs - Time window in milliseconds
 */
export function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60 * 1000 // 1 minute
): RateLimitResult {
  const now = Date.now()
  const key = `track:${identifier}`

  if (!store[key] || store[key].resetAt < now) {
    // Initialize or reset
    store[key] = {
      count: 1,
      resetAt: now + windowMs,
    }

    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: store[key].resetAt,
    }
  }

  // Increment counter
  store[key].count++

  if (store[key].count > limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: store[key].resetAt,
    }
  }

  return {
    success: true,
    limit,
    remaining: limit - store[key].count,
    reset: store[key].resetAt,
  }
}
