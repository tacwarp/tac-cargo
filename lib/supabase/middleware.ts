import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";



export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;
  const isApiRoute = pathname.startsWith("/api/");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Supabase credentials missing in middleware. Skipping auth check.");
      return supabaseResponse;
    }
    // In production, we can't function without auth, but maybe better to not crash
    throw new Error("Missing Supabase credentials in middleware");
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }[],
        ) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  let user = null;
  try {
    const {
      data: { user: u },
      error,
    } = await supabase.auth.getUser();
    user = u;

    // If we have a refresh token error, we should effectively logout
    if (error) {
      // Intentionally ignore the error to treat as logged out
      // You could optionally clear cookies here if Supabase doesn't do it automatically
    }
  } catch {
    // Catch any errors that might be thrown by the auth client
    // and treat the user as unauthenticated
    user = null;
  }

  // Add security headers
  supabaseResponse.headers.set("X-Content-Type-Options", "nosniff");
  supabaseResponse.headers.set("X-Frame-Options", "DENY");
  supabaseResponse.headers.set("X-XSS-Protection", "1; mode=block");
  supabaseResponse.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin",
  );

  // Handle authentication for protected routes
  if (!user && isDashboardRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login
  if (user && pathname === "/login") {
    const redirect =
      request.nextUrl.searchParams.get("redirect") || "/dashboard";
    const url = request.nextUrl.clone();
    url.pathname = redirect;
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Add user context headers for API routes (development only)
  if (process.env.NODE_ENV === "development" && isApiRoute && user) {
    supabaseResponse.headers.set("X-User-Id", user.id);
  }

  return supabaseResponse;
}
