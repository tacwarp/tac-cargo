import { describe, it, expect, beforeEach, vi } from 'vitest'
import { 
  checkRateLimit, 
  getRateLimitHeaders, 
  createRateLimiter, 
  getClientIp,
  RATE_LIMITS 
} from '@/lib/rate-limit'

describe('Rate Limiting', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  describe('checkRateLimit', () => {
    it('should allow first request', () => {
      const result = checkRateLimit('test-user-1', { maxRequests: 5, windowMs: 60000 })
      
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(4)
      expect(result.limit).toBe(5)
    })

    it('should track request count', () => {
      const config = { maxRequests: 3, windowMs: 60000 }
      
      const result1 = checkRateLimit('test-user-2', config)
      const result2 = checkRateLimit('test-user-2', config)
      const result3 = checkRateLimit('test-user-2', config)
      
      expect(result1.remaining).toBe(2)
      expect(result2.remaining).toBe(1)
      expect(result3.remaining).toBe(0)
    })

    it('should block when limit exceeded', () => {
      const config = { maxRequests: 2, windowMs: 60000 }
      
      checkRateLimit('test-user-3', config)
      checkRateLimit('test-user-3', config)
      const result = checkRateLimit('test-user-3', config)
      
      expect(result.success).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('should reset after window expires', () => {
      const config = { maxRequests: 2, windowMs: 1000 }
      
      checkRateLimit('test-user-4', config)
      checkRateLimit('test-user-4', config)
      
      vi.advanceTimersByTime(1100)
      
      const result = checkRateLimit('test-user-4', config)
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(1)
    })
  })

  describe('getRateLimitHeaders', () => {
    it('should return correct headers', () => {
      const result = {
        success: true,
        remaining: 5,
        resetIn: 30000,
        limit: 10,
      }
      
      const headers = getRateLimitHeaders(result)
      
      expect(headers['X-RateLimit-Limit']).toBe('10')
      expect(headers['X-RateLimit-Remaining']).toBe('5')
      expect(headers['X-RateLimit-Reset']).toBe('30')
    })
  })

  describe('createRateLimiter', () => {
    it('should create a reusable limiter function', () => {
      const limiter = createRateLimiter({ maxRequests: 5, windowMs: 60000 })
      
      const result1 = limiter('user-a')
      const result2 = limiter('user-b')
      
      expect(result1.success).toBe(true)
      expect(result2.success).toBe(true)
      expect(result1.remaining).toBe(4)
      expect(result2.remaining).toBe(4)
    })
  })

  describe('getClientIp', () => {
    it('should extract IP from x-forwarded-for', () => {
      const request = new Request('http://localhost', {
        headers: { 'x-forwarded-for': '192.168.1.1, 10.0.0.1' },
      })
      
      expect(getClientIp(request)).toBe('192.168.1.1')
    })

    it('should extract IP from x-real-ip', () => {
      const request = new Request('http://localhost', {
        headers: { 'x-real-ip': '192.168.1.2' },
      })
      
      expect(getClientIp(request)).toBe('192.168.1.2')
    })

    it('should extract IP from cf-connecting-ip', () => {
      const request = new Request('http://localhost', {
        headers: { 'cf-connecting-ip': '192.168.1.3' },
      })
      
      expect(getClientIp(request)).toBe('192.168.1.3')
    })

    it('should return unknown if no IP headers', () => {
      const request = new Request('http://localhost')
      
      expect(getClientIp(request)).toBe('unknown')
    })
  })

  describe('RATE_LIMITS', () => {
    it('should have api limits', () => {
      expect(RATE_LIMITS.api).toBeDefined()
      expect(RATE_LIMITS.api.maxRequests).toBe(60)
    })

    it('should have auth limits', () => {
      expect(RATE_LIMITS.auth).toBeDefined()
      expect(RATE_LIMITS.auth.maxRequests).toBe(5)
    })

    it('should have sensitive limits', () => {
      expect(RATE_LIMITS.sensitive).toBeDefined()
      expect(RATE_LIMITS.sensitive.maxRequests).toBe(10)
    })
  })
})
