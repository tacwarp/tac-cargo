/**
 * @fileoverview Utility functions for the TAC Cargo application
 * @module lib/utils
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines and merges CSS class names using clsx and tailwind-merge.
 * 
 * This utility resolves Tailwind CSS class conflicts and combines
 * conditional class names into a single string.
 * 
 * @param {...ClassValue[]} inputs - Class values to combine (strings, objects, arrays)
 * @returns {string} Merged class string with conflicts resolved
 * 
 * @example
 * ```tsx
 * // Basic usage
 * cn('px-4 py-2', 'px-6') // Returns 'py-2 px-6' (px-6 overrides px-4)
 * 
 * // Conditional classes
 * cn('base-class', isActive && 'active-class', { 'hover:bg-primary': isHoverable })
 * 
 * // With component props
 * <div className={cn('default-styles', className)} />
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string to a localized format.
 * 
 * @param {string | Date} date - Date to format
 * @param {Intl.DateTimeFormatOptions} options - Formatting options
 * @returns {string} Formatted date string
 * 
 * @example
 * ```tsx
 * formatDate('2024-01-15') // Returns "Jan 15, 2024"
 * formatDate(new Date(), { dateStyle: 'full' }) // Returns "Monday, January 15, 2024"
 * ```
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
): string {
  return new Intl.DateTimeFormat('en-US', options).format(
    typeof date === 'string' ? new Date(date) : date
  )
}

/**
 * Formats a number as currency.
 * 
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string
 * 
 * @example
 * ```tsx
 * formatCurrency(1234.56) // Returns "$1,234.56"
 * formatCurrency(1234.56, 'EUR') // Returns "€1,234.56"
 * ```
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Truncates a string to a specified length with ellipsis.
 * 
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated string with ellipsis if needed
 * 
 * @example
 * ```tsx
 * truncate('Hello World', 5) // Returns "Hello..."
 * truncate('Hi', 10) // Returns "Hi"
 * ```
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength)}...`
}

/**
 * Validates an email address format.
 * 
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 * 
 * @example
 * ```tsx
 * isValidEmail('user@example.com') // Returns true
 * isValidEmail('invalid-email') // Returns false
 * ```
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Generates a cryptographically secure random ID string.
 * 
 * Uses Web Crypto API for secure random generation.
 * Suitable for tokens, session IDs, and security-sensitive contexts.
 * 
 * @param {number} length - Length of the ID (default: 8)
 * @returns {string} Random alphanumeric ID
 * 
 * @example
 * ```tsx
 * generateId() // Returns something like "a1b2c3d4"
 * generateId(12) // Returns 12-character ID
 * ```
 * 
 * @security Uses crypto.getRandomValues for cryptographically secure randomness
 */
export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => chars[byte % chars.length]).join('')
}

/**
 * Generates a UUID v4 using Web Crypto API.
 * 
 * @returns {string} UUID v4 string
 * 
 * @example
 * ```tsx
 * generateUUID() // Returns "550e8400-e29b-41d4-a716-446655440000"
 * ```
 */
export function generateUUID(): string {
  return crypto.randomUUID()
}

/**
 * Debounces a function call.
 * 
 * @param {T} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {(...args: Parameters<T>) => void} Debounced function
 * 
 * @example
 * ```tsx
 * const debouncedSearch = debounce((query: string) => {
 *   // Search logic
 * }, 300)
 * ```
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttles a function call.
 * 
 * @param {T} func - Function to throttle
 * @param {number} limit - Minimum milliseconds between calls
 * @returns {(...args: Parameters<T>) => void} Throttled function
 * 
 * @example
 * ```tsx
 * const throttledScroll = throttle(() => {
 *   // Scroll handler logic
 * }, 100)
 * ```
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Safely parses JSON with error handling.
 * 
 * @param {string} json - JSON string to parse
 * @param {T} fallback - Fallback value if parsing fails
 * @returns {T} Parsed value or fallback
 * 
 * @example
 * ```tsx
 * safeJsonParse('{"name":"test"}', {}) // Returns { name: "test" }
 * safeJsonParse('invalid', {}) // Returns {}
 * ```
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}

/**
 * Sleep for a specified duration.
 * 
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>} Promise that resolves after delay
 * 
 * @example
 * ```tsx
 * await sleep(1000) // Wait 1 second
 * ```
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Clamps a number between min and max values.
 * 
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 * 
 * @example
 * ```tsx
 * clamp(150, 0, 100) // Returns 100
 * clamp(-10, 0, 100) // Returns 0
 * clamp(50, 0, 100) // Returns 50
 * ```
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
