import { NextResponse } from "next/server";
import { ZodError } from "zod";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export function successResponse<T>(
  data: T,
  status = 200,
  meta?: ApiResponse["meta"],
): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };
  if (meta) response.meta = meta;
  return NextResponse.json(response, { status });
}

export function errorResponse(
  message: string,
  status = 400,
  details?: unknown,
): NextResponse {
  const response: ApiResponse = {
    success: false,
    error: message,
  };
  if (details) response.details = details;
  return NextResponse.json(response, { status });
}

export function validationErrorResponse(error: ZodError): NextResponse {
  return errorResponse(
    "Validation failed",
    400,
    error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    })),
  );
}

export function unauthorizedResponse(message = "Unauthorized"): NextResponse {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message = "Forbidden"): NextResponse {
  return errorResponse(message, 403);
}

export function notFoundResponse(message = "Not found"): NextResponse {
  return errorResponse(message, 404);
}

export function conflictResponse(message = "Conflict"): NextResponse {
  return errorResponse(message, 409);
}

export function rateLimitResponse(retryAfter: number): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: "Too many requests",
      retryAfter,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
      },
    },
  );
}

export function serverErrorResponse(error: unknown): NextResponse {
  console.error("Server error:", error);
  return errorResponse("Internal server error", 500);
}
