import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { CSP_PROD } from "@/lib/security/csp";

export async function proxy(request: NextRequest) {
  // Update Supabase session
  const response = await updateSession(request);

  // Content Security Policy
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Content-Security-Policy", CSP_PROD);
  }

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("X-DNS-Prefetch-Control", "on");

  // HSTS (HTTP Strict Transport Security)
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static/image assets and common binaries
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|rive|lottie|json)$).*)",
  ],
};
