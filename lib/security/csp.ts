/**
 * Content Security Policy (CSP) configuration
 * Prevents XSS attacks and other security vulnerabilities
 */

export const CSP_DIRECTIVES = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'", // Required for Next.js
    "'unsafe-eval'", // Required for development
    "https://cdn.jsdelivr.net", // For external libraries
  ],
  "style-src": [
    "'self'",
    "'unsafe-inline'", // Required for Tailwind and styled-components
    "https://fonts.googleapis.com",
  ],
  "img-src": [
    "'self'",
    "data:",
    "https:", // Allow all HTTPS images
    "blob:",
  ],
  "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
  "connect-src": [
    "'self'",
    "https://*.supabase.co", // Supabase API
    "wss://*.supabase.co", // Supabase Realtime
    "https://*.sentry.io", // Sentry monitoring
  ],
  "frame-ancestors": ["'none'"], // Prevent clickjacking
  "form-action": ["'self'"],
  "base-uri": ["'self'"],
  "object-src": ["'none'"],
  "upgrade-insecure-requests": [],
};

/**
 * Generate CSP header string
 */
export function generateCSPHeader(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, values]) => {
      if (values.length === 0) return directive;
      return `${directive} ${values.join(" ")}`;
    })
    .join("; ");
}

/**
 * CSP for development (more permissive)
 */
export const CSP_DEV = generateCSPHeader();

/**
 * CSP for production (stricter)
 */
export const CSP_PROD = generateCSPHeader().replace("'unsafe-eval'", "");
