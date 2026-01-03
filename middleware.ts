import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { CSP_PROD } from '@/lib/security/csp'

export async function middleware(request: NextRequest) {
  // Update Supabase session
  let response = await updateSession(request)

  // Security headers
  const headers = new Headers(response.headers)

  // Content Security Policy
  if (process.env.NODE_ENV === 'production') {
    headers.set('Content-Security-Policy', CSP_PROD)
  }

  // Security headers
  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  headers.set('X-DNS-Prefetch-Control', 'on')

  // HSTS (HTTP Strict Transport Security)
  if (process.env.NODE_ENV === 'production') {
    headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  }

  return NextResponse.next({
    request,
    headers,
  })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
