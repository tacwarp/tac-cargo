# TAC CARGO PRODUCTION-READINESS REPORT - PART 3

## Production Hardening Checklist & Project Development Roadmap

---

## 4. PRODUCTION HARDENING CHECKLIST

### 4.1 Real-Time Infrastructure (CRITICAL PRIORITY)

**Status**: ❌ **NOT IMPLEMENTED**

**Requirement**: Logistics dashboards MUST feel alive. Status changes, SLA warnings, and exception alerts must appear in near real-time across all connected clients.

#### Implementation Strategy: Supabase Realtime

**Step 1: Enable Realtime on Tables**

```sql
-- Enable realtime for critical tables
ALTER PUBLICATION supabase_realtime ADD TABLE shipments;
ALTER PUBLICATION supabase_realtime ADD TABLE scan_events;
ALTER PUBLICATION supabase_realtime ADD TABLE manifests;
ALTER PUBLICATION supabase_realtime ADD TABLE exceptions;
```

**Step 2: Dashboard Real-Time Hook**

```typescript
// hooks/use-realtime-shipments.ts
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export function useRealtimeShipments(initialShipments: Shipment[]) {
  const [shipments, setShipments] = useState(initialShipments);
  const [isStale, setIsStale] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      channel = supabase
        .channel("shipments-changes")
        .on(
          "postgres_changes",
          {
            event: "*", // INSERT, UPDATE, DELETE
            schema: "public",
            table: "shipments",
          },
          (payload) => {
            setIsStale(false);

            if (payload.eventType === "INSERT") {
              setShipments((prev) => [payload.new as Shipment, ...prev]);
            } else if (payload.eventType === "UPDATE") {
              setShipments((prev) =>
                prev.map((s) =>
                  s.id === payload.new.id ? (payload.new as Shipment) : s,
                ),
              );
            } else if (payload.eventType === "DELETE") {
              setShipments((prev) =>
                prev.filter((s) => s.id !== payload.old.id),
              );
            }
          },
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            console.log("✅ Realtime connected");
          } else if (status === "CHANNEL_ERROR") {
            console.error("❌ Realtime error");
            setIsStale(true);
          }
        });
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return { shipments, isStale };
}
```

**Step 3: Dashboard Integration**

```typescript
// app/(dashboard)/dashboard/page.tsx
'use client'
import { useRealtimeShipments } from '@/hooks/use-realtime-shipments'

export default function DashboardPage({
  initialShipments
}: {
  initialShipments: Shipment[]
}) {
  const { shipments, isStale } = useRealtimeShipments(initialShipments)

  return (
    <div>
      {isStale && (
        <Alert variant="warning">
          <WifiOff className="w-4 h-4" />
          <AlertTitle>Connection Lost</AlertTitle>
          <AlertDescription>
            Data may be outdated. Attempting to reconnect...
          </AlertDescription>
        </Alert>
      )}

      <KPICards shipments={shipments} />
      <RecentShipmentsTable shipments={shipments.slice(0, 10)} />
    </div>
  )
}
```

**Step 4: Performance Considerations**

- **Limit subscription scope**: Only subscribe to relevant shipments (e.g., active shipments, not delivered)
- **Debounce rapid updates**: If 100 shipments update simultaneously, batch UI updates
- **Connection resilience**: Auto-reconnect on network failure
- **Subscription limits**: Supabase has channel limits per connection (default: 100)

---

### 4.2 Testing Framework Implementation (CRITICAL PRIORITY)

**Status**: ❌ **NO TESTS EXIST**

**Risk**: Zero confidence in production deployments. Manual testing does not scale.

#### Recommended Stack

```bash
# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
npm install -D @testing-library/user-event
npm install -D @vitejs/plugin-react
npm install -D playwright @playwright/test
```

**Test Configuration**:

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

```typescript
// test/setup.ts
import "@testing-library/jest-dom";
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});
```

#### Critical Test Coverage

**Unit Tests** (70% coverage target):

```typescript
// __tests__/lib/barcode/gs1-validator.test.ts
import { describe, it, expect } from "vitest";
import { validateGS1Barcode } from "@/lib/barcode/gs1-validator";

describe("GS1 Barcode Validation", () => {
  it("validates SSCC with correct check digit", () => {
    const result = validateGS1Barcode("106141411234567897");
    expect(result.isValid).toBe(true);
    expect(result.format).toBe("SSCC");
  });

  it("rejects SSCC with invalid check digit", () => {
    const result = validateGS1Barcode("106141411234567898");
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("check digit");
  });
});
```

**Component Tests** (50% coverage target):

```typescript
// __tests__/components/dashboard/status-badge.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from '@/components/dashboard/status-badge'

describe('StatusBadge', () => {
  it('renders pending status correctly', () => {
    render(<StatusBadge status="pending" />)
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('applies correct variant for at-risk SLA', () => {
    const { container } = render(
      <StatusBadge status="in_transit" slaStatus="at_risk" />
    )
    expect(container.firstChild).toHaveClass('bg-destructive')
  })
})
```

**Integration Tests** (30% coverage target):

```typescript
// __tests__/app/dashboard/scanning/page.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ScanningPage from '@/app/(dashboard)/dashboard/scanning/page'

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      insert: vi.fn().mockResolvedValue({ data: null, error: null })
    })
  })
}))

describe('Scanning Page', () => {
  it('validates barcode on scan button click', async () => {
    render(<ScanningPage />)

    const input = screen.getByPlaceholderText(/enter barcode/i)
    const scanButton = screen.getByRole('button', { name: /scan/i })

    fireEvent.change(input, { target: { value: '106141411234567897' } })
    fireEvent.click(scanButton)

    await waitFor(() => {
      expect(screen.getByText(/validated successfully/i)).toBeInTheDocument()
    })
  })

  it('shows error for invalid barcode', async () => {
    render(<ScanningPage />)

    const input = screen.getByPlaceholderText(/enter barcode/i)
    const scanButton = screen.getByRole('button', { name: /scan/i })

    fireEvent.change(input, { target: { value: 'INVALID' } })
    fireEvent.click(scanButton)

    await waitFor(() => {
      expect(screen.getByText(/invalid barcode/i)).toBeInTheDocument()
    })
  })
})
```

**E2E Tests** (Critical flows only):

```typescript
// e2e/scanning-workflow.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Scanning Workflow", () => {
  test("complete scan-to-manifest flow", async ({ page }) => {
    await page.goto("/login");

    // Login
    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input[type="password"]', "password");
    await page.click('button[type="submit"]');

    // Navigate to scanning
    await page.goto("/dashboard/scanning");

    // Scan valid SSCC
    await page.fill('input[placeholder*="barcode"]', "106141411234567897");
    await page.click('button:has-text("Scan")');

    // Verify success message
    await expect(page.locator("text=/validated successfully/i")).toBeVisible();

    // Verify scan event appears in list
    await expect(page.locator('text="106141411234567897"')).toBeVisible();
  });
});
```

#### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit

      - name: Run component tests
        run: npm run test:components

      - name: Run E2E tests
        run: npx playwright test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

      - name: Check coverage threshold
        run: npm run test:coverage-check # Fail if < 70%
```

---

### 4.3 Data-Fetching Abstraction Layer

**Current Issue**: No centralized data-fetching, no caching, no error handling

**Recommendation**: Implement TanStack Query (React Query)

```bash
npm install @tanstack/react-query
```

**Setup**:

```typescript
// app/layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      cacheTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: true,
    },
  },
})

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

**Query Hook Pattern**:

```typescript
// lib/queries/shipments.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useShipments(filters?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ["shipments", filters],
    queryFn: async () => {
      const supabase = createClient();
      let query = supabase
        .from("shipments")
        .select("*, customers(*)")
        .order("created_at", { ascending: false })
        .limit(50);

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      if (filters?.search) {
        query = query.ilike("reference", `%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data;
    },
  });
}

export function useCreateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shipment: NewShipment) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("shipments")
        .insert(shipment)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      // Invalidate shipments cache
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      toast.success("Shipment created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create shipment", {
        description: error.message,
      });
    },
  });
}
```

**Component Usage**:

```typescript
// app/(dashboard)/dashboard/shipments/page.tsx
'use client'
import { useShipments } from '@/lib/queries/shipments'

export default function ShipmentsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string | undefined>()

  const { data: shipments, isLoading, error } = useShipments({ search, status })

  if (isLoading) return <ShipmentsTableSkeleton />

  if (error) return <ErrorState error={error} />

  return (
    <div>
      <ShipmentsFilter onSearchChange={setSearch} onStatusChange={setStatus} />
      <ShipmentsTable shipments={shipments} />
    </div>
  )
}
```

**Benefits**:

- Automatic caching (no duplicate requests)
- Background refetching (data stays fresh)
- Loading/error states handled
- Optimistic updates for mutations
- DevTools for debugging

---

### 4.4 Form Validation Framework

**Recommendation**: Zod + React Hook Form

```bash
npm install zod react-hook-form @hookform/resolvers
```

**Schema Definition**:

```typescript
// lib/schemas/shipment.ts
import { z } from "zod";

export const shipmentSchema = z.object({
  customer_id: z.string().uuid("Invalid customer"),
  reference: z
    .string()
    .min(5, "Reference must be at least 5 characters")
    .regex(/^SHP-[A-Z0-9]+$/, "Must start with SHP-"),
  origin_warehouse_id: z.string().uuid("Select origin warehouse"),
  destination_warehouse_id: z.string().uuid("Select destination warehouse"),
  transport_mode: z.enum(["air", "surface", "express", "economy"]),
  service_level_id: z.string().uuid("Select service level"),
  weight_kg: z.number().positive().max(30000, "Max weight: 30 tons"),
  pieces: z.number().int().positive().max(10000),
  consignee_name: z.string().min(2, "Required"),
  consignee_phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone"),
  consignee_address: z.string().min(10, "Address too short"),
  consignee_pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
  declared_value: z.number().positive().optional(),
  notes: z.string().max(500).optional(),
});

export type ShipmentFormData = z.infer<typeof shipmentSchema>;
```

**Form Component**:

```typescript
// components/forms/create-shipment-form.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { shipmentSchema, type ShipmentFormData } from '@/lib/schemas/shipment'

export function CreateShipmentForm() {
  const form = useForm<ShipmentFormData>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      transport_mode: 'surface',
      pieces: 1,
    },
  })

  const createShipment = useCreateShipment()

  const onSubmit = (data: ShipmentFormData) => {
    createShipment.mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="reference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shipment Reference</FormLabel>
              <FormControl>
                <Input placeholder="SHP-2026-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="weight_kg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight (kg)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.1"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Maximum 30,000 kg (30 tons)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ... other fields */}

        <Button type="submit" disabled={createShipment.isPending}>
          {createShipment.isPending ? 'Creating...' : 'Create Shipment'}
        </Button>
      </form>
    </Form>
  )
}
```

---

### 4.5 PDF Generation Strategy

**Requirement**: Invoice PDFs, Manifest PDFs, Shipping Labels

**Recommended Library**: React-PDF (for React-based layouts) or Puppeteer (for HTML→PDF)

**Option 1: React-PDF** (preferred for structured documents)

```bash
npm install @react-pdf/renderer
```

```typescript
// lib/pdf/invoice-pdf.tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 30 },
  header: { fontSize: 24, marginBottom: 20 },
  table: { display: 'table', width: 'auto', marginTop: 20 },
  tableRow: { flexDirection: 'row' },
  tableCell: { padding: 5, fontSize: 10 },
})

export function InvoicePDF({ invoice }: { invoice: Invoice }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>INVOICE</Text>
          <Text style={{ fontSize: 14 }}>{invoice.invoice_number}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Item</Text>
            <Text style={styles.tableCell}>Quantity</Text>
            <Text style={styles.tableCell}>Amount</Text>
          </View>
          {invoice.items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.description}</Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCell}>₹{item.line_total}</Text>
            </View>
          ))}
        </View>

        <Text style={{ marginTop: 20, fontSize: 12 }}>
          Total: ₹{invoice.total_amount}
        </Text>
      </Page>
    </Document>
  )
}
```

**Generate & Upload**:

```typescript
// lib/pdf/generate-invoice.ts
import { pdf } from '@react-pdf/renderer'
import { InvoicePDF } from './invoice-pdf'
import { createClient } from '@/lib/supabase/client'

export async function generateAndUploadInvoice(invoice: Invoice) {
  // Render PDF to blob
  const blob = await pdf(<InvoicePDF invoice={invoice} />).toBlob()

  // Upload to Supabase Storage
  const supabase = createClient()
  const fileName = `invoices/${invoice.invoice_number}.pdf`

  const { data, error } = await supabase.storage
    .from('documents')
    .upload(fileName, blob, {
      contentType: 'application/pdf',
      upsert: true,
    })

  if (error) throw error

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(fileName)

  // Update invoice record with PDF URL
  await supabase
    .from('invoices')
    .update({ pdf_url: publicUrl })
    .eq('id', invoice.id)

  return publicUrl
}
```

---

## 5. PROJECT DEVELOPMENT ROADMAP (PDR)

### Overview: Phased Implementation

**Phase 1: Foundation** (Weeks 1-6)  
**Phase 2: Core Operations** (Weeks 7-12)  
**Phase 3: Finance & Compliance** (Weeks 13-16)  
**Phase 4: Advanced Features** (Weeks 17-20)  
**Phase 5: Production Hardening** (Weeks 21-24)

---

### PHASE 1: FOUNDATION & INFRASTRUCTURE (Weeks 1-6)

#### Week 1-2: Critical Infrastructure

**Real-Time Subscriptions**

- Enable Supabase Realtime on core tables
- Implement `useRealtimeShipments` hook
- Add connection status indicator to dashboard
- Test with 100+ concurrent connections

**Testing Framework**

- Install Vitest, Testing Library, Playwright
- Configure test environments
- Write first 20 unit tests (barcode validation, utilities)
- Set up GitHub Actions CI/CD

**Data-Fetching Layer**

- Install TanStack Query
- Migrate dashboard to use `useShipments` query
- Implement query devtools
- Add loading/error states

**Deliverables**:

- ✅ Real-time dashboard updates
- ✅ 30% test coverage (baseline)
- ✅ Centralized data-fetching

---

#### Week 3-4: GS1 Barcode Compliance

**Validation Library**

- Implement `validateGS1Barcode` function
- Support SSCC, GTIN-8/12/13/14, GS1-128
- Add check digit validation (Luhn algorithm)
- Parse Application Identifiers

**Scanning Page Enhancement**

- Integrate GS1 validator into scanning workflow
- Add toast notifications for scan results
- Display parsed barcode data (SSCC, batch, expiry)
- Add scan history table with real-time updates

**Testing**

- 100% coverage for barcode validation
- E2E test for scanning workflow
- Performance test with 1000 rapid scans

**Deliverables**:

- ✅ GS1-compliant scanning
- ✅ Customs/carrier-ready validation

---

#### Week 5-6: Schema Enhancement & Traceability

**Database Migration**

- Create `manifests` table
- Create `manifest_items` junction table
- Create `invoices` and `invoice_items` tables
- Create `service_levels` table
- Add foreign keys to `shipments`
- Create indexes for performance

**Type Definitions**

- Regenerate Supabase types
- Add TypeScript interfaces for new tables
- Update existing queries to include relations

**Traceability Queries**

- Implement `getShipmentAuditTrail`
- Implement `reconcileManifest`
- Implement `getInvoiceShipmentStatus`

**Deliverables**:

- ✅ Complete audit trail capability
- ✅ Invoice↔Manifest↔Shipment linking

---

### PHASE 2: CORE OPERATIONS (Weeks 7-12)

#### Dashboard & Analytics (Weeks 7-8)

**Key Metrics**

- Total shipments (active, delivered, delayed)
- Revenue (daily, weekly, monthly trends)
- At-risk SLA count (auto-updating)
- Exception alerts (unresolved, critical)
- Top customers by volume/revenue

**Charts**

- Status distribution pie chart
- Revenue trend line (Recharts)
- SLA compliance rate gauge
- Warehouse utilization bar chart

**Real-Time Features**

- Live shipment count updates
- Flashing indicator for new exceptions
- Auto-refresh KPIs every 30 seconds

**Deliverables**:

- ✅ Operational command center
- ✅ Real-time business metrics

---

#### Shipments Management (Weeks 9-10)

**List View**

- Search by reference, customer, destination
- Filter by status, transport mode, date range
- Sort by created_at, eta, sla_target
- Pagination (50 per page)
- SLA status badges with countdown

**Detail View**

- Shipment overview (customer, weight, value)
- Timeline component (scan history)
- Linked manifest information
- Invoice reference (if exists)
- Exception history
- Document attachments

**Form Validation**

- Create shipment form (Zod + React Hook Form)
- Update shipment form
- Consignee validation (phone, pincode, address)
- Weight/pieces validation

**Bulk Operations**

- Select multiple shipments
- Bulk print labels
- Bulk status update
- Bulk manifest assignment

**Deliverables**:

- ✅ Complete shipment CRUD
- ✅ Mobile-optimized views

---

#### Tracking System (Week 11)

**Public Tracking API**

- `/api/track?reference=SHP-XXX` endpoint
- Rate limiting (10 requests/min per IP)
- Public-facing tracking page (no auth required)
- QR code generation for labels

**Internal Tracking Dashboard**

- Real-time shipment map (if geolocation added)
- Last-known location display
- ETA countdown
- Delivery proof upload

**Deliverables**:

- ✅ Customer self-service tracking
- ✅ Internal operations visibility

---

#### Manifest Management (Week 12)

**Manifest Creation**

- Select origin/destination warehouses
- Add shipments to manifest (barcode scan)
- Auto-calculate total pieces/weight
- Seal number generation
- Driver assignment

**Manifest Workflow**

- Draft → Sealed → In Transit → Arrived → Reconciled
- Scan verification at origin/destination
- Discrepancy reporting (weight mismatch, damage)
- Photo upload for exceptions

**Manifest Reconciliation**

- Compare declared vs actual scans
- Flag missing shipments
- Flag excess scans (not on manifest)
- Generate reconciliation report PDF

**Deliverables**:

- ✅ End-to-end manifest lifecycle
- ✅ Audit-ready reconciliation
