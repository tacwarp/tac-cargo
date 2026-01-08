export const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(self)",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.resend.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
};

export const CORS_HEADERS = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token",
  "Access-Control-Max-Age": "86400",
};

export function getCorsOrigin(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.NODE_ENV === "production" && siteUrl) {
    return siteUrl;
  }
  return "*";
}

export function applySecurityHeaders(headers: Headers): void {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    headers.set(key, value);
  });
}

export function applyCorsHeaders(headers: Headers, origin?: string): void {
  const allowedOrigin = getCorsOrigin();

  if (allowedOrigin === "*" || allowedOrigin === origin) {
    headers.set("Access-Control-Allow-Origin", origin || allowedOrigin);
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
      headers.set(key, value);
    });
  }
}
