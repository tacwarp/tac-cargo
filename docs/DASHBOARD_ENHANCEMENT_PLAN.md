# TAC Cargo Dashboard Enhancement Plan

## Executive Summary

Based on analysis of `dashboard-implemntation-plan.md` and current dashboard pages, this document outlines a phased implementation plan to transform the dashboard from **current state (3/10)** to **production-ready (10/10)**.

---

## Current State Analysis

### Existing Pages
| Page | Section | Current State | Target State |
|------|---------|---------------|--------------|
| **Overview** | Main Deck | Basic KPI cards + activity feed | Real-time command center with live maps |
| **Analytics** | Main Deck | Basic charts (shipments/revenue by date) | Comprehensive BI with 6+ chart types |
| **Shipments** | Operations | Table with CRUD | Advanced wizard + bulk actions + barcode |
| **Live Routes** | Operations | Missing | Real-time vehicle tracking map |
| **Tracking** | Operations | Status filter + list view | Live timeline + geolocation |
| **Manifests** | Operations | Basic list + create | Smart optimization + driver assignment |
| **Scanner** | Operations | Basic scanner component | PWA-ready with offline queue |
| **Inventory** | Operations | Basic warehouse view | Visual warehouse map + location tracking |
| **Exceptions** | Operations | Simple failed/delayed list | Workflow-based resolution system |
| **Invoices** | Finance | List + generate | WhatsApp delivery + payment gateway |
| **Payments** | Finance | Basic/Missing | Full reconciliation dashboard |
| **Customers** | Management | Basic CRUD | Portal + lifetime value analytics |
| **Settings** | Management | Basic | Role-based + notifications config |
| **Support** | Support | Placeholder | Ticket system + FAQ |
| **Feedback** | Support | Placeholder | NPS + ratings collection |

---

## Phase 1: Foundation Enhancement (Week 1-2)

### 1.1 Install Required shadcn/ui Components
```bash
# Charts (Recharts-based)
npx shadcn@latest add chart

# UI Components needed
npx shadcn@latest add tabs card badge progress skeleton
npx shadcn@latest add data-table combobox command
npx shadcn@latest add sheet drawer dialog
npx shadcn@latest add tooltip popover hover-card
npx shadcn@latest add calendar date-picker
npx shadcn@latest add progress spinner
```

### 1.2 Create Chart Components Library
Location: `components/charts/`

| Component | Chart Type | Use Case |
|-----------|------------|----------|
| `AreaChartStacked` | Area | Revenue trends, shipment volume |
| `BarChartMultiple` | Bar | Comparison metrics (this week vs last) |
| `BarChartHorizontal` | Bar | Top customers, route performance |
| `LineChartMultiple` | Line | Delivery time trends |
| `PieChartDonut` | Pie/Donut | Status distribution, service breakdown |
| `RadarChartPerformance` | Radar | Driver/warehouse performance |
| `RadialChartProgress` | Radial | KPI progress (delivery rate %) |

### 1.3 Create Reusable Dashboard Components
Location: `components/dashboard/`

```typescript
// New components to create
- MetricCard.tsx        // KPI with trend indicator
- StatusPipeline.tsx    // Kanban-style status flow
- LiveActivityFeed.tsx  // Real-time event stream
- TrackingTimeline.tsx  // Shipment journey visualization
- ScannerInput.tsx      // Barcode scanner with validation
- ShipmentCard.tsx      // Compact shipment info card
- VehicleMapMarker.tsx  // Map marker for vehicles
- WarehouseMap.tsx      // Visual warehouse layout
- QuickActions.tsx      // Action buttons panel
```

---

## Phase 2: Main Deck Enhancement (Week 2-3)

### 2.1 Overview Page - Mission Control
**File:** `app/(dashboard)/dashboard/page.tsx`

**Enhancements:**
1. **Real-Time Metrics Grid** (4x3 layout)
   - Total Shipments (Today/Week/Month toggle)
   - In Transit (live count with pulse indicator)
   - Delivered Today (% change vs yesterday)
   - Out for Delivery
   - Pending Pickups
   - Exception Alerts (red badge)
   - Revenue Today (₹ with trend arrow)
   - Average Delivery Time
   - Vehicle Utilization %
   - Warehouse Occupancy %
   - Customer Satisfaction Score
   - Staff Performance Score

2. **Live Activity Feed** (WebSocket via Supabase Realtime)
   - Package scanned events
   - Delivery completions
   - New bookings
   - Invoice sent notifications
   - Exception alerts

3. **Shipment Status Pipeline** (Horizontal Kanban)
   ```
   [Booked] → [Picked Up] → [In Transit] → [Out for Delivery] → [Delivered]
   ```

4. **Charts Section**
   - Area Chart: Shipment volume (7/30/90 days)
   - Bar Chart: Revenue vs Target
   - Pie Chart: Status distribution
   - Radial Chart: Delivery success rate

5. **Quick Actions Panel**
   - New Shipment (opens wizard)
   - Scan Package (opens scanner modal)
   - Print Labels (batch selection)
   - Generate Manifest
   - Send Notifications

### 2.2 Analytics Page - BI Dashboard
**File:** `app/(dashboard)/dashboard/analytics/page.tsx`

**Enhancements:**
1. **Date Range Selector** (Today/7D/30D/90D/Custom)
2. **Summary Cards Row**
   - Total Shipments | Growth %
   - Total Revenue | Growth %
   - Delivery Rate | Trend
   - Average Delivery Time | Trend

3. **Charts Grid (2x3)**
   - Area Chart: Daily shipment volume
   - Bar Chart: Revenue by service type
   - Line Chart: Delivery time trend
   - Pie Chart: Transport mode distribution
   - Horizontal Bar: Top 10 customers
   - Radar Chart: Performance by warehouse

4. **Data Tables**
   - Route performance breakdown
   - Customer segment analysis
   - Exception type breakdown

---

## Phase 3: Operations Enhancement (Week 3-5)

### 3.1 Shipments Page
**File:** `app/(dashboard)/dashboard/shipments/page.tsx`

**Enhancements:**
1. **Advanced Data Table**
   - Server-side pagination
   - Column visibility toggle
   - Saved filter presets
   - Bulk actions (status update, print, assign)
   - Row selection
   - Export to CSV/Excel

2. **Smart Shipment Creation Wizard** (4-step)
   - Step 1: Customer & Package Details
   - Step 2: Pickup & Delivery Addresses
   - Step 3: Service & Pricing (auto-calculate)
   - Step 4: Review & Confirm

3. **Shipment Detail Drawer**
   - Tabbed interface: Timeline | Events | Documents | Notifications
   - Action buttons: Track, Print Label, Cancel, Reschedule

### 3.2 Live Routes Page (NEW)
**File:** `app/(dashboard)/dashboard/routes/page.tsx`

**Features:**
1. **Interactive Map** (Mapbox GL or Leaflet)
   - Real-time vehicle positions
   - Color-coded status (green: on-time, orange: delayed)
   - Click for vehicle details

2. **Route List Panel**
   - Active routes with driver info
   - ETA and progress indicators
   - Package count per route

3. **Route Optimization** (future: Google Directions API)

### 3.3 Tracking Page
**File:** `app/(dashboard)/dashboard/tracking/page.tsx`

**Enhancements:**
1. **Status Filter Tabs** (horizontal pills)
2. **Search by AWB/Reference** (prominent search bar)
3. **Shipment Cards Grid** (instead of table)
4. **Tracking Timeline Component** (visual journey)
5. **Map Integration** (show current location)

### 3.4 Manifests Page
**File:** `app/(dashboard)/dashboard/manifests/page.tsx`

**Enhancements:**
1. **Manifest Creation Wizard**
   - Auto-suggest packages by route
   - Capacity indicator (weight/volume)
   - Driver assignment with availability
   - Route preview

2. **Manifest Detail View**
   - Package list with scan status
   - Driver contact info
   - Live tracking link
   - Closure workflow

### 3.5 Scanner Page
**File:** `app/(dashboard)/dashboard/scanning/page.tsx`

**Enhancements:**
1. **Multi-mode Scanner**
   - USB barcode reader (HID)
   - Camera-based (Html5-QRCode)
   - Manual entry fallback

2. **Scan Actions**
   - Update status
   - Add to manifest
   - View details
   - Print label

3. **Offline Queue**
   - Store scans locally
   - Sync when online
   - Status indicator

### 3.6 Inventory Page
**File:** `app/(dashboard)/dashboard/inventory/page.tsx`

**Enhancements:**
1. **Warehouse Selector** (tabs or dropdown)
2. **Visual Warehouse Map** (grid layout)
   - Zones, aisles, racks
   - Color-coded occupancy
   - Click for location details

3. **Package Search**
   - Search by AWB
   - Show exact location

4. **Inventory Reports**
   - Aging report (>7 days)
   - Capacity utilization chart

### 3.7 Exceptions Page
**File:** `app/(dashboard)/dashboard/exceptions/page.tsx`

**Enhancements:**
1. **Exception Categories**
   - Failed Delivery
   - Delayed (>3 days)
   - Address Issue
   - Damaged
   - Customer Unavailable

2. **Resolution Workflow**
   - Assign to staff
   - Add notes
   - Schedule retry
   - Customer notification

3. **Escalation Rules**
   - Auto-escalate after 24h

---

## Phase 4: Finance Enhancement (Week 5-6)

### 4.1 Invoices Page
**File:** `app/(dashboard)/dashboard/invoices/page.tsx`

**Enhancements:**
1. **Invoice List**
   - Status badges (Paid, Pending, Overdue)
   - Quick actions (View, Send, Download)
   - Bulk send via WhatsApp

2. **Invoice Generator**
   - GST-compliant format
   - Auto-calculation
   - Multiple templates

3. **WhatsApp Integration**
   - Send invoice PDF
   - Payment link
   - Delivery tracking

### 4.2 Payments Page (NEW)
**File:** `app/(dashboard)/dashboard/payments/page.tsx`

**Features:**
1. **Payment Dashboard**
   - Total collected (today/week/month)
   - Outstanding amount
   - Collection rate chart

2. **Payment List**
   - Recent payments
   - Pending collections
   - Failed payments

3. **COD Tracking**
   - Driver-wise COD collection
   - Settlement status

4. **Razorpay Integration** (future)
   - Payment links
   - Webhook handling
   - Auto-reconciliation

---

## Phase 5: Management & Support (Week 6-7)

### 5.1 Customers Page
**File:** `app/(dashboard)/dashboard/customers/page.tsx`

**Enhancements:**
1. **Customer List**
   - Lifetime value indicator
   - Shipment count
   - Payment status

2. **Customer Detail**
   - Shipment history
   - Invoice history
   - Address book
   - Notes

3. **Customer Analytics**
   - Top customers chart
   - Retention metrics

### 5.2 Settings Page
**File:** `app/(dashboard)/dashboard/settings/page.tsx`

**Enhancements:**
1. **Profile Settings**
2. **Notification Preferences**
3. **API Keys Management**
4. **Warehouse Configuration**
5. **Rate Card Management**
6. **User Roles & Permissions**

### 5.3 Support Page
**File:** `app/(dashboard)/dashboard/support/page.tsx`

**Features:**
1. **FAQ Section**
2. **Contact Form**
3. **Documentation Links**
4. **System Status**

### 5.4 Feedback Page
**File:** `app/(dashboard)/dashboard/feedback/page.tsx`

**Features:**
1. **NPS Survey**
2. **Feature Requests**
3. **Bug Reports**
4. **Rating Collection**

---

## Phase 6: Vector Illustrations (Week 7)

### Generate with nano-banana MCP
Create vector illustrations for:

1. **Empty States**
   - No shipments found
   - No invoices
   - No exceptions
   - No customers

2. **Success States**
   - Shipment created
   - Invoice sent
   - Payment received
   - Delivery completed

3. **Error States**
   - Connection lost
   - Server error
   - Access denied

4. **Onboarding**
   - Welcome illustration
   - Feature highlights

**Style:** Flat vector, isometric perspective, minimal color palette matching dashboard theme

---

## Technical Implementation Details

### Chart Configuration (Recharts + shadcn)
```typescript
// components/charts/config.ts
export const chartConfig = {
  shipments: { label: "Shipments", color: "hsl(var(--chart-1))" },
  revenue: { label: "Revenue", color: "hsl(var(--chart-2))" },
  delivered: { label: "Delivered", color: "hsl(var(--chart-3))" },
  pending: { label: "Pending", color: "hsl(var(--chart-4))" },
  failed: { label: "Failed", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;
```

### Real-time Updates (Supabase Realtime)
```typescript
// hooks/use-dashboard-realtime.ts
useEffect(() => {
  const channel = supabase
    .channel('dashboard-updates')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'shipments' },
      handleShipmentChange
    )
    .subscribe();
  
  return () => { supabase.removeChannel(channel); };
}, []);
```

### Barcode Scanner Integration
```typescript
// components/dashboard/barcode-scanner.tsx
import { Html5Qrcode } from "html5-qrcode";

const scanner = new Html5Qrcode("scanner-container");
await scanner.start(
  { facingMode: "environment" },
  { fps: 10, qrbox: { width: 250, height: 250 } },
  onScanSuccess,
  onScanError
);
```

---

## Dependencies to Add
```json
{
  "dependencies": {
    "html5-qrcode": "^2.3.8",
    "mapbox-gl": "^3.0.0",
    "react-map-gl": "^7.1.0",
    "@tanstack/react-virtual": "^3.0.0"
  }
}
```

---

## File Structure After Enhancement
```
app/(dashboard)/dashboard/
├── _components/
│   ├── v2-header.tsx
│   ├── overview-client.tsx
│   └── ...
├── page.tsx                 # Overview (Mission Control)
├── analytics/
│   ├── _components/
│   │   └── analytics-client.tsx (enhanced)
│   └── page.tsx
├── shipments/
│   ├── _components/
│   │   ├── shipments-table-client.tsx (enhanced)
│   │   ├── shipment-wizard.tsx (NEW)
│   │   └── shipment-drawer.tsx (NEW)
│   └── page.tsx
├── routes/
│   ├── _components/
│   │   ├── routes-client.tsx (NEW)
│   │   └── vehicle-map.tsx (NEW)
│   └── page.tsx (ENHANCE)
├── tracking/
│   ├── _components/
│   │   ├── tracking-client.tsx (enhanced)
│   │   └── tracking-timeline.tsx (NEW)
│   └── page.tsx
├── manifests/
│   ├── _components/
│   │   ├── manifests-client.tsx (enhanced)
│   │   └── manifest-wizard.tsx (NEW)
│   └── page.tsx
├── scanning/
│   ├── _components/
│   │   └── scanner-client.tsx (enhanced)
│   └── page.tsx
├── inventory/
│   ├── _components/
│   │   ├── inventory-client.tsx (enhanced)
│   │   └── warehouse-map.tsx (NEW)
│   └── page.tsx
├── exceptions/
│   ├── _components/
│   │   └── exceptions-client.tsx (enhanced)
│   └── page.tsx
├── invoices/
│   ├── _components/
│   │   └── invoices-client.tsx (enhanced)
│   └── page.tsx
├── payments/
│   ├── _components/
│   │   └── payments-client.tsx (NEW)
│   └── page.tsx (NEW)
├── customers/
│   ├── _components/
│   │   └── customers-client.tsx (enhanced)
│   └── page.tsx
├── settings/
│   └── page.tsx (enhanced)
├── support/
│   └── page.tsx (enhanced)
└── feedback/
    └── page.tsx (enhanced)

components/
├── charts/
│   ├── area-chart-stacked.tsx
│   ├── bar-chart-multiple.tsx
│   ├── bar-chart-horizontal.tsx
│   ├── line-chart-multiple.tsx
│   ├── pie-chart-donut.tsx
│   ├── radar-chart.tsx
│   ├── radial-chart.tsx
│   └── index.ts
├── dashboard/
│   ├── metric-card.tsx (enhanced)
│   ├── status-pipeline.tsx (NEW)
│   ├── live-activity-feed.tsx (NEW)
│   ├── tracking-timeline.tsx (NEW)
│   ├── scanner-input.tsx (enhanced)
│   ├── shipment-card.tsx (NEW)
│   ├── warehouse-map.tsx (NEW)
│   ├── quick-actions.tsx (NEW)
│   └── ...
└── illustrations/
    ├── empty-shipments.tsx (vector)
    ├── success-delivery.tsx (vector)
    ├── error-state.tsx (vector)
    └── ...
```

---

## Priority Order for Implementation

### HIGH Priority (Week 1-3)
1. ✅ Install shadcn chart component
2. ✅ Create chart components library
3. ✅ Enhance Overview page with real metrics grid
4. ✅ Add charts to Analytics page
5. ✅ Enhance Shipments table with bulk actions

### MEDIUM Priority (Week 4-5)
6. ⬜ Create Live Routes page with map
7. ⬜ Enhance Tracking with timeline component
8. ⬜ Improve Manifests with wizard
9. ⬜ Enhance Scanner with camera support
10. ⬜ Add Inventory warehouse map

### LOWER Priority (Week 6-7)
11. ⬜ Enhance Invoices with WhatsApp send
12. ⬜ Create Payments page
13. ⬜ Enhance Customers with analytics
14. ⬜ Improve Settings page
15. ⬜ Generate vector illustrations

---

## Success Metrics
- [ ] Page load time < 2 seconds
- [ ] All charts render smoothly
- [ ] Real-time updates working
- [ ] Barcode scanner 98% accuracy
- [ ] Mobile responsive design
- [ ] Accessibility (WCAG 2.1 AA)

---

*Document created: January 9, 2026*
*Target completion: February 28, 2026*
