# Authentication & Authorization

## Authentication Provider

### Supabase Auth

**Version**: `@supabase/supabase-js` v2.89.0  
**Session Management**: Server-side cookies via `@supabase/ssr` v0.8.0

## Architecture

### Client Types

#### Browser Client (`lib/supabase/client.ts`)

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

**Usage**: Client Components only
**Capabilities**: Read user session, sign in, sign up, sign out

#### Server Client (`lib/supabase/server.ts`)

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    },
  );
}
```

**Usage**: Server Components, Server Actions, Route Handlers
**Capabilities**: Full auth operations with cookie management

#### Middleware Client (`lib/supabase/middleware.ts`)

```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export function createClient(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  return { supabase, response };
}
```

**Usage**: Middleware for route protection
**Capabilities**: Session validation and refresh

## Session Strategy

### Cookie-Based Sessions

**Cookie Names**:

- `sb-<project-ref>-auth-token` - Access token
- `sb-<project-ref>-auth-token.0`, `.1`, etc. - Chunked tokens (if large)

**Cookie Options**:

```typescript
{
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
}
```

### Session Lifecycle

1. **Sign In**: Creates session, sets cookies
2. **Token Refresh**: Automatic via middleware (when near expiry)
3. **Sign Out**: Clears session, removes cookies
4. **Expiry**: 7 days (refresh token), 1 hour (access token)

## Authentication Flow

### Sign In Flow

```
1. User visits /login
2. Enters credentials
3. POST to Supabase Auth
4. Supabase returns session
5. Set auth cookies
6. Redirect to /dashboard
```

### OAuth Flow (Future)

```
1. User clicks "Sign in with Google"
2. Redirect to Supabase OAuth URL
3. User authorizes at provider
4. Provider redirects to /auth/callback
5. Exchange code for session
6. Set auth cookies
7. Redirect to /dashboard
```

### Sign Out Flow

```
1. User clicks sign out
2. Call supabase.auth.signOut()
3. Clear auth cookies
4. Redirect to /
```

## Login Page Implementation

### Current Pattern

```tsx
// app/login/page.tsx
"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    if (error) {
      console.error("Sign in error:", error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh(); // Refresh server components
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Sign In</button>
    </form>
  );
}
```

## OAuth Callback Handler

### Implementation

```tsx
// app/auth/callback/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createClient();

    // Exchange code for session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to dashboard or origin
  const origin = requestUrl.origin;
  return NextResponse.redirect(`${origin}/dashboard`);
}
```

## Route Protection

### Middleware Implementation

```typescript
// middleware.ts
import { createClient } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Already authenticated, redirect from login
  if (request.nextUrl.pathname === "/login" && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

### Manual Route Protection (Server Components)

```tsx
// app/(dashboard)/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <Dashboard user={user} />;
}
```

## Role & Permission Model

### Current: Basic User Model

```typescript
interface User {
  id: string;
  email: string;
  role?: "admin" | "manager" | "driver" | "client";
  created_at: string;
  updated_at: string;
}
```

### Supabase User Metadata

```typescript
// Set on sign up
const { data, error } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "password",
  options: {
    data: {
      role: "client",
      company_name: "Example Corp",
    },
  },
});

// Access in user object
const user = await supabase.auth.getUser();
const role = user.data.user?.user_metadata?.role;
```

### Database-Level Permissions (RLS)

```sql
-- Row-Level Security policy
CREATE POLICY "Users can view own shipments"
ON shipments
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all shipments"
ON shipments
FOR SELECT
USING (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
);
```

### Application-Level Authorization

```typescript
// lib/auth-helpers.ts
export async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  return user;
}

// Usage in Server Action
("use server");
export async function deleteShipment(id: string) {
  await requireAdmin();

  // Proceed with admin action
}
```

## User Profile Management

### Fetch User Profile

```typescript
// Server Component
export async function UserProfile() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div>
      <p>Email: {user.email}</p>
      <p>Role: {user.user_metadata?.role}</p>
    </div>
  )
}
```

### Update User Metadata

```typescript
'use client'
import { createClient } from '@/lib/supabase/client'

export function UpdateProfileForm() {
  const supabase = createClient()

  async function handleUpdate(formData: FormData) {
    const { error } = await supabase.auth.updateUser({
      data: {
        company_name: formData.get('company_name'),
      },
    })

    if (error) {
      console.error('Update error:', error)
    }
  }

  return <form action={handleUpdate}>{/* fields */}</form>
}
```

## Password Management

### Change Password

```typescript
'use client'
export function ChangePasswordForm() {
  const supabase = createClient()

  async function handleChange(formData: FormData) {
    const { error } = await supabase.auth.updateUser({
      password: formData.get('newPassword') as string,
    })

    if (error) {
      console.error('Password change error:', error)
    }
  }

  return <form action={handleChange}>{/* fields */}</form>
}
```

### Password Reset Flow

```typescript
// 1. Request reset email
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/auth/reset-password`,
});

// 2. Handle reset in callback route
// app/auth/reset-password/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  // Redirect to reset form with token
  return NextResponse.redirect(`/reset-password?token=${token}`);
}

// 3. Submit new password
const { error } = await supabase.auth.updateUser({
  password: newPassword,
});
```

## Session Management Utilities

### Check Authentication Status

```typescript
// Server Component
export async function getUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Client Component
("use client");
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function useUser() {
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return user;
}
```

### Sign Out

```typescript
// Client Component
'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return <button onClick={handleSignOut}>Sign Out</button>
}
```

## Security Best Practices

### Environment Variables

```env
# Public (exposed to browser)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# Private (server-only)
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

**Rules**:

- Never expose service role key to client
- Anon key is safe to expose (RLS enforced)
- Use service role key only for admin operations

### Row-Level Security (RLS)

**MANDATORY**: All tables must have RLS policies

```sql
-- Enable RLS
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY "Users view own shipments"
ON shipments
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can update their own data
CREATE POLICY "Users update own shipments"
ON shipments
FOR UPDATE
USING (auth.uid() = user_id);
```

### PKCE Flow

**Enabled by default** in `@supabase/ssr`

**Benefits**:

- No client secret required
- Secure for public clients
- Resistant to authorization code interception

### Session Refresh

**Automatic** via middleware

**Manual refresh** (if needed):

```typescript
const { data, error } = await supabase.auth.refreshSession();
```

## Error Handling

### Authentication Errors

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

if (error) {
  switch (error.message) {
    case "Invalid login credentials":
      // Show "Incorrect email or password"
      break;
    case "Email not confirmed":
      // Show "Please confirm your email"
      break;
    default:
      // Show generic error
      break;
  }
}
```

### Session Errors

```typescript
const {
  data: { user },
  error,
} = await supabase.auth.getUser();

if (error) {
  // Session invalid or expired
  redirect("/login");
}

if (!user) {
  // No active session
  redirect("/login");
}
```

## Testing Authentication

### Test Accounts (Development)

```typescript
// Create test user
const { data, error } = await supabase.auth.signUp({
  email: "test@example.com",
  password: "test-password",
  options: {
    data: {
      role: "client",
    },
  },
});
```

### Bypass Auth (Development Only)

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  if (
    process.env.NODE_ENV === "development" &&
    process.env.BYPASS_AUTH === "true"
  ) {
    return NextResponse.next();
  }

  // Normal auth flow
}
```

## Future Enhancements

### Phase 2

- OAuth providers (Google, GitHub)
- Magic link authentication
- Multi-factor authentication (MFA)
- Session device management

### Phase 3

- Role-based UI rendering
- Permission-based feature flags
- Audit logging for auth events
- Advanced RLS policies

## Rules Summary

### ✅ Do

- Use appropriate client for context (browser/server/middleware)
- Validate session on protected routes
- Implement RLS policies on all tables
- Store session in HttpOnly cookies
- Refresh tokens automatically
- Handle auth errors gracefully
- Use server-side validation for mutations

### ❌ Don't

- Expose service role key to client
- Skip RLS policies
- Store tokens in localStorage
- Trust client-side auth checks alone
- Forget to refresh tokens
- Use client auth for sensitive operations
- Bypass middleware for protected routes
