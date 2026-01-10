# Automated Invoice & AWB Label System

## Overview

This system provides a complete solution for generating invoices and AWB (Air Waybill) shipping labels for the TAC Cargo Service. It includes:

- **Auto-generated Invoice & AWB Numbers** - Unique, sequential IDs
- **3-Section Invoice Form** - Consignor/Consignee, Package Details, Payment
- **Auto-Calculations** - Volumetric weight, GST, totals
- **Address Autocomplete** - Indian cities with priority for Imphal/Delhi
- **Amazon-style AWB Labels** - With barcodes and QR codes
- **PDF Generation** - Client-side PDF creation
- **WhatsApp & Email Integration** - Send invoices directly to customers

## Installation

The following packages were installed:

```bash
npm install jspdf jspdf-autotable jsbarcode react-google-places-autocomplete @react-google-maps/api html2canvas
```

## Environment Variables

Add these to your `.env.local` file:

```env
# Google Places API (for address autocomplete)
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_api_key

# WhatsApp Business API (Meta Cloud API)
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id

# Email Service (Resend or SendGrid)
RESEND_API_KEY=your_resend_api_key
# OR
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=billing@taccargo.com
EMAIL_FROM_NAME=TAC Cargo Service

# App URL (for tracking links)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## File Structure

```
lib/invoice/
├── id-generator.ts      # Invoice/AWB number generation
├── calculations.ts      # Volumetric weight, GST calculations
├── indian-cities.ts     # City/State data with priorities
├── pdf-generator.ts     # jsPDF-based PDF generation
└── index.ts             # Module exports

components/invoice/
├── awb-label.tsx           # Amazon-style shipping label
├── invoice-document.tsx    # Invoice document component
├── address-autocomplete.tsx # City autocomplete with Indian cities
├── invoice-creation-form.tsx # 4-step invoice creation wizard
├── invoice-share-buttons.tsx # WhatsApp/Email share buttons
└── index.ts                 # Component exports

app/actions/
└── invoice-enhanced.ts     # Server actions for invoice CRUD

lib/services/
└── notification-service.ts # WhatsApp & Email integration

app/api/invoices/send/
└── route.ts               # API route for sending notifications
```

## Usage

### Create Invoice Page

Navigate to `/dashboard/invoices/create` to use the invoice creation wizard.

### Programmatic Usage

```tsx
import { InvoiceCreationForm } from "@/components/invoice";

// Use the full form wizard
<InvoiceCreationForm />
```

### Generate PDFs

```tsx
import { generateInvoicePDF, generateAWBLabelPDF, downloadPDF } from "@/lib/invoice";

// Generate and download invoice
const invoiceDoc = generateInvoicePDF(invoiceData);
downloadPDF(invoiceDoc, `Invoice-${invoiceNo}.pdf`);

// Generate and download label
const labelDoc = generateAWBLabelPDF(labelData);
downloadPDF(labelDoc, `AWB-${awbNo}.pdf`);
```

### Send via WhatsApp

```tsx
import { sendInvoiceWhatsApp } from "@/app/actions/invoice-enhanced";

const result = await sendInvoiceWhatsApp(invoiceId);
if (result.success) {
  window.open(result.data.shareLink, "_blank");
}
```

### Share Buttons Component

```tsx
import { InvoiceShareButtons } from "@/components/invoice";

<InvoiceShareButtons
  invoiceId={invoice.id}
  invoiceNo={invoice.invoice_no}
  awbNo={invoice.awb_no}
  recipientPhone={invoice.consignee_phone}
  recipientEmail={invoice.consignee_email}
  totalAmount={invoice.total_amount}
/>
```

## Calculations

### Volumetric Weight Formula

```
Volumetric Weight = (Length × Width × Height) / Volumetric Factor

Factors:
- Air: 6000
- Surface: 4000
- Express: 5000
```

### GST Calculation

- **Intra-State**: CGST (9%) + SGST (9%) = 18%
- **Inter-State**: IGST (18%)

## Invoice Number Formats

- **Invoice**: `INV-YYYYMM-XXXXXX` (e.g., INV-202501-A1B2C3D4)
- **AWB**: `TACXXXXXXXXXX` (13 characters, barcode-compatible)
- **Consignment**: `TAYY#####` (e.g., TA2500001)

## Label Design

The AWB label follows Amazon's shipping label design:
- 4×6 inch format (standard shipping label)
- Code128 barcode for AWB number
- QR code with shipment details
- Delivery station codes
- Sort zone information
- Terms disclaimer

## Terms and Conditions

The invoice includes 9 standard terms covering:
1. Item declaration requirements
2. Prohibited items policy
3. Damage compensation (₹150/kg)
4. Insurance for fragile items
5. Collection timeline (1 week)
6. Unclaimed items policy (45 days)
7. Godown charges (₹5/day after 21 days)
8. Disposal policy (100 days)
9. Jurisdiction (Delhi)

## API Endpoints

### POST /api/invoices/send
Send invoice notification via WhatsApp/Email.

**Request:**
```json
{
  "invoiceId": "uuid",
  "channels": ["whatsapp", "email"]
}
```

**Response:**
```json
{
  "message": "Notification sent",
  "results": {
    "whatsapp": { "success": true, "messageId": "..." },
    "email": { "success": true, "messageId": "..." }
  },
  "shareLinks": {
    "whatsapp": "https://wa.me/...",
    "email": "mailto:..."
  }
}
```

### GET /api/invoices/send?invoiceId=xxx
Get share links for client-side sharing.

## Database Schema

The system uses the existing `invoices` table with these key columns:
- `invoice_no`, `awb_no`, `barcode_data`
- `shipper_*`, `consignee_*` details
- Weight fields: `total_weight`, `total_volumetric_weight`, `chargeable_weight`
- Charges: `freight_charge`, `pickup_charge`, `packing_charge`, etc.
- Tax: `cgst`, `sgst`, `igst`, `total_tax`
- PDF URLs: `invoice_pdf_url`, `label_pdf_url`
- WhatsApp tracking: `sent_via_whatsapp_at`

## Future Enhancements

1. **Cloud PDF Storage** - Upload PDFs to Supabase Storage
2. **Webhook Notifications** - Automated notifications on shipment events
3. **Bulk Invoice Generation** - Generate multiple invoices at once
4. **Template Customization** - Allow custom invoice templates
5. **Multi-language Support** - Hindi, Bengali, etc.
