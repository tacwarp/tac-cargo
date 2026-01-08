# API Contracts & Schemas

## API Architecture

### Type: Hybrid REST + Server Actions

- **Public Endpoints**: REST API (`/api/*`)
- **Authenticated Mutations**: Server Actions (`app/actions/*`)
- **Real-Time**: Supabase Realtime (WebSocket)

## REST API Endpoints

### Tracking Endpoint

```
GET /api/track?id={trackingId}
```

**Request**:

```typescript
interface TrackingRequest {
  id: string; // Tracking ID (required)
}
```

**Response** (200 OK):

```typescript
interface TrackingResponse {
  success: true;
  data: {
    id: string;
    trackingId: string;
    status: "pending" | "in_transit" | "delivered" | "failed";
    origin: string;
    destination: string;
    currentLocation?: string;
    estimatedDelivery: string; // ISO 8601 datetime
    updates: {
      timestamp: string; // ISO 8601 datetime
      location: string;
      status: string;
      note?: string;
    }[];
    metadata: {
      weight?: number;
      dimensions?: string;
      carrier?: string;
    };
  };
}
```

**Error Response** (404 Not Found):

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: "NOT_FOUND" | "INVALID_ID" | "SERVER_ERROR";
    message: string;
    details?: unknown;
  };
}
```

**Example**:

```bash
curl -X GET "https://tac-cargo.vercel.app/api/track?id=TAC123456"
```

### MCP Protocol Handler

```
POST /api/mcp
```

**Purpose**: Model Context Protocol for AI integrations

**Request**:

```typescript
interface MCPRequest {
  method: "tools/list" | "tools/call";
  params?: {
    name?: string;
    arguments?: Record<string, unknown>;
  };
}
```

**Response**:

```typescript
interface MCPResponse {
  tools?: Array<{
    name: string;
    description: string;
    inputSchema: object;
  }>;
  result?: unknown;
  error?: {
    code: string;
    message: string;
  };
}
```

## Server Actions

### Location

```
app/actions/[domain].ts
```

### Pattern

```typescript
"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Input validation schema
const UpdateShipmentSchema = z.object({
  shipmentId: z.string().uuid(),
  status: z.enum(["pending", "in_transit", "delivered", "failed"]),
  location: z.string().optional(),
  note: z.string().max(500).optional(),
});

type UpdateShipmentInput = z.infer<typeof UpdateShipmentSchema>;

// Return type
interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    field?: string;
  };
}

export async function updateShipmentStatus(
  input: UpdateShipmentInput,
): Promise<ActionResult<Shipment>> {
  try {
    // 1. Validate input
    const validated = UpdateShipmentSchema.parse(input);

    // 2. Check authentication
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required",
        },
      };
    }

    // 3. Perform mutation
    const { data, error } = await supabase
      .from("shipments")
      .update({
        status: validated.status,
        current_location: validated.location,
        updated_at: new Date().toISOString(),
      })
      .eq("id", validated.shipmentId)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: error.message,
        },
      };
    }

    // 4. Revalidate cache
    revalidatePath("/dashboard");
    revalidatePath(`/tracking/${validated.shipmentId}`);

    // 5. Return success
    return {
      success: true,
      data,
    };
  } catch (error) {
    // 6. Handle validation errors
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: error.errors[0].message,
          field: error.errors[0].path.join("."),
        },
      };
    }

    // 7. Handle unexpected errors
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
      },
    };
  }
}
```

## Type Definitions

### Shared Types Location

```
types/tracking.ts
types/database.ts (Supabase generated)
```

### Shipment Type

```typescript
// types/tracking.ts
export interface Shipment {
  id: string;
  tracking_id: string;
  status: ShipmentStatus;
  origin: string;
  destination: string;
  current_location: string | null;
  estimated_delivery: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export type ShipmentStatus =
  | "pending"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed"
  | "cancelled";

export interface ShipmentUpdate {
  id: string;
  shipment_id: string;
  timestamp: string;
  location: string;
  status: ShipmentStatus;
  note: string | null;
  created_by: string | null;
}

export interface CreateShipmentInput {
  origin: string;
  destination: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  special_instructions?: string;
}
```

## Error Format Standards

### Standard Error Response

```typescript
interface ApiError {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    field?: string; // For validation errors
    details?: unknown; // Additional context (dev only)
  };
}

type ErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "DATABASE_ERROR"
  | "RATE_LIMIT_EXCEEDED"
  | "INTERNAL_ERROR";
```

### HTTP Status Mapping

```typescript
const errorStatusMap: Record<ErrorCode, number> = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 400,
  DATABASE_ERROR: 500,
  RATE_LIMIT_EXCEEDED: 429,
  INTERNAL_ERROR: 500,
};
```

### Error Response Helper

```typescript
// lib/api-response.ts
export function errorResponse(
  code: ErrorCode,
  message: string,
  field?: string,
): Response {
  const status = errorStatusMap[code] || 500;

  return Response.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(field && { field }),
        ...(process.env.NODE_ENV === "development" && {
          details: { timestamp: new Date().toISOString() },
        }),
      },
    },
    { status },
  );
}

export function successResponse<T>(data: T, status = 200): Response {
  return Response.json(
    {
      success: true,
      data,
    },
    { status },
  );
}
```

## Request Validation

### Zod Schema Pattern

```typescript
import { z } from "zod";

// Define schema
const TrackingQuerySchema = z.object({
  id: z.string().min(1, "Tracking ID is required"),
  includeHistory: z.boolean().optional().default(false),
});

// Validate in route handler
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsed = TrackingQuerySchema.safeParse({
    id: searchParams.get("id"),
    includeHistory: searchParams.get("includeHistory") === "true",
  });

  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", parsed.error.errors[0].message);
  }

  const { id, includeHistory } = parsed.data;
  // ...
}
```

### Form Data Validation

```typescript
"use server";

const FormSchema = z.object({
  email: z.string().email(),
  message: z.string().min(10).max(1000),
});

export async function submitContactForm(formData: FormData) {
  const parsed = FormSchema.safeParse({
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: parsed.error.errors[0].message,
        field: parsed.error.errors[0].path.join("."),
      },
    };
  }

  // Process form
}
```

## Response Type Inference

### Type-Safe API Calls

```typescript
// lib/api-client.ts
export async function trackShipment(
  trackingId: string,
): Promise<TrackingResponse> {
  const res = await fetch(`/api/track?id=${trackingId}`);

  if (!res.ok) {
    const error: ErrorResponse = await res.json();
    throw new Error(error.error.message);
  }

  return res.json();
}

// Usage in component
("use client");
import { useQuery } from "@tanstack/react-query";
import { trackShipment } from "@/lib/api-client";

export function Tracker({ id }: { id: string }) {
  const { data, error } = useQuery({
    queryKey: ["shipment", id],
    queryFn: () => trackShipment(id),
  });
  // data is properly typed as TrackingResponse
}
```

## Versioning Strategy

### Current: No Versioning

**Reason**: MVP stage, breaking changes acceptable

### Future: URL Path Versioning

```
/api/v1/track
/api/v2/track
```

**Rules**:

- Major version only (`v1`, `v2`)
- Maintain previous version for 6 months
- Deprecation warnings in headers

```typescript
headers: {
  'X-API-Deprecation': 'This version will be removed on 2026-06-01',
  'X-API-Version': 'v1',
}
```

## Rate Limiting (Future)

### Planned Implementation

```typescript
// middleware.ts
import { ratelimit } from "@/lib/rate-limit";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api")) {
    const ip = request.ip ?? "127.0.0.1";
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return new Response("Too Many Requests", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }
  }

  return NextResponse.next();
}
```

**Limits** (planned):

- Public endpoints: 100 requests/minute
- Authenticated: 1000 requests/minute
- Tracking endpoint: 10 requests/minute per IP

## Authentication in API Routes

### Pattern

```typescript
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return errorResponse("UNAUTHORIZED", "Authentication required");
  }

  // Proceed with authenticated request
  const data = await fetchUserData(user.id);
  return successResponse(data);
}
```

### Optional Authentication

```typescript
export async function GET(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Proceed differently based on auth status
  if (user) {
    return successResponse(await fetchPrivateData(user.id));
  } else {
    return successResponse(await fetchPublicData());
  }
}
```

## CORS Configuration

### Configured in `next.config.ts`

```typescript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Access-Control-Allow-Origin',
          value: process.env.NEXT_PUBLIC_SITE_URL || '*',
        },
        {
          key: 'Access-Control-Allow-Methods',
          value: 'GET, POST, PUT, DELETE, OPTIONS',
        },
        {
          key: 'Access-Control-Allow-Headers',
          value: 'Content-Type, Authorization',
        },
      ],
    },
  ]
}
```

### OPTIONS Handler (If Needed)

```typescript
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
```

## Webhooks (Future)

### Planned Webhook Endpoints

```
POST /api/webhooks/supabase - Database changes
POST /api/webhooks/payment - Payment events
```

### Webhook Signature Verification

```typescript
import { createHmac } from "crypto";

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  const hmac = createHmac("sha256", secret);
  hmac.update(payload);
  const digest = hmac.digest("hex");

  return signature === digest;
}

export async function POST(request: Request) {
  const signature = request.headers.get("x-webhook-signature");
  const payload = await request.text();

  if (
    !verifyWebhookSignature(payload, signature!, process.env.WEBHOOK_SECRET!)
  ) {
    return errorResponse("FORBIDDEN", "Invalid signature");
  }

  // Process webhook
}
```

## API Documentation

### Current: This Document

**Future**: OpenAPI/Swagger specification

### Planned OpenAPI Spec Location

```
docs/api/openapi.yaml
```

## Testing API Endpoints

### Test Endpoint

```
GET /api/test-sentry - Sentry error testing (dev only)
```

**Purpose**: Verify error monitoring integration

## Rules Summary

### Request/Response

✅ **Do**:

- Validate all inputs with Zod
- Return consistent error format
- Use TypeScript for type safety
- Include proper HTTP status codes
- Handle authentication/authorization

❌ **Don't**:

- Expose stack traces in production
- Return different error formats
- Skip input validation
- Use GET for mutations
- Leak sensitive data in errors

### Server Actions

✅ **Do**:

- Mark with `'use server'`
- Validate inputs
- Check authentication
- Revalidate cache after mutations
- Return structured results

❌ **Don't**:

- Expose in client bundles
- Skip error handling
- Forget to revalidate cache
- Return raw database errors
- Mix with client code
