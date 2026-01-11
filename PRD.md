# Product Requirements Document (PRD): CargoFlow Invoice System

## 1. Executive Summary
The **CargoFlow Invoice System** is a high-precision, enterprise-grade web application designed for the logistics sector (specifically TAC Cargo). It facilitates the rapid creation of tax invoices and shipping labels with automated volumetric calculations, real-time pricing, and print-ready outputs. The system emphasizes speed, accuracy, and a distinct "Amazon-style" professional aesthetic.

## 2. Product Objectives
- **Zero-Error Calculation:** Automate complex freight logic (Volumetric vs. Actual weight) to prevent revenue leakage.
- **Speed:** Enable sub-60-second invoice generation for walk-in customers.
- **Brand Consistency:** Ensure all path-to-purchase documents (Invoices, Labels) adhere to strict brand guidelines (Slate/Blue/Orange palette, clean typography).
- **Print Optimization:** generate A4 invoices and 4x6 labels perfectly aligned for thermal and laser printers.

## 3. User Stories
| Actor | Goal | Benefit |
| :--- | :--- | :--- |
| **Logistics Manager** | Create a shipment record with consignor/consignee details | Generates a legally compliant Tax Invoice. |
| **Warehouse Packer** | Print a standard shipping label with routing code and barcode | Ensures the package is routed to the correct destination hub (e.g., IMP/04). |
| **Accountant** | View real-time breakdown of GST and Freight charges | Ensures accurate taxation and billing transparency. |

## 4. Functional Requirements

### 4.1. Shipment Data Input
*   **Consignor/Consignee:**
    *   Fields: Name, Entity Identity, Address (Line 1), City (Dropdown), State (Dropdown), Pincode (6-digit validation), Phone, Email.
    *   *Constraint:* City and State must be selected from a predefined list of operational hubs (e.g., Imphal, New Delhi).
*   **Package Details:**
    *   **Dynamic Item List:** Add/Remove multiple package units.
    *   **Dimensions:** Length, Width, Height (cm).
    *   **Weight:** Actual Weight (kg).
    *   **Meta:** Nature of Quantity (e.g., "Others"), Declared Value, Remarks.
*   **Pricing & Taxation:**
    *   **Base Rate:** Rate per Kg input.
    *   **Ancillary Charges:** Pickup, Packing, Docket, Insurance fees.
    *   **Taxation:** GST Rate (%) selection.
    *   **Financials:** Advance Paid input.

### 4.2. Business Logic & Calculations (Critical)
*   **Volumetric Weight:**
    *   Formula: `(Length × Width × Height) / 5000` (Divisor configurable, default 5000).
*   **Billable Weight:**
    *   Logic: `Max(Total Actual Weight, Total Volumetric Weight)`.
*   **Freight Calculation:**
    *   Formula: `Billable Weight × Rate Per Kg`.
*   **Taxable Amount:**
    *   Formula: `Freight + Pickup + Packing + Docket + Insurance`.
*   **GST Calculation:**
    *   Formula: `Taxable Amount × (GST Rate / 100)`.
*   **Grand Total:**
    *   Formula: `Taxable Amount + GST Amount`.
*   **Balance Payable:**
    *   Formula: `Grand Total - Advance Paid`.

### 4.3. Output Generation
*   **Invoice View (A4):**
    *   Amazon-style layout with high information density.
    *   **Header:** Logo, GSTIN, Seller Address.
    *   **Barcode:** `TAC-{InvoiceID}` (Code 128 standard).
    *   **Tables:** Itemized detailed breakdown with Surcharge row.
    *   **Footer:** Bank operational details, Terms & Conditions, Digital Signature placeholder.
*   **Label View (4x6 / 100mm):**
    *   **Routing Code:** Large specific routing identifier (e.g., IMP-001).
    *   **Visuals:** Large AWB number, QR Code for tracking.
    *   **Destination:** Clear "Deliver To" block with highly readable font.

## 5. Non-Functional Requirements
*   **Performance:** Calculations must update in real-time (<16ms response).
*   **Reliability:** Offline-first capability (state preserved during entry).
*   **Design System:** Strict adherence to "Enterprise Console" aesthetic.
    *   **Colors:** Slate-900 (Primary), Blue-600 (Action), Orange-500 (Accent).
    *   **Typography:** Inter/Sans-serif. High usage of `uppercase`, `tracking-widest`, and `font-black` (800/900 weight) for headers.
*   **Printability:** CSS `@media print` rules must hide UI chrome (navbars, buttons) and ensure exact margins (210mm width for invoice).

## 6. Technical Architecture

### 6.1. Tech Stack
*   **Framework:** React (Vite)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (v3.4+)
*   **Icons:** Lucide React
*   **Date Handling:** Intl.DateTimeFormat
*   **Barcode/QR:** External API (e.g., `api.qrserver.com`) or local libs (`qrcode.react`, `libre-barcode`).

### 6.2. Data Models (TypeScript)

```typescript
interface Address {
  name: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
}

interface PackageItem {
  id: string;
  description: string;
  length: number;
  width: number;
  height: number;
  actualWeight: number;
}

interface ShipmentData {
  invoiceId: string;
  awbNumber: string;
  consignor: Address;
  consignee: Address;
  items: PackageItem[];
  volumetricFactor: number; // default 5000
  ratePerKg: number;
  gstRate: number;
  // Charges
  pickupCharge: number;
  packingCharge: number;
  docketCharges: number;
  insuranceCharge: number;
  advancePaid: number;
}
```

## 7. Implementation Plan (Step-by-Step)

### Phase 1: Foundation & Setup
1.  **Initialize Project:** Setup Vite + React + TypeScript.
2.  **Install Dependencies:** `npm install lucide-react clsx tailwind-merge`.
3.  **Configure Tailwind:** Set up fonts (Inter) and custom colors in `tailwind.config.js`.
4.  **Define Types:** Create `types.ts` with the interfaces defined above.

### Phase 2: Core Components
5.  **AddressSection Component:**
    *   Build a reusable card with inputs for Entity, Location, City/State (Select), and Contact.
    *   Implement hover effects (`hover:shadow-xl`) and rounded styling (`rounded-[2.5rem]`).
6.  **Package Form:**
    *   Create the dynamic table for items.
    *   Implement the "Add Another Unit" logic using `Math.random()` or `crypto.randomUUID()` for IDs.

### Phase 3: Logic Engine
7.  **Hook Implementation:**
    *   In `App.tsx`, implement the `useMemo` hook to handle all calculations (Volumetric, Billable, Tax, Totals).
    *   *Crucial:* Ensure the `Math.max` logic for billable weight is robust.
8.  **ID Generators:**
    *   Implement `generateInvoiceId()` (Format: INV-YY-RND) and `generateAWB()` (Format: 365+RND).

### Phase 4: Output Views
9.  **Label Component (`LabelPreview.tsx`):**
    *   Design the 100mm wide card.
    *   Integrate the QR code image source.
    *   Style the "Routing" and "Station Code" blocks for high visibility.
10. **Invoice View (In `App.tsx`):**
    *   Build the A4 container (`width: 210mm`, `min-height: 297mm`).
    *   Implement the detailed structure: Header -> Meta -> Address -> Item Table -> Surcharges -> Summary -> Footer.
    *   Apply the specific "Amazon-style" CSS classes (`border-slate-900`, `tracking-widest`).

### Phase 5: Polish & Print
11. **Navigation:** Build the "Enterprise Console" navbar using `glass` effects.
12. **Print Styles:**
    *   Add `@media print` in `index.css`.
    *   Hide `.no-print` elements (Nav, Form).
    *   Ensure background graphics are printed (`-webkit-print-color-adjust: exact`).
13. **Final Review:** Verify calculations against manual checks.

## 8. UX/UI Specifications (Deep Dive)
*   **Shadows:** Use soft, diffused shadows (`shadow-2xl`, `shadow-blue-500/10`) to create depth on the form cards.
*   **Input Fields:** Large touch targets (`p-4`), rounded corners (`rounded-2xl`), and subtle background colors (`bg-slate-50`) that turn white on focus.
*   **Typography Hierarchy:**
    *   *Labels:* `text-[9px] font-black uppercase tracking-[0.2em] text-slate-400`
    *   *Values:* `text-sm font-black text-slate-700`
    *   *Totals:* `text-2xl font-black tracking-tighter`
