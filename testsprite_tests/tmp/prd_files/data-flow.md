# State Management & Data Flow

## Architecture Overview

### Three-Tier Data Strategy

1. **Server-First**: React Server Components with direct data access
2. **Client Sync**: TanStack Query for client-server synchronization
3. **Local State**: Zustand/Context for client-only ephemeral state

## Server-Side Data Fetching

### React Server Components (Preferred)

**Default pattern for all non-interactive pages**

```tsx
// app/(dashboard)/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();

  // Direct database access - no caching layer needed
  const { data: stats } = await supabase
    .from("shipment_stats")
    .select("*")
    .single();

  if (!stats) {
    notFound(); // Trigger 404
  }

  return <StatsOverview data={stats} />;
}
```

**Capabilities**:

- Direct Supabase client access
- Async/await syntax
- Automatic request deduplication
- Parallel data fetching
- Error boundaries for failures

**Constraints**:

- Cannot use React hooks
- Cannot access browser APIs
- No event handlers
- Runs only on server

### Server Actions (Mutations)

**Pattern for form submissions and data mutations**

```tsx
// app/actions/shipment.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateShipmentStatus(shipmentId: string, status: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("shipments")
    .update({ status })
    .eq("id", shipmentId);

  if (error) {
    return { error: error.message };
  }

  // Revalidate cached data
  revalidatePath("/dashboard");
  return { success: true };
}
```

**Usage in Client Components**:

```tsx
"use client";
import { updateShipmentStatus } from "@/app/actions/shipment";

export function StatusButton({ shipmentId }: { shipmentId: string }) {
  async function handleUpdate() {
    const result = await updateShipmentStatus(shipmentId, "delivered");
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Status updated");
    }
  }

  return <button onClick={handleUpdate}>Mark Delivered</button>;
}
```

## Client-Side Data Fetching

### TanStack Query (React Query)

**For client-side server state synchronization**

**Setup** (`app/layout.tsx` or provider):

```tsx
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

**Usage Pattern**:

```tsx
"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function ShipmentTracker({ trackingId }: { trackingId: string }) {
  const queryClient = useQueryClient();

  // Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["shipment", trackingId],
    queryFn: async () => {
      const res = await fetch(`/api/track?id=${trackingId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    refetchInterval: 30000, // Poll every 30s
  });

  // Mutation
  const updateMutation = useMutation({
    mutationFn: async (status: string) => {
      const res = await fetch(`/api/shipments/${trackingId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      return res.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["shipment", trackingId] });
    },
  });

  if (isLoading) return <Skeleton />;
  if (error) return <Error />;

  return (
    <div>
      <p>Status: {data.status}</p>
      <button onClick={() => updateMutation.mutate("in_transit")}>
        Update
      </button>
    </div>
  );
}
```

### When to Use TanStack Query

✅ **Use for**:

- Real-time tracking updates
- Polling/refetching data
- Optimistic updates
- Client-side filtering/sorting
- Infinite scroll pagination

❌ **Don't use for**:

- Initial page data (use RSC)
- Static content
- Auth state (use Context)
- UI-only state (use useState)

## Caching Strategy

### Server-Side Caching (Next.js)

#### Automatic Request Deduplication

**Next.js automatically deduplicates identical fetch requests within a render pass**

```tsx
// These two fetches will only make ONE request
async function ComponentA() {
  const data = await fetch("https://api.example.com/data");
  // ...
}

async function ComponentB() {
  const data = await fetch("https://api.example.com/data");
  // ...
}
```

#### Route Segment Caching

```tsx
// app/(dashboard)/dashboard/page.tsx
export const revalidate = 60; // Revalidate every 60 seconds (ISR)
export const dynamic = "force-dynamic"; // Opt out of caching (SSR)
```

**Options**:

- `revalidate: number` - Time-based revalidation (ISR)
- `revalidate: false` - Cache indefinitely (SSG)
- `dynamic: 'force-dynamic'` - Always SSR
- `dynamic: 'force-static'` - Always SSG

#### On-Demand Revalidation

```tsx
"use server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function updateData() {
  // Revalidate specific path
  revalidatePath("/dashboard");

  // Revalidate by cache tag
  revalidateTag("shipments");
}
```

**Tagged Caching**:

```tsx
// Fetch with tags
const data = await fetch("https://api.example.com/shipments", {
  next: { tags: ["shipments"] },
});

// Revalidate all requests with tag
revalidateTag("shipments");
```

### Client-Side Caching (TanStack Query)

#### Cache Time Configuration

```tsx
const { data } = useQuery({
  queryKey: ["shipments"],
  queryFn: fetchShipments,
  staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
  gcTime: 10 * 60 * 1000, // 10 minutes - cache garbage collection
});
```

**Lifecycle**:

1. Fresh (0 - `staleTime`)
2. Stale (after `staleTime`)
3. Garbage collected (after `gcTime`)

#### Cache Invalidation

```tsx
const queryClient = useQueryClient();

// Invalidate specific query
queryClient.invalidateQueries({ queryKey: ["shipments"] });

// Invalidate all queries matching pattern
queryClient.invalidateQueries({ queryKey: ["shipments"], exact: false });

// Remove query from cache
queryClient.removeQueries({ queryKey: ["shipment", id] });

// Set query data manually
queryClient.setQueryData(["shipment", id], newData);
```

## Mutation Handling

### Server Actions (Preferred)

```tsx
"use server";

export async function createShipment(formData: FormData) {
  // Validate input
  const schema = z.object({
    origin: z.string().min(1),
    destination: z.string().min(1),
  });

  const validated = schema.parse({
    origin: formData.get("origin"),
    destination: formData.get("destination"),
  });

  // Perform mutation
  const supabase = createClient();
  const { data, error } = await supabase
    .from("shipments")
    .insert(validated)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Revalidate cache
  revalidatePath("/dashboard");

  return { success: true, data };
}
```

**Form Integration**:

```tsx
"use client";
import { useFormStatus } from "react-dom";
import { createShipment } from "@/app/actions/shipment";

export function ShipmentForm() {
  async function handleSubmit(formData: FormData) {
    const result = await createShipment(formData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Shipment created");
    }
  }

  return (
    <form action={handleSubmit}>
      <input name="origin" required />
      <input name="destination" required />
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending}>
      {pending ? "Creating..." : "Create Shipment"}
    </button>
  );
}
```

### TanStack Query Mutations (Client-Side)

```tsx
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function UpdateButton({ shipmentId }: { shipmentId: string }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (status: string) => {
      const res = await fetch(`/api/shipments/${shipmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onMutate: async (newStatus) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["shipment", shipmentId] });

      // Snapshot previous value
      const previous = queryClient.getQueryData(["shipment", shipmentId]);

      // Optimistically update
      queryClient.setQueryData(["shipment", shipmentId], (old: any) => ({
        ...old,
        status: newStatus,
      }));

      return { previous };
    },
    onError: (err, newStatus, context) => {
      // Rollback on error
      queryClient.setQueryData(["shipment", shipmentId], context?.previous);
      toast.error("Update failed");
    },
    onSuccess: () => {
      toast.success("Updated successfully");
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ["shipment", shipmentId] });
    },
  });

  return (
    <button
      onClick={() => mutation.mutate("delivered")}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? "Updating..." : "Mark Delivered"}
    </button>
  );
}
```

## Error Handling

### Server Component Errors

```tsx
// Throws error - caught by error boundary
export default async function Page() {
  const data = await fetchData();
  if (!data) {
    throw new Error("Data not found");
  }
  return <Component data={data} />;
}

// Returns error state - handled in component
export default async function Page() {
  const { data, error } = await fetchData();
  if (error) {
    return <ErrorState message={error.message} />;
  }
  return <Component data={data} />;
}
```

### Server Action Errors

```tsx
"use server";

export async function updateData(id: string) {
  try {
    const result = await performUpdate(id);
    return { success: true, data: result };
  } catch (error) {
    console.error("Update failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
```

### TanStack Query Errors

```tsx
const { data, error, isError } = useQuery({
  queryKey: ["data"],
  queryFn: fetchData,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

if (isError) {
  return <ErrorState error={error} />;
}
```

### Global Error Handling

```tsx
// app/global-error.tsx
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to Sentry
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
```

## Optimistic Updates

### Pattern

```tsx
const mutation = useMutation({
  mutationFn: updateShipment,
  onMutate: async (newData) => {
    // 1. Cancel outgoing queries
    await queryClient.cancelQueries({ queryKey: ["shipments"] });

    // 2. Snapshot current state
    const previous = queryClient.getQueryData(["shipments"]);

    // 3. Optimistically update
    queryClient.setQueryData(["shipments"], (old: Shipment[]) => {
      return old.map((ship) =>
        ship.id === newData.id ? { ...ship, ...newData } : ship,
      );
    });

    // 4. Return rollback context
    return { previous };
  },
  onError: (err, variables, context) => {
    // 5. Rollback on failure
    if (context?.previous) {
      queryClient.setQueryData(["shipments"], context.previous);
    }
  },
  onSettled: () => {
    // 6. Refetch to ensure sync
    queryClient.invalidateQueries({ queryKey: ["shipments"] });
  },
});
```

## Real-Time Updates (Supabase Realtime)

### Setup

```tsx
"use client";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";

export function LiveShipmentTracker({ shipmentId }: { shipmentId: string }) {
  const [status, setStatus] = useState<string>();
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("shipment-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "shipments",
          filter: `id=eq.${shipmentId}`,
        },
        (payload) => {
          setStatus(payload.new.status);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [shipmentId, supabase]);

  return <div>Status: {status}</div>;
}
```

### Integration with TanStack Query

```tsx
useEffect(() => {
  const channel = supabase
    .channel("shipments")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "shipments" },
      () => {
        // Invalidate queries on real-time update
        queryClient.invalidateQueries({ queryKey: ["shipments"] });
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [queryClient, supabase]);
```

## Side Effect Rules

### Server Components

❌ **Cannot use**:

- `useEffect`
- `useState`
- Browser APIs
- Event handlers

✅ **Can use**:

- `async/await`
- Direct data fetching
- Server-only code

### Client Components

✅ **Can use all React hooks**

**Effect cleanup pattern**:

```tsx
"use client";
useEffect(() => {
  const controller = new AbortController();

  fetch("/api/data", { signal: controller.signal })
    .then(handleData)
    .catch((error) => {
      if (error.name !== "AbortError") {
        console.error(error);
      }
    });

  return () => {
    controller.abort(); // Cleanup on unmount
  };
}, []);
```

## Data Flow Patterns Summary

### Initial Page Load

```
User Request
  → Middleware (auth check)
  → Server Component (fetch data)
  → Render HTML with data
  → Hydrate Client Components
  → Client queries (if needed)
```

### Form Submission

```
User Input
  → Client validation
  → Server Action
  → Database mutation
  → Revalidate cache
  → Return result
  → Update UI
```

### Client Interaction

```
User Action
  → Client Component event
  → TanStack Query mutation
  → Optimistic update
  → API call
  → Success/Error handling
  → Cache invalidation
  → Refetch data
```

### Real-Time Update

```
Database Change
  → Supabase Realtime
  → WebSocket event
  → Client receives update
  → Invalidate TanStack Query cache
  → Automatic refetch
  → UI update
```

## Rules Summary

### ✅ Do

- Default to Server Components
- Use Server Actions for mutations
- Implement optimistic updates for mutations
- Handle loading and error states
- Invalidate cache after mutations
- Use TypeScript for type safety
- Implement proper error boundaries

### ❌ Don't

- Fetch data in Client Components (unless interactive)
- Mix server/client data fetching logic
- Forget to handle loading states
- Ignore error handling
- Over-invalidate cache (performance)
- Use client state for server data
- Expose API keys in client code
