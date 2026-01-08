export * from "./csrf";
export * from "./sanitize";
export * from "./headers";
export * from "./api-key";

import { NextRequest, NextResponse } from "next/server";
import { validateApiKey, hasScope } from "./api-key";
import {
  checkRateLimit,
  getClientIp,
  getRateLimitHeaders,
} from "@/lib/rate-limit";

export interface SecurityContext {
  authenticated: boolean;
  method: "session" | "api_key" | "none";
  userId?: string;
  organizationId?: string;
  scopes?: string[];
}

export async function authenticateRequest(
  request: NextRequest,
  options: { requireAuth?: boolean; requiredScopes?: string[] } = {},
): Promise<{ context: SecurityContext; error?: NextResponse }> {
  const { requireAuth = true, requiredScopes = [] } = options;

  // Check for API key authentication
  const authHeader = request.headers.get("Authorization");

  if (authHeader?.startsWith("Bearer tac_")) {
    const apiKey = authHeader.replace("Bearer ", "");
    const result = await validateApiKey(apiKey);

    if (!result.valid) {
      return {
        context: { authenticated: false, method: "none" },
        error: NextResponse.json({ error: result.error }, { status: 401 }),
      };
    }

    // Check required scopes
    for (const scope of requiredScopes) {
      if (!hasScope(result.scopes || [], scope)) {
        return {
          context: { authenticated: false, method: "none" },
          error: NextResponse.json(
            { error: `Missing required scope: ${scope}` },
            { status: 403 },
          ),
        };
      }
    }

    return {
      context: {
        authenticated: true,
        method: "api_key",
        organizationId: result.organizationId,
        scopes: result.scopes,
      },
    };
  }

  // For session-based auth, return context indicating no API key
  // Actual session validation happens in middleware
  if (requireAuth && !authHeader) {
    return {
      context: { authenticated: false, method: "none" },
      error: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      ),
    };
  }

  return {
    context: { authenticated: false, method: "none" },
  };
}

export function applyRateLimit(
  request: NextRequest,
  config: { maxRequests: number; windowMs: number },
): {
  allowed: boolean;
  response?: NextResponse;
  headers: Record<string, string>;
} {
  const clientIp = getClientIp(request);
  const result = checkRateLimit(clientIp, config);
  const headers = getRateLimitHeaders(result);

  if (!result.success) {
    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: "Too many requests",
          retryAfter: Math.ceil(result.resetIn / 1000),
        },
        { status: 429, headers },
      ),
      headers,
    };
  }

  return { allowed: true, headers };
}
