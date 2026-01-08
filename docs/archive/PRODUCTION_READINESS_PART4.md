# TAC CARGO PRODUCTION-READINESS REPORT - PART 4

## Project Development Roadmap (Continued) & Technology Recommendations

---

## 5. PROJECT DEVELOPMENT ROADMAP (CONTINUED)

### PHASE 3: FINANCE & COMPLIANCE (Weeks 13-16)

#### Invoicing System (Weeks 13-14)

**Invoice Creation**

- Customer selection dropdown
- Automatic reference number generation (INV-YYYYMMDD-###)
- Add shipments to invoice (search by reference)
- Line item pricing (unit price × quantity)
- GST calculation (18% default, configurable per item)
- Payment terms selection (Net 30, Net 60, Due on Receipt)
- Notes field for special instructions

**Invoice PDF Generation**

- Header: Company logo, invoice number, date
- Customer details block
- Itemized table (description, quantity, unit price, GST, line total)
- Subtotal, GST amount, grand total
- Payment instructions
- Footer: Terms & conditions
- Generate & upload to Supabase Storage
- Store PDF URL in database

**Invoice Management**

- List view with filters (status, customer, date range)
- Status workflow: Draft → Sent → Paid → Overdue
- Email invoice to customer (trigger via button)
- Record payment (payment date, amount, method)
- Overdue highlighting (due_date < today && status != 'paid')

**Deliverables**:

- ✅ Complete invoicing workflow
- ✅ Automated PDF generation
- ✅ Payment tracking

---

#### Payment Processing (Week 15)

**Payment Records**

- Link payment to invoice
- Multiple payment modes (bank transfer, cash, cheque, UPI)
- Partial payment support
- Payment reconciliation (match bank statement to invoices)
- Receipt generation (PDF)

**Payment Dashboard**

- Outstanding amount by customer
- Overdue invoices table
- Payment history timeline
- Aging report (0-30 days, 31-60 days, 60+ days)

**Deliverables**:

- ✅ Payment tracking system
- ✅ Receivables visibility

---

#### Customer Management (Week 16)

**Customer CRUD**

- Create/edit customer profile
- Company name, GST number, contact person
- Billing address, shipping addresses (multiple)
- Credit limit enforcement
- Customer tier (platinum, gold, silver)

**Customer Portal (Optional)**

- Self-service tracking
- Invoice download
- Payment history
- Shipment history

**Deliverables**:

- ✅ Customer relationship management
- ✅ Credit management

---

### PHASE 4: ADVANCED FEATURES (Weeks 17-20)

#### Exception Management System (Week 17)

**Exception Types**

- Weight discrepancy (declared vs actual)
- Barcode mismatch (scan error)
- Damage (photo required)
- Delay (missed SLA)
- Customs hold
- Vehicle breakdown
- Weather delay

**Exception Workflow**

- Auto-create exception on discrepancy detection
- Severity levels: Low, Medium, High, Critical
- Assignment to operations team
- Status: Open → In Progress → Resolved → Closed
- Escalation rules (30 min unresolved → notify manager)
- Resolution notes and actions taken

**Exception Dashboard**

- Heatmap by exception type
- Open exceptions count (real-time)
- Average resolution time by type
- Top 10 recurring exceptions

**Deliverables**:

- ✅ Proactive issue detection
- ✅ SLA compliance improvement

---

#### Inventory Management (Week 18)

**Warehouse Inventory**

- Real-time piece count by warehouse
- Weight capacity utilization
- Aging analysis (shipments > 7 days in warehouse)
- Misrouted shipments detection
- Return inventory tracking

**Stock Transfer**

- Inter-warehouse transfers
- Transfer manifest (similar to regular manifest)
- Reconciliation at receiving warehouse

**Deliverables**:

- ✅ Warehouse visibility
- ✅ Capacity planning data

---

#### Analytics & Reporting (Week 19)

**Operational Reports**

- Daily shipment summary (created, delivered, in-transit)
- SLA performance report (on-time %, breached %, at-risk %)
- Manifest efficiency report (average load time, reconciliation time)
- Exception trend analysis
- Hub performance scorecard

**Financial Reports**

- Revenue by customer, service level, transport mode
- Invoice aging report
- Payment collection rate
- Outstanding receivables summary

**Export Options**

- CSV export for all reports
- PDF export for executive summaries
- Email scheduled reports (daily/weekly/monthly)

**Deliverables**:

- ✅ Data-driven decision making
- ✅ Executive visibility

---

#### Settings & Configuration (Week 20)

**System Settings**

- Company profile (name, logo, GST number, address)
- Email templates (invoice, tracking notification)
- Notification preferences (SMS, email, push)
- User roles & permissions (admin, operations, finance, customer service)

**Service Level Configuration**

- Define service codes (AIR_EXPRESS, SURFACE_STANDARD)
- Set delivery hour targets
- Configure price multipliers
- Enable/disable service levels

**Warehouse Configuration**

- Add/edit warehouses
- Set capacity limits
- Configure operating hours
- Set cutoff times

**Deliverables**:

- ✅ System customization
- ✅ Multi-user access control

---

### PHASE 5: PRODUCTION HARDENING (Weeks 21-24)

#### Performance Optimization (Week 21)

**Database Optimization**

- Review slow queries (pg_stat_statements)
- Add missing indexes
- Optimize N+1 queries (use select with joins)
- Implement database views for complex aggregations

**Frontend Optimization**

- Bundle size analysis (webpack-bundle-analyzer)
- Code splitting (dynamic imports for heavy pages)
- Image optimization (next/image lazy loading)
- Table virtualization (@tanstack/react-virtual for 1000+ rows)
- Debounce search inputs (300ms delay)

**Lighthouse Audits**

- Target: Performance 90+, Accessibility 100, Best Practices 100, SEO 90+
- Fix identified issues
- Set up Lighthouse CI in GitHub Actions

**Deliverables**:

- ✅ Sub-2s page load times
- ✅ Smooth scrolling with large datasets

---

#### Security Hardening (Week 22)

**Penetration Testing**

- SQL injection attempts (should be blocked by Supabase)
- XSS vulnerability scan
- CSRF protection validation
- Authentication bypass attempts
- Rate limiting validation

**Security Enhancements**

- Implement Content-Security-Policy header
- Add rate limiting to public endpoints (@upstash/ratelimit)
- Implement audit logging for all mutations
- Add PII masking in list views
- Set up Supabase Row Level Security (RLS) policies

**Compliance**

- GDPR compliance review (data export, right to forget)
- GS1 standard validation audit
- WCO manifest format compliance check
- GST invoice compliance (if India-focused)

**Deliverables**:

- ✅ Security audit passed
- ✅ Compliance certification ready

---

#### Testing & QA (Week 23)

**Test Coverage Goals**

- Unit tests: 70% coverage
- Component tests: 50% coverage
- Integration tests: 30% coverage
- E2E tests: 10 critical flows

**Critical E2E Flows**

1. Complete scanning workflow (login → scan → manifest → reconcile)
2. Shipment creation → tracking → delivery
3. Invoice creation → PDF generation → payment recording
4. Exception creation → assignment → resolution
5. Manifest creation → transit → arrival → reconciliation

**Load Testing**

- Simulate 100 concurrent users
- Test real-time subscriptions under load
- Validate database connection pool limits
- Test API rate limiting

**Deliverables**:

- ✅ 70% overall test coverage
- ✅ Zero critical bugs

---

#### Deployment & Monitoring (Week 24)

**Production Deployment**

- Set up production Supabase project
- Configure environment variables
- Set up Vercel production deployment
- Configure custom domain (DNS)
- Enable Vercel Analytics

**Monitoring**

- Error tracking (Sentry integration)
- Performance monitoring (Vercel Analytics)
- Database monitoring (Supabase dashboard)
- Real-time subscription monitoring
- Alert rules (error rate > 1%, response time > 3s)

**Documentation**

- API documentation (for tracking endpoint)
- User manual (operations team)
- Admin guide (configuration, user management)
- Runbook (incident response procedures)

**Deliverables**:

- ✅ Production launch
- ✅ 24/7 monitoring active

---

## 6. TECHNOLOGY & COMPONENT RECOMMENDATIONS

### 6.1 Additional UI Components

**Missing Components (High Priority)**:

1. **Tooltip** — `npx shadcn@latest add tooltip`
   - Use case: Icon help, SLA warnings, status definitions

2. **Toast/Sonner** — `npm install sonner && npx shadcn@latest add sonner`
   - Use case: Scan feedback, mutation success/error notifications

3. **Tabs** — `npx shadcn@latest add tabs`
   - Use case: Shipment detail views (overview, timeline, documents)

4. **Skeleton** — `npx shadcn@latest add skeleton`
   - Use case: Loading states for perceived performance

5. **Dialog** — `npx shadcn@latest add dialog`
   - Use case: Confirmation dialogs, quick-edit forms

6. **Form** — `npx shadcn@latest add form`
   - Use case: Standardized form components with shadcn styling

**Custom Components (Build Required)**:

7. **Timeline Component**
   - Vertical timeline for shipment journey visualization
   - Status icons with semantic colors
   - Timestamp formatting

8. **KPI Card Component**
   - Metric value, trend indicator (↑↓), sparkline
   - Color-coded based on performance (green/yellow/red)
   - Clickable for drill-down

9. **Status Timeline Component**
   - Horizontal progress bar (pending → in-transit → delivered)
   - Current status highlighted
   - Estimated completion indicator

---

### 6.2 Data Visualization Libraries

**Current**: Recharts 2.15.4 ✅

**Additional Recommendations**:

1. **react-chartjs-2** (alternative to Recharts)
   - More performant for real-time updating charts
   - Better animation controls
   - Smaller bundle size

2. **Victory** (alternative to Recharts)
   - React Native compatible (if mobile app planned)
   - More customizable
   - Better accessibility support

**Recommendation**: **Stick with Recharts** for consistency. Only switch if performance issues arise with real-time data.

---

### 6.3 Map Integration (Optional)

**Use Case**: Live shipment tracking, hub visualization

**Options**:

1. **Mapbox GL JS** (Recommended)
   - Best performance for large datasets
   - Beautiful default styles
   - Free tier: 50,000 map loads/month
   - `npm install mapbox-gl react-map-gl`

2. **Leaflet**
   - Open-source, no API key required
   - Lighter weight than Mapbox
   - `npm install leaflet react-leaflet`

3. **Google Maps**
   - Most familiar to users
   - Expensive (pay-per-use after free tier)
   - `npm install @googlemaps/js-api-loader`

**Implementation Example** (Mapbox):

```typescript
// components/maps/shipment-map.tsx
import Map, { Marker, Source, Layer } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export function ShipmentMap({ shipments }: { shipments: Shipment[] }) {
  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{
        latitude: 20.5937,
        longitude: 78.9629,
        zoom: 4
      }}
      style={{ width: '100%', height: '600px' }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      {shipments.map((shipment) => (
        shipment.current_location_lat && shipment.current_location_lng && (
          <Marker
            key={shipment.id}
            latitude={shipment.current_location_lat}
            longitude={shipment.current_location_lng}
          >
            <div className="bg-primary text-primary-foreground p-2 rounded-full">
              📦
            </div>
          </Marker>
        )
      ))}
    </Map>
  )
}
```

---

### 6.4 Barcode Scanning Hardware Integration

**Mobile Scanning**:

- Use device camera with **html5-qrcode** library
- `npm install html5-qrcode`
- Progressive Web App (PWA) for offline scanning

**Dedicated Barcode Scanners**:

- USB/Bluetooth barcode scanners act as keyboard input
- No special integration required (scans appear as keystrokes)
- Recommended: Zebra DS2208, Honeywell Voyager 1200g

**Camera Scanning Implementation**:

```typescript
// components/scanner/camera-scanner.tsx
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useEffect, useRef } from 'react'

export function CameraScanner({ onScan }: { onScan: (barcode: string) => void }) {
  const scannerRef = useRef<Html5QrcodeScanner>()

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      'barcode-scanner',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
      },
      false
    )

    scannerRef.current.render(
      (decodedText) => {
        onScan(decodedText)
      },
      (error) => {
        console.error('Scan error:', error)
      }
    )

    return () => {
      scannerRef.current?.clear()
    }
  }, [onScan])

  return <div id="barcode-scanner" />
}
```

---

### 6.5 Real-Time Communication

**Current**: Supabase Realtime (PostgreSQL LISTEN/NOTIFY) ✅

**Scaling Considerations**:

- Supabase Realtime has channel limits (100 per connection)
- For >1000 concurrent users, consider:
  - **Pusher** (managed WebSocket service)
  - **Ably** (managed real-time platform)
  - **Socket.io** (self-hosted WebSocket server)

**Recommendation**: **Stick with Supabase Realtime** until scale requires dedicated infrastructure.

---

### 6.6 Notification System

**SMS Notifications** (for drivers, customers):

- **Twilio** (most reliable, expensive)
- **AWS SNS** (cost-effective, requires AWS account)
- **MessageBird** (good for international)

**Email Notifications**:

- **Resend** (recommended, modern, developer-friendly)
- **SendGrid** (established, more features)
- **AWS SES** (cheapest for volume)

**Push Notifications** (for PWA):

- **OneSignal** (free tier, easy integration)
- **Firebase Cloud Messaging** (Google's solution)
- **Web Push API** (native, no third-party)

**Implementation Example** (Resend for email):

```bash
npm install resend
```

```typescript
// lib/notifications/send-tracking-email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTrackingEmail(shipment: Shipment) {
  const trackingUrl = `https://your-domain.com/track?ref=${shipment.reference}`;

  await resend.emails.send({
    from: "TAC Cargo <noreply@your-domain.com>",
    to: shipment.consignee_email,
    subject: `Your shipment ${shipment.reference} is on the way`,
    html: `
      <h1>Shipment Update</h1>
      <p>Your shipment is currently in transit.</p>
      <p><a href="${trackingUrl}">Track your shipment</a></p>
    `,
  });
}
```

---

### 6.7 Date & Time Handling

**Current**: Likely using native `Date` object

**Recommendation**: **date-fns** (tree-shakeable, modern)

```bash
npm install date-fns
```

**Why not Moment.js?** — Large bundle size (67KB), deprecated

**Common Utilities**:

```typescript
import { format, formatDistanceToNow, differenceInHours } from "date-fns";

// Format timestamp
format(new Date(), "PPp"); // "Jan 3, 2026, 1:17 AM"

// Time ago
formatDistanceToNow(shipment.created_at, { addSuffix: true }); // "2 hours ago"

// SLA time remaining
const hoursUntilSLA = differenceInHours(shipment.sla_target, new Date());
```

---

### 6.8 State Management

**Current**: useState, Context API (assumed)

**When to Upgrade**:

- If prop drilling becomes unmanageable
- If global state (user preferences, theme) gets complex

**Recommendation**: **Zustand** (lightest, easiest)

```bash
npm install zustand
```

**Example**:

```typescript
// stores/user-preferences.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserPreferences {
  defaultWarehouse: string | null;
  defaultServiceLevel: string | null;
  setDefaultWarehouse: (id: string) => void;
  setDefaultServiceLevel: (id: string) => void;
}

export const useUserPreferences = create<UserPreferences>()(
  persist(
    (set) => ({
      defaultWarehouse: null,
      defaultServiceLevel: null,
      setDefaultWarehouse: (id) => set({ defaultWarehouse: id }),
      setDefaultServiceLevel: (id) => set({ defaultServiceLevel: id }),
    }),
    {
      name: "user-preferences",
    },
  ),
);
```

**Alternatives**:

- **Redux Toolkit** (if already familiar, overkill for most cases)
- **Jotai** (atomic state, more flexible than Zustand)

---

### 6.9 File Upload Strategy

**Use Case**: Photo uploads for exceptions, delivery proofs, documents

**Recommendation**: Supabase Storage ✅

**Implementation**:

```typescript
// lib/storage/upload-file.ts
import { createClient } from "@/lib/supabase/client";

export async function uploadExceptionPhoto(shipmentId: string, file: File) {
  const supabase = createClient();
  const fileName = `exceptions/${shipmentId}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("photos")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("photos").getPublicUrl(fileName);

  return publicUrl;
}
```

**Image Optimization**:

- Use `next/image` for automatic optimization
- Configure Supabase Storage transforms (resize, compress)
- Serve via CDN (Supabase Storage has built-in CDN)

---

### 6.10 Internationalization (Future)

**If multi-language support needed**:

**Recommendation**: **next-intl**

```bash
npm install next-intl
```

**Supports**:

- Next.js App Router
- TypeScript
- Server & client components
- Locale routing (e.g., `/en/dashboard`, `/hi/dashboard`)

---

## 7. FINAL RECOMMENDATIONS

### Immediate Actions (Week 1)

1. **Enable Real-Time Subscriptions**
   - Supabase dashboard → Replication → Enable on `shipments`, `scan_events`
   - Implement `useRealtimeShipments` hook
   - Add to dashboard

2. **Install Testing Framework**
   - `npm install -D vitest @testing-library/react jsdom playwright`
   - Create first 10 tests (barcode validator)
   - Set up GitHub Actions

3. **Implement GS1 Validator**
   - Create `lib/barcode/gs1-validator.ts`
   - Add to scanning page
   - Write 20 test cases

4. **Add Missing Components**
   - `npx shadcn@latest add tooltip toast tabs skeleton dialog form`

5. **Create Database Migration**
   - Add `manifests`, `invoices`, `service_levels` tables
   - Add foreign keys to `shipments`
   - Create indexes

### Short-Term (Weeks 2-6)

6. **Install Data-Fetching Layer**
   - `npm install @tanstack/react-query`
   - Migrate dashboard to use queries
   - Add loading/error states

7. **Implement Form Validation**
   - `npm install zod react-hook-form @hookform/resolvers`
   - Create shipment creation form
   - Add inline validation

8. **Set Up PDF Generation**
   - `npm install @react-pdf/renderer`
   - Create invoice PDF template
   - Implement upload to Supabase Storage

### Medium-Term (Weeks 7-16)

9. **Build Core Features**
   - Complete shipments CRUD
   - Manifest management
   - Invoicing workflow
   - Payment tracking

10. **Implement Analytics**
    - Operational KPIs dashboard
    - Financial reports
    - Export functionality (CSV, PDF)

### Long-Term (Weeks 17-24)

11. **Advanced Features**
    - Exception management
    - Inventory tracking
    - Customer portal (optional)

12. **Production Hardening**
    - Performance optimization
    - Security audit
    - Load testing
    - Monitoring setup

---

## 8. SUCCESS METRICS

**Production-Readiness Criteria**:

✅ **Technical Criteria**:

- [ ] 70% test coverage achieved
- [ ] Lighthouse score: Performance 90+, Accessibility 100
- [ ] Real-time updates working for 100+ concurrent users
- [ ] GS1 barcode validation 100% accurate
- [ ] Database indexes created, query performance < 100ms
- [ ] Security audit passed (no critical vulnerabilities)
- [ ] Load test passed (100 concurrent users, <3s response time)

✅ **Functional Criteria**:

- [ ] Complete shipment lifecycle (create → scan → manifest → track → deliver)
- [ ] Invoice generation and payment tracking
- [ ] Manifest reconciliation with discrepancy detection
- [ ] Exception management workflow
- [ ] Real-time dashboard updates
- [ ] Public tracking API functional

✅ **Business Criteria**:

- [ ] SLA tracking operational (at-risk alerts working)
- [ ] Invoice↔Manifest↔Shipment traceability complete
- [ ] PDF generation for invoices and manifests
- [ ] User roles and permissions configured
- [ ] Operations team trained on system

---

## CONCLUSION

TAC Cargo has **strong architectural foundations** with modern technologies and thoughtful planning. The codebase demonstrates production-grade patterns and a domain-appropriate structure.

**Current Grade**: **B+ (Production-Capable with Critical Gaps)**

**To achieve A-grade production readiness**:

1. Implement real-time infrastructure (HIGH PRIORITY)
2. Add GS1 barcode compliance (HIGH PRIORITY)
3. Complete database schema for traceability (HIGH PRIORITY)
4. Establish testing framework with 70% coverage (CRITICAL PRIORITY)
5. Implement data-fetching abstraction (MEDIUM PRIORITY)
6. Add form validation framework (MEDIUM PRIORITY)
7. Implement PDF generation (MEDIUM PRIORITY)

**Estimated Timeline**: 4-6 weeks for critical gap closure, 24 weeks for full feature completion.

**Recommended Deployment Strategy**:

- **Week 6**: Soft launch (internal testing, select customers)
- **Week 12**: Public beta (expanded customer base, feedback loop)
- **Week 24**: General availability (full production)

This roadmap prioritizes **operational correctness** over feature completeness, ensuring that core logistics workflows (scanning, manifesting, tracking, invoicing) are audit-ready and customs-compliant before launch.

---

**END OF REPORT**
