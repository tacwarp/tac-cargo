import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { CSP_PROD } from '@/lib/security/csp'

export async function proxy(request: NextRequest) {
  // Update Supabase session
  const response = await updateSession(request)

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
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|lottie|json)$).*)',
  ],
}
