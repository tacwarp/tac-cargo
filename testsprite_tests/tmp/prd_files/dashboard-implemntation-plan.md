# TAC Cargo Logistics Dashboard - Complete Product Requirements Document (PRD)

**Version:** 2.0  
**Date:** January 2026  
**Target Score:** 10/10 Production-Ready System  
**Current Score:** 1/10 → Target: 10/10

---

## Executive Summary

This PRD transforms TAC Cargo from a basic logistics tracking system (1/10) into a world-class, production-ready logistics management platform (10/10) that matches or exceeds industry leaders like FedEx, DHL, and Amazon Logistics.

### Current State Analysis
- **Strengths:** Basic shipment tracking, invoice generation, barcode support
- **Critical Gaps:** No real-time tracking, limited automation, minimal analytics, poor inventory visibility, basic manifest system, no customer communication automation
- **Verdict:** Functional MVP but far from production-ready for high-volume operations

### Target State
A comprehensive logistics command center with:
- Real-time package tracking with geolocation
- Automated customer notifications (WhatsApp, SMS, Email)
- Advanced inventory management with location tracking
- AI-powered route optimization
- Comprehensive analytics and KPI dashboards
- Enterprise-grade security and compliance
- Mobile-first barcode scanning workflows

---

## 1. CORE SYSTEM ARCHITECTURE ENHANCEMENT

### 1.1 Technology Stack Upgrades

```typescript
// Enhanced Stack
Framework: Next.js 14+ (App Router) ✓ KEEP
Database: Supabase PostgreSQL + Redis Cache NEW
Real-time: WebSocket (Supabase Realtime) + Socket.io NEW
State: Zustand + React Query (TanStack Query) NEW
UI: Shadcn UI + Radix + Tailwind CSS ✓ ENHANCE
Forms: React Hook Form + Zod ✓ KEEP
Charts: Recharts + D3.js + Apache ECharts NEW
Maps: Mapbox GL JS NEW
Mobile: Progressive Web App (PWA) NEW
Scanning: QuaggaJS / Html5-QRCode NEW
Notifications: Firebase Cloud Messaging NEW
WhatsApp: Official WhatsApp Business API NEW
PDF: jsPDF + PDF-lib NEW
Analytics: Mixpanel / PostHog NEW
```

### 1.2 Database Schema - Critical Enhancements

```sql
-- Current tables (keep + enhance)
-- shipments, customers, manifests, invoices, users

-- NEW CRITICAL TABLES

-- Real-time tracking table
CREATE TABLE package_tracking_events (
  id UUID PRIMARY KEY,
  shipment_id UUID REFERENCES shipments(id),
  event_type VARCHAR(50), -- scanned, in_transit, out_for_delivery, delivered, exception
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  facility_id UUID REFERENCES facilities(id),
  scan_type VARCHAR(50), -- arrival, departure, sort, load
  scanned_by UUID REFERENCES users(id),
  device_id VARCHAR(100),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  image_proof_url TEXT,
  signature_url TEXT,
  INDEX idx_shipment_timestamp (shipment_id, timestamp DESC)
);

-- Warehouse inventory locations
CREATE TABLE warehouse_locations (
  id UUID PRIMARY KEY,
  warehouse_id UUID REFERENCES warehouses(id),
  zone VARCHAR(10), -- A, B, C
  aisle VARCHAR(10), -- 01-99
  rack VARCHAR(10), -- A-Z
  shelf INTEGER,
  bin INTEGER,
  location_code VARCHAR(50) UNIQUE, -- A-04-C-3-02
  barcode VARCHAR(100) UNIQUE,
  capacity_cubic_meters DECIMAL(10,2),
  current_occupancy INTEGER DEFAULT 0,
  status VARCHAR(20), -- active, maintenance, blocked
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Package location tracking
CREATE TABLE package_locations (
  id UUID PRIMARY KEY,
  shipment_id UUID REFERENCES shipments(id),
  location_id UUID REFERENCES warehouse_locations(id),
  status VARCHAR(50), -- stored, picked, staged, loaded
  stored_at TIMESTAMPTZ,
  retrieved_at TIMESTAMPTZ,
  INDEX idx_shipment_current (shipment_id, retrieved_at)
);

-- Enhanced manifest with driver tracking
CREATE TABLE manifests (
  id UUID PRIMARY KEY,
  manifest_no VARCHAR(50) UNIQUE,
  transport_mode VARCHAR(20),
  vehicle_id UUID REFERENCES vehicles(id),
  driver_id UUID REFERENCES drivers(id),
  route_id UUID REFERENCES routes(id),
  status VARCHAR(50),
  departure_time TIMESTAMPTZ,
  estimated_arrival TIMESTAMPTZ,
  actual_arrival TIMESTAMPTZ,
  current_location_lat DECIMAL(10, 8),
  current_location_lng DECIMAL(11, 8),
  last_location_update TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicles registry
CREATE TABLE vehicles (
  id UUID PRIMARY KEY,
  vehicle_number VARCHAR(50) UNIQUE,
  vehicle_type VARCHAR(50), -- truck, van, bike, flight
  capacity_kg DECIMAL(10,2),
  capacity_cubic_m DECIMAL(10,2),
  status VARCHAR(20), -- active, maintenance, inactive
  gps_device_id VARCHAR(100),
  insurance_expiry DATE,
  license_expiry DATE,
  last_service_date DATE,
  next_service_due DATE
);

-- Drivers registry
CREATE TABLE drivers (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  phone VARCHAR(20),
  license_number VARCHAR(50),
  license_expiry DATE,
  status VARCHAR(20), -- active, on_leave, inactive
  rating DECIMAL(3,2),
  total_deliveries INTEGER DEFAULT 0,
  profile_image_url TEXT
);

-- Routes optimization
CREATE TABLE routes (
  id UUID PRIMARY KEY,
  route_name VARCHAR(255),
  origin_hub_id UUID REFERENCES facilities(id),
  destination_hub_id UUID REFERENCES facilities(id),
  waypoints JSONB, -- array of {lat, lng, facility_id}
  distance_km DECIMAL(10,2),
  estimated_duration_minutes INTEGER,
  status VARCHAR(20)
);

-- Customer notifications log
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  shipment_id UUID REFERENCES shipments(id),
  customer_id UUID REFERENCES customers(id),
  channel VARCHAR(20), -- whatsapp, sms, email, push
  type VARCHAR(50), -- booking_confirmed, invoice, tracking_update, delivered
  status VARCHAR(20), -- pending, sent, delivered, failed, read
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  message_content TEXT,
  media_url TEXT, -- for invoice PDF, label image
  external_message_id VARCHAR(255), -- WhatsApp msg ID
  error_message TEXT
);

-- Analytics and KPIs (materialized view)
CREATE MATERIALIZED VIEW daily_kpis AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_shipments,
  SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_count,
  AVG(EXTRACT(EPOCH FROM (delivered_at - created_at))/3600) as avg_delivery_time_hours,
  SUM(freight_charge + other_charges) as total_revenue,
  COUNT(DISTINCT customer_id) as unique_customers
FROM shipments
GROUP BY DATE(created_at);

-- Label printing log
CREATE TABLE label_prints (
  id UUID PRIMARY KEY,
  shipment_id UUID REFERENCES shipments(id),
  label_type VARCHAR(50), -- shipping_label, invoice_label, barcode_only
  format VARCHAR(20), -- 4x6, A4, A6
  printed_by UUID REFERENCES users(id),
  printed_at TIMESTAMPTZ DEFAULT NOW(),
  printer_id VARCHAR(100),
  print_count INTEGER DEFAULT 1
);
```

---

## 2. DASHBOARD MODULES - COMPLETE REBUILD

### 2.1 Overview Dashboard (Mission Control)

**Current:** Basic KPI cards  
**Target:** Real-time operational command center

#### Key Features:

1. **Real-Time Metrics Grid** (4x3 layout)
   - Total Shipments (Today/Week/Month)
   - In Transit Count (live updating)
   - Delivered Today (with % vs yesterday)
   - Out for Delivery Now
   - Pending Pickups
   - Exception Alerts
   - Revenue Today (with trend)
   - Average Delivery Time
   - Customer Satisfaction Score
   - Vehicle Utilization %
   - Warehouse Occupancy %
   - Staff Performance Score

2. **Live Activity Feed** (WebSocket powered)
   ```
   [Icon] Package #SHP-2026-001 scanned at Delhi Hub - 2m ago
   [Icon] Driver Rajesh started delivery run - 5m ago
   [Icon] Invoice #INV-2026-123 sent via WhatsApp - 8m ago
   [Icon] New booking from ABC Corp - 15m ago
   ```

3. **Geospatial Vehicle Tracking Map** (Mapbox)
   - Real-time vehicle positions
   - Color-coded by status (on-time: green, delayed: orange, critical: red)
   - Click vehicle for: Driver info, packages on board, ETA
   - Geofencing alerts for hub arrivals/departures
   - Route visualization with traffic overlay

4. **Shipment Status Pipeline** (Kanban-style)
   ```
   [Booked: 45] → [Picked Up: 32] → [In Transit: 128] → 
   [Out for Delivery: 67] → [Delivered: 1,247]
   ```
   Drag-and-drop to manually update status if needed

5. **Performance Charts** (Recharts + ECharts)
   - Delivery Performance Trend (7/30/90 days)
   - Revenue vs Target (Line + Bar combo)
   - Top 10 Customers by Volume (Horizontal bar)
   - Delivery Time Distribution (Histogram)
   - Exception Breakdown (Pie chart)

6. **Quick Actions Panel**
   - Create New Shipment (modal)
   - Scan Package Barcode (webcam/mobile)
   - Print Labels (batch)
   - Generate Manifest
   - Send Bulk Notifications

#### UI Component Structure:
```jsx
<DashboardLayout>
  <MetricsGrid metrics={liveKPIs} />
  <LiveActivityFeed events={realtimeEvents} />
  <MapView vehicles={activeVehicles} />
  <ShipmentPipeline stages={pipelineData} />
  <ChartsSection data={analyticsData} />
  <QuickActionsPanel />
</DashboardLayout>
```

---

### 2.2 Shipment Management (Operations Hub)

**Current:** Basic table with create/view  
**Target:** Full lifecycle management with automation

#### Key Features:

1. **Advanced Shipment Table**
   - Server-side pagination (500+ per page)
   - 20+ filterable columns
   - Saved filter presets ("My Delayed", "Today's Deliveries")
   - Bulk actions (status update, print labels, assign driver)
   - Column visibility customizer
   - Export to Excel/CSV with filters applied
   - Cell-level inline editing
   - Row highlight for priority shipments

2. **Smart Shipment Creation Wizard** (Multi-step)
   
   **Step 1: Customer & Package Details**
   ```typescript
   // Auto-populate from customer history
   - Customer (search with autocomplete)
   - Package Type (Document/Parcel/Heavy)
   - Weight & Dimensions (auto-calculate volumetric)
   - Fragile/Perishable flags
   - Declared Value (for insurance)
   ```
   
   **Step 2: Pickup & Delivery**
   ```typescript
   - Pickup Address (Google Places autocomplete)
   - Pickup Time Slot
   - Delivery Address (validate via Google Maps API)
   - Delivery Instructions
   - Preferred Delivery Time
   - Contact Person & Alternate Phone
   ```
   
   **Step 3: Service & Pricing**
   ```typescript
   - Transport Mode (auto-suggest based on route)
   - Service Type (Express/Standard/Economy)
   - Auto-calculate: Freight, Fuel Surcharge, GST
   - Apply Coupon/Discount
   - Show Price Comparison (if multiple modes available)
   ```
   
   **Step 4: Review & Confirm**
   ```typescript
   - Summary preview
   - Terms acceptance
   - Payment method selection
   - Generate: Invoice, AWB, Label (all in one click)
   ```

3. **Shipment Detail Drawer** (Side panel)
   - Tabbed interface:
     - **Timeline:** Visual journey (pickup → hubs → delivery)
     - **Tracking Events:** All scans with timestamps, location, user
     - **Documents:** Invoice PDF, POD signature, label
     - **Notifications:** Sent messages with delivery status
     - **Edit:** Modify delivery details, reschedule
     - **Actions:** Cancel, Reschedule, Request Return, Print Label

4. **Barcode Scanning Integration**
   - Desktop: Attach USB scanner or webcam
   - Mobile: Native camera with QuaggaJS
   - Scan to: Update status, view details, add to manifest
   - Duplicate scan prevention
   - Audio/visual feedback for successful scan
   - Offline scan queue (sync when online)

5. **Exception Management**
   - Auto-flag exceptions: Address incorrect, Customer unavailable, Damaged
   - Exception workflow: Alert → Assign resolution → Customer notification
   - Escalation rules (auto-escalate after 24h)

---

### 2.3 Manifest Management (Logistics Core)

**Current:** Basic scan-and-add  
**Target:** Advanced route optimization with driver management

#### Key Features:

1. **Smart Manifest Creation**
   
   **Auto-Mode (AI-Powered):**
   ```typescript
   // System suggests optimal manifest
   - Selects packages going to same route
   - Groups by service type (Express vs Standard)
   - Considers vehicle capacity
   - Optimizes delivery sequence (Google Maps Directions API)
   - Estimates completion time
   ```
   
   **Manual Mode:**
   - Scan-based addition (primary method)
   - Search and add by AWB/reference
   - Filter available packages by destination/hub
   - Capacity indicator (weight/volume remaining)

2. **Route Optimization Engine**
   ```typescript
   // Integration with Google Maps Directions API
   - Multi-stop route optimization
   - Traffic-aware ETAs
   - Alternative route suggestions
   - Fuel cost estimation
   - Print turn-by-turn directions for driver
   ```

3. **Driver Assignment & Communication**
   - Driver selection with availability status
   - Push notification to driver app
   - Manifest PDF auto-generated and sent to driver
   - Digital signature capture
   - Driver can update package status via mobile app

4. **Manifest Tracking Dashboard**
   - Live map showing driver's current location
   - Completed vs Pending deliveries counter
   - Real-time status updates from driver
   - Alert system for delays
   - Driver performance metrics (on-time %, avg delivery time)

5. **Manifest Closure**
   - Automatic closure when all packages delivered
   - Exception handling for undelivered packages
   - Financial reconciliation (COD collected, fuel expenses)
   - Driver settlement report
   - Vehicle return checklist

---

### 2.4 Inventory & Warehouse Management

**Current:** None (CRITICAL GAP)  
**Target:** Complete warehouse visibility

#### Key Features:

1. **Warehouse Layout Management**
   - Visual warehouse map (zones, aisles, racks)
   - Click location to see stored packages
   - Color-coded occupancy (green: <50%, yellow: 50-80%, red: >80%)
   - Location barcode generation
   - Capacity planning tools

2. **Inbound Processing**
   ```typescript
   // Receiving workflow
   1. Scan package barcode
   2. Verify against manifest
   3. Quality check (damage inspection)
   4. Auto-assign storage location (based on size, priority, destination)
   5. Print location label
   6. Scan package into location
   7. Update inventory system
   ```

3. **Storage & Retrieval**
   - Search package by AWB/reference
   - System shows exact location (Zone A, Aisle 4, Rack C, Shelf 3, Bin 2)
   - Generate pick list for outbound manifest
   - Route picker through warehouse (shortest path)
   - Confirm retrieval with scan

4. **Inventory Reports**
   - Current stock by location
   - Aging report (packages >7 days)
   - Hotspot analysis (most used locations)
   - Capacity utilization by zone
   - Slow-moving package alerts

---

### 2.5 Customer Portal (Self-Service)

**Current:** None  
**Target:** Customer-facing tracking portal

#### Key Features:

1. **Public Tracking Page** (No login required)
   - Enter AWB/Reference number
   - View shipment journey (timeline view)
   - Current location on map
   - Estimated delivery date/time
   - Delivery instructions update
   - Download invoice/POD
   - Rate delivery experience

2. **Customer Dashboard** (Login required)
   - All shipments (active & past)
   - Quick actions: Book shipment, Schedule pickup, Print invoice
   - Address book management
   - Payment methods
   - Invoices & receipts
   - Shipping history analytics
   - Saved templates for frequent shipments

3. **Booking API for E-commerce Integration**
   ```typescript
   // REST API endpoints
   POST /api/v1/shipments/create
   GET /api/v1/shipments/{awb}/track
   POST /api/v1/shipments/{awb}/cancel
   GET /api/v1/rates/calculate
   ```

---

### 2.6 Invoice & Financial Management

**Current:** Basic invoice generation  
**Target:** Automated billing with reconciliation

#### Key Features:

1. **Enhanced Invoice Generator**
   - Multi-currency support
   - GST-compliant format (GSTIN validation)
   - Automatic calculation:
     - Base freight (by weight/volume)
     - Fuel surcharge (variable %)
     - Pickup/Delivery charges
     - Insurance (based on declared value)
     - Handling charges for special items
     - CGST + SGST / IGST
   - Credit note generation
   - Invoice templates (standard, minimal, detailed)

2. **Automated Invoice Delivery**
   
   **WhatsApp Business API Integration:**
   ```typescript
   // Send invoice automatically after booking
   {
     recipient: customer.phone,
     template: "invoice_generated",
     parameters: {
       customer_name: "John Doe",
       invoice_number: "INV-2026-001",
       amount: "₹1,250",
       payment_link: "https://pay.taccargo.com/INV-2026-001"
     },
     document: {
       filename: "TAC_Invoice_001.pdf",
       url: "https://storage.taccargo.com/invoices/001.pdf"
     }
   }
   ```
   
   **Multi-Channel Delivery:**
   - WhatsApp (primary, 95% open rate)
   - SMS (fallback)
   - Email (detailed copy with terms)
   - Portal download

3. **Payment Gateway Integration**
   - Razorpay / Stripe integration
   - Payment link in WhatsApp message
   - Real-time payment status webhook
   - Auto-reconciliation with invoice
   - COD tracking & settlement

4. **Financial Dashboard**
   - Daily/Weekly/Monthly revenue
   - Outstanding payments (aging analysis)
   - Payment collection rate
   - Service-wise revenue breakdown
   - Customer-wise profitability
   - Expense tracking (fuel, vehicle maintenance, staff)

---

### 2.7 Label Printing System

**Current:** Basic PDF generation  
**Target:** Industry-standard shipping labels

#### Key Features:

1. **Multi-Format Label Templates**

   **Shipping Label (4x6" thermal - FedEx/Amazon standard):**
   ```
   ┌─────────────────────────────────┐
   │ [TAC CARGO LOGO]    [BARCODE]   │
   │                                  │
   │ FROM:                            │
   │ TAC Cargo Hub, Delhi             │
   │ DEL                              │
   │                                  │
   │ TO:                              │
   │ John Doe                         │
   │ 123 MG Road                      │
   │ Bangalore, KA 560001             │
   │ IMF (Destination Hub Code)       │
   │                                  │
   │ [LARGE BARCODE: AWB]             │
   │ AWB: TAC1234567890              │
   │                                  │
   │ Service: Express  Weight: 2.5kg  │
   │ Pieces: 1/1      Date: 09-Jan    │
   └─────────────────────────────────┘
   ```
   
   **Key Elements:**
   - Customer name & address (NO phone for privacy)
   - Destination hub code (3-letter: DEL, BLR, IMF)
   - Large scannable barcode (Code 128)
   - AWB number (human-readable)
   - Service type indicator
   - Package number (if multi-piece)
   - Handling icons (fragile, liquid, etc.)

2. **Label Variants**
   - Standard shipping label (4x6")
   - Return label (pre-generated)
   - Pallet label (larger, 4 per pallet)
   - Location label (for warehouse bins)
   - Barcode-only label (A6 for internal tracking)

3. **Batch Printing**
   - Select multiple shipments
   - Print all labels in one go
   - Thermal printer support (Zebra, TSC, HPRT)
   - PDF generation for laser printers
   - Print preview with corrections

4. **Label Tracking**
   - Log every label print (user, time, printer)
   - Reprint protection (flag duplicate prints)
   - Label void functionality (cancel old labels)

---

### 2.8 Analytics & Reports Module

**Current:** None  
**Target:** Comprehensive BI dashboard

#### Key Features:

1. **Operational Analytics**
   
   **Delivery Performance:**
   - On-time delivery % (by service type, route, driver)
   - Average delivery time (trend over time)
   - First attempt delivery rate
   - Exception rate by type
   - SLA compliance dashboard
   
   **Volume Analytics:**
   - Daily/Weekly/Monthly shipment volume
   - Growth rate vs previous period
   - Seasonal trends
   - Service type distribution
   - Customer concentration (Pareto chart)

2. **Financial Analytics**
   - Revenue by service type
   - Revenue by customer segment
   - Average revenue per shipment
   - Profitability analysis (revenue vs costs)
   - Outstanding receivables aging

3. **Customer Analytics**
   - Customer lifetime value
   - Retention rate
   - Churn analysis
   - Net Promoter Score (NPS) trend
   - Complaint resolution time

4. **Operational Efficiency**
   - Warehouse utilization
   - Vehicle capacity utilization
   - Driver productivity
   - Staff performance metrics
   - Idle time analysis

5. **Predictive Analytics** (AI/ML)
   - Demand forecasting
   - Route optimization recommendations
   - Price optimization
   - Customer churn prediction
   - Exception probability scoring

6. **Custom Report Builder**
   - Drag-and-drop interface
   - 50+ data fields available
   - Multiple chart types
   - Scheduled email delivery
   - Export to Excel/PDF

---

## 3. AUTOMATION & NOTIFICATIONS

### 3.1 WhatsApp Business API Integration

**Critical Feature:** Paperless communication

#### Implementation:

1. **Setup:**
   - Partner with WhatsApp BSP (Twilio, MessageBird, or AiSensy)
   - Get business verification (green tick)
   - Create message templates
   - Store customer consent

2. **Automated Message Templates:**

   ```typescript
   // Template 1: Booking Confirmation
   {
     name: "booking_confirmed",
     language: "en",
     components: [{
       type: "body",
       text: "Hi {{1}}, your shipment booking is confirmed!\n\n" +
             "AWB: {{2}}\n" +
             "From: {{3}} to {{4}}\n" +
             "Service: {{5}}\n\n" +
             "Track: {{6}}"
     }]
   }
   
   // Template 2: Invoice Delivery
   {
     name: "invoice_ready",
     language: "en",
     components: [
       {
         type: "header",
         format: "document",
         document: {filename: "Invoice.pdf", url: "..."}
       },
       {
         type: "body",
         text: "Invoice {{1}} for ₹{{2}} is ready.\n\n" +
               "Pay now: {{3}}"
       },
       {
         type: "button",
         sub_type: "url",
         index: 0,
         parameters: [{type: "text", text: "payment_link"}]
       }
     ]
   }
   
   // Template 3: Tracking Update
   {
     name: "status_update",
     language: "en",
     components: [{
       type: "body",
       text: "Your package {{1}} is {{2}}\n\n" +
             "Location: {{3}}\n" +
             "Time: {{4}}\n\n" +
             "Track: {{5}}"
     }]
   }
   
   // Template 4: Out for Delivery
   {
     name: "out_for_delivery",
     language: "en",
     components: [{
       type: "body",
       text: "Good news! Your package {{1}} is out for delivery today.\n\n" +
             "Driver: {{2}}\n" +
             "Phone: {{3}}\n" +
             "ETA: {{4}}\n\n" +
             "Ensure someone is available to receive."
     }]
   }
   
   // Template 5: Delivered + Feedback
   {
     name: "delivery_confirmation",
     language: "en",
     components: [
       {
         type: "body",
         text: "Delivered successfully! ✅\n\n" +
               "Package: {{1}}\n" +
               "Received by: {{2}}\n" +
               "Time: {{3}}\n\n" +
               "How was your experience?"
       },
       {
         type: "button",
         sub_type: "quick_reply",
         index: 0,
         parameters: [{type: "text", text: "Excellent 😊"}]
       },
       {
         type: "button",
         sub_type: "quick_reply",
         index: 1,
         parameters: [{type: "text", text: "Good 👍"}]
       },
       {
         type: "button",
         sub_type: "quick_reply",
         index: 2,
         parameters: [{type: "text", text: "Need Help ❓"}]
       }
     ]
   }
   ```

3. **Trigger Points:**
   - Booking created → Send confirmation + invoice
   - Payment received → Send receipt
   - Package picked up → Update notification
   - Hub arrival/departure → Status update
   - Out for delivery → Driver details + ETA
   - Delivered → Confirmation + feedback request
   - Exception → Alert with resolution steps

4. **Interactive Features:**
   - Quick reply buttons
   - URL buttons (Track, Pay, Download)
   - Catalog sharing (for rate cards)
   - Chatbot for FAQs

### 3.2 SMS & Email Fallback

- If WhatsApp delivery fails → Auto-send SMS
- Email for detailed communication (terms, reports)
- Customer preference management

---

## 4. MOBILE EXPERIENCE

### 4.1 Progressive Web App (PWA)

**Target:** Mobile-first for field operations

#### Features:

1. **Driver Mobile App**
   - View assigned manifest
   - Navigate to delivery addresses (Google Maps integration)
   - Scan package barcode to update status
   - Capture POD signature
   - Take delivery photo
   - Mark exceptions (address not found, customer unavailable)
   - COD collection tracking
   - Offline mode (sync when online)

2. **Warehouse Staff App**
   - Scan to receive packages
   - Scan to pick packages for manifest
   - Location barcode scanning
   - Quality check interface
   - Real-time inventory updates

3. **Customer Mobile Web**
   - Responsive tracking page
   - Push notifications
   - Quick booking
   - Address book
   - Payment integration

### 4.2 Barcode Scanning (Critical Feature)

**Implementation:**
```typescript
// Use html5-qrcode or QuaggaJS
import { Html5Qrcode } from "html5-qrcode";

const scanner = new Html5Qrcode("reader");

// Desktop: USB scanner (HID device)
// Mobile: Camera with auto-focus

function onScanSuccess(decodedText) {
  // 1. Validate barcode format
  // 2. API call to fetch shipment details
  // 3. Show confirmation modal
  // 4. Update status
  // 5. Audio/haptic feedback
}

// Barcode formats supported:
// - Code 128 (primary for AWB)
// - QR Code (for location labels)
// - EAN-13 (for products)
```

---

## 5. SECURITY & COMPLIANCE

### 5.1 Security Features

1. **Authentication & Authorization**
   - Supabase Auth with Row Level Security (RLS)
   - Role-based access control (Admin, Manager, Staff, Driver, Customer)
   - Multi-factor authentication (MFA) for admin
   - Session management with auto-logout
   - API key management for integrations

2. **Data Protection**
   - HTTPS enforced (TLS 1.3)
   - Database encryption at rest
   - PII masking in logs
   - Privacy-compliant labels (no phone numbers)
   - GDPR-ready data export/deletion

3. **Audit Logging**
   - Log all shipment status changes
   - Track label prints
   - Record manual edits
   - Payment transaction logs
   - Login attempts and access logs

### 5.2 Compliance

1. **GST Compliance**
   - GSTIN validation
   - HSN/SAC codes
   - E-way bill generation
   - GSTR-1 report export

2. **Industry Standards**
   - ISO 9001 (Quality Management)
   - ISO 28000 (Supply Chain Security)
   - GS1-128 barcode compliance

---

## 6. PERFORMANCE OPTIMIZATION

### 6.1 Frontend Optimization

```typescript
// Critical optimizations
1. Code splitting (dynamic imports)
2. Image optimization (next/image)
3. React Query for data caching
4. Virtual scrolling for large tables (TanStack Virtual)
5. Web Workers for barcode processing
6. Service Worker for offline support
7. CDN for static assets
8. Lazy loading for charts
9. Debounced search inputs
10. Memoization for expensive calculations
```

### 6.2 Backend Optimization

```typescript
// Database optimizations
1. Indexed columns (shipment_id, awb, customer_id, timestamp)
2. Materialized views for analytics
3. Redis caching for frequently accessed data
4. Database connection pooling
5. Query optimization (EXPLAIN ANALYZE)
6. Partitioning for large tables (by date)
7. Archive old data (>1 year)
8. CDN for invoice PDFs
9. Rate limiting on APIs
10. WebSocket connection management
```

---

## 7. IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Weeks 1-4)
- [ ] Enhanced database schema
- [ ] Real-time tracking table
- [ ] Warehouse location system
- [ ] Basic barcode scanning
- [ ] Improved invoice generation
- [ ] Label printing templates

### Phase 2: Automation (Weeks 5-8)
- [ ] WhatsApp Business API integration
- [ ] Automated notifications
- [ ] SMS/Email fallback
- [ ] Payment gateway integration
- [ ] Enhanced manifest system
- [ ] Driver assignment workflow

### Phase 3: Intelligence (Weeks 9-12)
- [ ] Route optimization engine
- [ ] AI-powered package assignment
- [ ] Predictive analytics
- [ ] Exception management system
- [ ] Customer portal
- [ ] Public tracking page

### Phase 4: Advanced Features (Weeks 13-16)
- [ ] Warehouse management system
- [ ] Location-based inventory
- [ ] Mobile PWA (driver app)
- [ ] Geospatial tracking
- [ ] Performance analytics dashboard
- [ ] Custom report builder

### Phase 5: Polish & Scale (Weeks 17-20)
- [ ] Load testing & optimization
- [ ] Security hardening
- [ ] Comprehensive documentation
- [ ] User training materials
- [ ] API documentation
- [ ] Production deployment

---

## 8. KEY PERFORMANCE INDICATORS (KPIs)

### Operational KPIs
- **On-Time Delivery Rate:** >95%
- **First Attempt Delivery:** >85%
- **Average Delivery Time:** <24h (Express), <48h (Standard)
- **Exception Rate:** <5%
- **Package Accuracy:** >99.5%
- **Warehouse Capacity Utilization:** 70-85%
- **Vehicle Utilization:** >80%

### Customer Experience KPIs
- **Customer Satisfaction (CSAT):** >4.5/5
- **Net Promoter Score (NPS):** >50
- **Tracking Page Visits:** >70% of customers
- **WhatsApp Message Open Rate:** >90%
- **Invoice Payment Time:** <7 days

### System Performance KPIs
- **Page Load Time:** <2 seconds
- **API Response Time:** <500ms (95th percentile)
- **System Uptime:** >99.9%
- **Barcode Scan Success Rate:** >98%
- **Mobile App Crash Rate:** <1%

---

## 9. DETAILED UI/UX SPECIFICATIONS

### 9.1 Design System Enhancement

**Current:** Basic Shadcn components  
**Target:** Custom design system with logistics-specific components

#### Color Palette
```css
/* Primary Colors */
--primary-blue: #0066CC;     /* Trust, Stability */
--primary-green: #00C853;    /* Success, Delivered */
--primary-orange: #FF6B00;   /* Alert, In-Transit */
--primary-red: #E53935;      /* Error, Exception */

/* Status Colors */
--status-booked: #2196F3;
--status-transit: #FF9800;
--status-delivered: #4CAF50;
--status-exception: #F44336;
--status-cancelled: #9E9E9E;

/* Neutral Colors */
--neutral-900: #1A1A1A;      /* Text primary */
--neutral-700: #4A4A4A;      /* Text secondary */
--neutral-300: #D1D5DB;      /* Borders */
--neutral-100: #F3F4F6;      /* Backgrounds */
--neutral-50: #F9FAFB;       /* Cards */

/* Glassmorphism */
--glass-bg: rgba(255, 255, 255, 0.1);
--glass-border: rgba(255, 255, 255, 0.2);
--glass-blur: blur(10px);
```

#### Typography
```css
/* Font Stack */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Courier New', monospace;

/* Type Scale */
--text-xs: 0.75rem;    /* 12px - Labels */
--text-sm: 0.875rem;   /* 14px - Body small */
--text-base: 1rem;     /* 16px - Body */
--text-lg: 1.125rem;   /* 18px - Subheading */
--text-xl: 1.25rem;    /* 20px - Heading 3 */
--text-2xl: 1.5rem;    /* 24px - Heading 2 */
--text-3xl: 1.875rem;  /* 30px - Heading 1 */
--text-4xl: 2.25rem;   /* 36px - Display */
```

#### Component Library (Logistics-Specific)

1. **StatusBadge Component**
```tsx
<StatusBadge 
  status="in_transit" 
  icon={<TruckIcon />}
  pulse={true} // animated pulse for active statuses
/>
```

2. **TrackingTimeline Component**
```tsx
<TrackingTimeline events={[
  {
    status: 'booked',
    location: 'Delhi Hub',
    timestamp: '2026-01-09T10:00:00Z',
    user: 'System',
    icon: <PackageIcon />
  },
  {
    status: 'in_transit',
    location: 'Mumbai Hub',
    timestamp: '2026-01-09T18:30:00Z',
    user: 'Scanner #42',
    icon: <TruckIcon />,
    current: true // highlights current status
  }
]} />
```

3. **ScannerInput Component**
```tsx
<ScannerInput
  onScan={(barcode) => handleScan(barcode)}
  autoFocus={true}
  scannerType="usb" // or "camera"
  validation={(code) => /^TAC\d{10}$/.test(code)}
  audioFeedback={true}
  hapticFeedback={true} // mobile only
/>
```

4. **ShipmentCard Component**
```tsx
<ShipmentCard
  awb="TAC1234567890"
  status="in_transit"
  from="Delhi"
  to="Bangalore"
  customer="ABC Corp"
  weight="2.5 kg"
  eta="2026-01-10 15:00"
  priority={true}
  onAction={(action) => handleAction(action)}
  actions={['track', 'print_label', 'update_status']}
/>
```

5. **VehicleMapMarker Component**
```tsx
<VehicleMapMarker
  vehicle={{
    id: 'VEH-001',
    registration: 'MH-12-AB-1234',
    driver: 'Rajesh Kumar',
    location: [28.7041, 77.1025],
    status: 'moving', // moving, stopped, idle
    packages: 32,
    eta: '14:30'
  }}
  onClick={() => showVehicleDetails()}
/>
```

6. **MetricCard Component**
```tsx
<MetricCard
  title="Total Shipments"
  value={1247}
  change={+12.5} // percentage change
  trend="up" // up, down, neutral
  icon={<PackageIcon />}
  color="blue"
  subtitle="vs last week"
  loading={false}
/>
```

### 9.2 Responsive Design Breakpoints

```css
/* Mobile First Approach */
--mobile: 0px;        /* 320px+ */
--tablet: 640px;      /* sm */
--desktop: 1024px;    /* lg */
--wide: 1280px;       /* xl */
--ultrawide: 1536px;  /* 2xl */

/* Layout Examples */
/* Mobile: Single column, bottom nav */
/* Tablet: Sidebar collapsed, 2 columns */
/* Desktop: Full sidebar, 3-4 columns */
/* Wide: Max content width 1400px */
```

### 9.3 Accessibility (WCAG 2.1 AA)

- [ ] Keyboard navigation (all interactive elements)
- [ ] Screen reader support (ARIA labels)
- [ ] Color contrast ratio >4.5:1
- [ ] Focus indicators (visible outline)
- [ ] Alt text for all images
- [ ] Form labels and error messages
- [ ] Skip to content link
- [ ] Resizable text (up to 200%)

---

## 10. INTEGRATION SPECIFICATIONS

### 10.1 Third-Party Integrations

#### Google Maps API
```typescript
// Services needed:
1. Places API (address autocomplete)
2. Geocoding API (lat/lng conversion)
3. Directions API (route optimization)
4. Distance Matrix API (ETA calculation)
5. Maps JavaScript API (visualization)

// Usage limits:
- 25,000 requests/day (free tier)
- Consider paid plan for production
```

#### WhatsApp Business API
```typescript
// Provider: Twilio / MessageBird / AiSensy
// Pricing: ~$0.005 - $0.02 per message
// Templates: Need pre-approval (24-48h)
// Rate limits: Tier-based (1K - 100K/day)
```

#### Payment Gateway
```typescript
// Razorpay Integration
{
  amount: 125000, // in paise (₹1,250)
  currency: "INR",
  receipt: "INV-2026-001",
  notes: {
    shipment_id: "SHP-2026-001",
    customer_id: "CUST-123"
  }
}

// Webhook events:
- payment.captured
- payment.failed
- refund.created
```

#### SMS Gateway
```typescript
// Providers: Twilio / MSG91 / Kaleyra
// Use case: WhatsApp fallback
// Rate: ₹0.10 - ₹0.25 per SMS
```

### 10.2 API Endpoints (Complete List)

#### Shipments
```
POST   /api/v1/shipments                 Create shipment
GET    /api/v1/shipments                 List shipments (paginated)
GET    /api/v1/shipments/:id             Get shipment details
PUT    /api/v1/shipments/:id             Update shipment
DELETE /api/v1/shipments/:id             Cancel shipment
GET    /api/v1/shipments/:id/timeline    Get tracking timeline
POST   /api/v1/shipments/:id/status      Update status
GET    /api/v1/shipments/awb/:awb        Get by AWB number
POST   /api/v1/shipments/bulk            Bulk create (CSV)
GET    /api/v1/shipments/:id/label       Generate label PDF
GET    /api/v1/shipments/:id/invoice     Generate invoice PDF
```

#### Manifests
```
POST   /api/v1/manifests                 Create manifest
GET    /api/v1/manifests                 List manifests
GET    /api/v1/manifests/:id             Get manifest details
PUT    /api/v1/manifests/:id             Update manifest
POST   /api/v1/manifests/:id/close       Close manifest
POST   /api/v1/manifests/:id/shipments   Add shipments to manifest
DELETE /api/v1/manifests/:id/shipments/:shipmentId Remove shipment
GET    /api/v1/manifests/:id/route       Get optimized route
POST   /api/v1/manifests/:id/assign      Assign driver
```

#### Tracking
```
POST   /api/v1/tracking/scan             Record barcode scan
POST   /api/v1/tracking/event            Create tracking event
GET    /api/v1/tracking/shipment/:id     Get all events for shipment
POST   /api/v1/tracking/location         Update GPS location
GET    /api/v1/tracking/live             Get live vehicle positions
```

#### Invoices
```
POST   /api/v1/invoices                  Generate invoice
GET    /api/v1/invoices/:id              Get invoice details
PUT    /api/v1/invoices/:id              Update invoice
POST   /api/v1/invoices/:id/send         Send invoice (WhatsApp/Email)
POST   /api/v1/invoices/:id/payment      Record payment
GET    /api/v1/invoices/:id/pdf          Download invoice PDF
```

#### Customers
```
POST   /api/v1/customers                 Create customer
GET    /api/v1/customers                 List customers
GET    /api/v1/customers/:id             Get customer details
PUT    /api/v1/customers/:id             Update customer
GET    /api/v1/customers/:id/shipments   Get customer shipments
GET    /api/v1/customers/:id/invoices    Get customer invoices
POST   /api/v1/customers/:id/addresses   Add address
```

#### Warehouse
```
POST   /api/v1/warehouse/locations       Create location
GET    /api/v1/warehouse/locations       List locations
POST   /api/v1/warehouse/inbound         Record inbound package
POST   /api/v1/warehouse/outbound        Record outbound package
GET    /api/v1/warehouse/inventory       Get current inventory
GET    /api/v1/warehouse/search          Search package location
```

#### Notifications
```
POST   /api/v1/notifications/send        Send notification
GET    /api/v1/notifications/:id/status  Check delivery status
GET    /api/v1/notifications/logs        Get notification logs
POST   /api/v1/notifications/template    Create template
```

#### Analytics
```
GET    /api/v1/analytics/kpis            Get dashboard KPIs
GET    /api/v1/analytics/revenue         Revenue analytics
GET    /api/v1/analytics/performance     Delivery performance
GET    /api/v1/analytics/customers       Customer analytics
GET    /api/v1/analytics/export          Export report (CSV/Excel)
```

#### Rates
```
POST   /api/v1/rates/calculate           Calculate freight charges
GET    /api/v1/rates/zones               Get zone-based rates
PUT    /api/v1/rates/update              Update rate card
```

---

## 11. TESTING STRATEGY

### 11.1 Testing Pyramid

```
                    ┌─────────┐
                    │   E2E   │ 10% (Critical user flows)
                    │ Testing │
                 ┌─────────────────┐
                 │  Integration    │ 30% (API + DB)
                 │    Testing      │
              ┌─────────────────────────┐
              │     Unit Testing        │ 60% (Functions, Utils)
              │   (Jest + React Testing │
              │       Library)          │
              └─────────────────────────┘
```

### 11.2 Test Coverage Requirements

- **Unit Tests:** >80% coverage
- **Integration Tests:** All API endpoints
- **E2E Tests:** 20+ critical user journeys
- **Performance Tests:** Load testing with 1000+ concurrent users
- **Security Tests:** Penetration testing, OWASP Top 10

### 11.3 Critical Test Scenarios

1. **Shipment Creation Flow**
   - Valid shipment creation
   - Validation errors handling
   - Duplicate AWB prevention
   - Invoice generation
   - Label printing
   - WhatsApp notification delivery

2. **Barcode Scanning**
   - Valid barcode scan
   - Invalid barcode handling
   - Duplicate scan prevention
   - Offline scan queue
   - Batch scanning performance

3. **Manifest Creation**
   - Auto-optimization algorithm
   - Manual shipment addition
   - Driver assignment
   - Route calculation
   - Capacity validation

4. **Real-time Tracking**
   - WebSocket connection stability
   - Event ordering
   - Geolocation accuracy
   - Map rendering performance

5. **Payment Flow**
   - Payment link generation
   - Webhook handling
   - Reconciliation
   - Refund processing

---

## 12. DEPLOYMENT & INFRASTRUCTURE

### 12.1 Infrastructure Requirements

```yaml
Production Environment:
  
  Frontend:
    - Vercel / Netlify (Edge deployment)
    - CDN: Cloudflare
    - SSL: Auto-renewed (Let's Encrypt)
  
  Backend:
    - Supabase (PostgreSQL + Realtime + Auth)
    - Redis: Upstash or Redis Cloud (caching)
    - File Storage: S3-compatible (Supabase Storage)
  
  Monitoring:
    - Sentry (Error tracking)
    - PostHog / Mixpanel (Analytics)
    - Uptime Robot (Availability)
    - LogRocket (Session replay)
  
  CI/CD:
    - GitHub Actions
    - Automated testing on PR
    - Preview deployments
    - Production deployment on merge to main
```

### 12.2 Scaling Considerations

**Expected Load:**
- 10,000 shipments/day
- 50,000 tracking events/day
- 100,000 API requests/day
- 1,000 concurrent users (peak)

**Database Optimization:**
- Connection pooling (Supabase Pooler)
- Read replicas for analytics
- Automated backups (hourly incremental, daily full)
- Point-in-time recovery (PITR)

**Caching Strategy:**
```typescript
// Cache layers
1. Browser cache (static assets, 1 year)
2. CDN cache (API responses, 5 minutes)
3. Redis cache (hot data, 1 hour)
4. Database query cache (complex joins)
```

---

## 13. DOCUMENTATION REQUIREMENTS

### 13.1 Technical Documentation
- [ ] System architecture diagram
- [ ] Database ERD
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Component library (Storybook)
- [ ] Deployment guide
- [ ] Troubleshooting guide

### 13.2 User Documentation
- [ ] Admin user manual
- [ ] Driver app guide
- [ ] Customer portal guide
- [ ] Video tutorials (Loom/YouTube)
- [ ] FAQ section
- [ ] Keyboard shortcuts reference

### 13.3 Developer Documentation
- [ ] Setup guide (README.md)
- [ ] Contribution guidelines
- [ ] Code style guide
- [ ] Testing guidelines
- [ ] Release process

---

## 14. SUCCESS METRICS

### After 3 Months of Production:
- [ ] System handles 10,000+ shipments/day
- [ ] 95%+ on-time delivery rate
- [ ] 90%+ WhatsApp message delivery rate
- [ ] <2s page load time
- [ ] 99.9% uptime
- [ ] <1% error rate
- [ ] 85%+ customer satisfaction
- [ ] 50% reduction in paper invoice usage
- [ ] 30% improvement in operational efficiency
- [ ] 20+ hours/week saved in manual data entry

---

## 15. BUDGET ESTIMATION

### Development Costs (4-5 months)
- **Full-Stack Developer (2):** $30,000 - $50,000
- **UI/UX Designer (1):** $10,000 - $15,000
- **QA Engineer (1):** $8,000 - $12,000
- **DevOps/Backend (1):** $12,000 - $18,000

**Total Development:** $60,000 - $95,000

### Infrastructure Costs (Monthly)
- Vercel Pro: $20
- Supabase Pro: $25
- Upstash Redis: $10
- Cloudflare Pro: $20
- WhatsApp Business API: $200 (based on volume)
- SMS Gateway: $100
- Google Maps API: $100
- Monitoring Tools: $50
- Domain & SSL: $5

**Total Monthly:** ~$530

### Annual Infrastructure: ~$6,360

---

## 16. CONCLUSION

This PRD transforms TAC Cargo from a 1/10 basic tracking system to a **10/10 enterprise-grade logistics platform** that:

✅ **Matches industry leaders** (FedEx, DHL, Amazon Logistics)  
✅ **Automates 80% of manual tasks** (invoicing, notifications, tracking)  
✅ **Enables paperless operations** (WhatsApp invoices, digital labels)  
✅ **Provides real-time visibility** (live tracking, geolocation, inventory)  
✅ **Scales to 100,000+ shipments/month**  
✅ **Delivers exceptional UX** (mobile-first, barcode scanning, one-click actions)  
✅ **Industry-standard compliance** (GST, ISO, GS1 barcodes)  

### Immediate Next Steps:

1. **Review & Approve PRD** (Stakeholders)
2. **Hire Development Team** (or assign internal resources)
3. **Setup Infrastructure** (Supabase, Vercel, WhatsApp API)
4. **Begin Phase 1** (Foundation - 4 weeks)
5. **Weekly Progress Reviews**
6. **Beta Testing** (Week 16)
7. **Production Launch** (Week 20)

### Long-Term Vision (12 months):
- AI-powered demand forecasting
- Multi-country expansion
- Blockchain-based proof of delivery
- Carbon footprint tracking
- Customer mobile app (iOS/Android)
- IoT integration (smart lockers, temperature monitoring)

**This is your roadmap from MVP to market leader. Let's build it! 🚀**