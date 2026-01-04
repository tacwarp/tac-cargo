import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_ROUTES = [
  '/login',
  '/auth',
  '/register',
  '/track',
  '/api/track',
  '/api/health',
  '/api/webhooks',
  '/pricing',
  '/request-access',
]

const RATE_LIMIT_ROUTES = [
  { path: '/api/auth', limit: 5, window: 60000 },
  { path: '/api/track', limit: 60, window: 60000 },
  { path: '/api/', limit: 100, window: 60000 },
]

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  })
  
  const pathname = request.nextUrl.pathname
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))
  const isApiRoute = pathname.startsWith('/api/')
  const isDashboardRoute = pathname.startsWith('/dashboard')
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(
          cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]
        ) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Add security headers
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
  supabaseResponse.headers.set('X-Frame-Options', 'DENY')
  supabaseResponse.headers.set('X-XSS-Protection', '1; mode=block')
  supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Handle authentication for protected routes
  if (!user && isDashboardRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from login
  if (user && pathname === '/login') {
    const redirect = request.nextUrl.searchParams.get('redirect') || '/dashboard'
    const url = request.nextUrl.clone()
    url.pathname = redirect
    url.search = ''
    return NextResponse.redirect(url)
  }

  // Add user context headers for API routes
  if (isApiRoute && user) {
    supabaseResponse.headers.set('X-User-Id', user.id)
  }

  return supabaseResponse
}
