# TAC Cargo - Complete Setup Guide

## 🚀 Quick Start

This guide will help you set up TAC Cargo from scratch with all enterprise features enabled.

---

## 📋 Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager
- Supabase account
- Git installed

---

## 1️⃣ Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd tac-cargo

# Install dependencies
npm install

# Dependencies installed:
# - Next.js 14+
# - React 18+
# - Supabase client
# - Zod (validation)
# - Resend (email)
# - Twilio (SMS)
# - jsPDF (PDF generation)
# - QRCode (QR generation)
# - Radix UI components
# - TailwindCSS
# - TypeScript
```

---

## 2️⃣ Supabase Setup

### Create Project
1. Go to https://supabase.com
2. Create new project: **tac-cargo**
3. Note your project credentials:
   - Project URL
   - Anon/Public key
   - Service Role key (keep secret!)

### Apply Migrations

**Option A: Using Supabase MCP (Recommended)**
```typescript
// Migrations already applied via MCP:
// ✅ 006_enhanced_invoice_fields.sql
// ✅ 007_audit_logging_system.sql
```

**Option B: Manual via Dashboard**
1. Go to SQL Editor in Supabase Dashboard
2. Copy contents from `supabase/migrations/006_enhanced_invoice_fields.sql`
3. Execute
4. Copy contents from `supabase/migrations/007_audit_logging_system.sql`
5. Execute

### Create Storage Buckets

1. Go to **Storage** in Supabase Dashboard
2. Create these buckets (all public):

**Bucket: invoices**
```
Name: invoices
Public: Yes
File size limit: 10MB
Allowed MIME types: application/pdf
```

**Bucket: labels**
```
Name: labels
Public: Yes
File size limit: 5MB
Allowed MIME types: application/pdf
```

**Bucket: manifests**
```
Name: manifests
Public: Yes
File size limit: 10MB
Allowed MIME types: application/pdf
```

**Bucket: documents**
```
Name: documents
Public: Yes
File size limit: 10MB
Allowed MIME types: application/pdf, image/*
```

### Enable RLS (Already Done)
All tables have Row Level Security enabled with organization-level isolation.

---

## 3️⃣ Environment Variables

Create `.env.local` in project root:

```env
# ============================================
# SUPABASE CONFIGURATION
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://dqthizzubvoxmclkcubc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# ============================================
# EMAIL SERVICE (RESEND)
# ============================================
# Sign up at https://resend.com
# Create API key and verify domain
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=TAC Cargo <noreply@taccargo.com>

# ============================================
# SMS SERVICE (TWILIO)
# ============================================
# Sign up at https://twilio.com
# Get credentials from console
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890

# ============================================
# OPTIONAL SERVICES
# ============================================
# CodeRabbit for code reviews
CODERABBIT_API_KEY=cr-f7ded10eb5f3b945041487153cd080cb449e4b4831b7922455ade50010

# Sentry for error tracking (already configured)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

### Get API Keys

**Resend (Email):**
1. Visit https://resend.com
2. Sign up for free account
3. Go to API Keys → Create API Key
4. Copy key to `RESEND_API_KEY`
5. Add and verify your sending domain

**Twilio (SMS):**
1. Visit https://twilio.com
2. Sign up for account
3. Go to Console Dashboard
4. Copy Account SID and Auth Token
5. Buy a phone number for SMS
6. Add credentials to `.env.local`

---

## 4️⃣ Database Schema Overview

### Core Tables (Existing)
- `organizations` - Multi-tenant organizations
- `profiles` - User profiles
- `customers` - Customer management
- `warehouses` - Warehouse locations
- `shipments` - Shipment tracking
- `manifests` - Manifest management
- `invoices` - Invoice management (enhanced)
- `payments` - Payment records
- `tracking_events` - Shipment tracking

### New Tables (Added)
- `audit_logs` - Comprehensive audit trail
- `document_versions` - Document versioning
- `notifications` - User notifications
- `webhooks` - Webhook configurations
- `api_keys` - API key management

### Enhanced Invoice Fields (IATA Compliant)
```typescript
// International Trade
hs_code, country_of_origin, incoterms
export_license_no, import_license_no

// Customs
customs_value, customs_currency, duty_paid
tax_exemption_certificate

// Cargo Details
package_type, gross_weight, net_weight
volumetric_weight, dimensions (L/W/H)

// Insurance
insurance_provider, insurance_policy_no
insurance_amount

// Banking
bank_name, account_number, swift_code

// Compliance
dangerous_goods, dg_class, un_number

// Tracking
master_awb, house_awb, flight_number
vessel_name, container_number

// PDF Tracking
invoice_pdf_url, label_pdf_url
packing_list_pdf_url, pdf_generated_at
pdf_version

// Soft Delete
deleted_at
```

---

## 5️⃣ Run Development Server

```bash
# Start development server
npm run dev

# Server will start at http://localhost:3000
```

### First Login
1. Navigate to http://localhost:3000
2. Sign up with email/password
3. Verify email (check Supabase Auth)
4. Login to dashboard

---

## 6️⃣ Test Features

### Create Test Invoice
1. Go to **Invoices** → **Create Invoice**
2. Fill in consignor/consignee details
3. Add package details
4. Submit invoice
5. **PDF auto-generates** (check `invoice_pdf_url` in database)
6. **Audit log created** (check `audit_logs` table)

### Test PDF Generation
```typescript
// PDFs are auto-generated on invoice creation
// Check Supabase Storage buckets for uploaded files
// View invoice detail page to see PDF/Label tabs
```

### Test Audit Logging
```sql
-- Check audit logs
SELECT * FROM audit_logs 
WHERE entity_type = 'invoice' 
ORDER BY created_at DESC 
LIMIT 10;
```

### Test Notifications
```typescript
// Email notification (if Resend configured)
import { sendInvoiceEmail } from '@/lib/services/email-service';
await sendInvoiceEmail(email, invoiceNo, pdfUrl, customerName);

// SMS notification (if Twilio configured)
import { sendPickupNotification } from '@/lib/services/sms-service';
await sendPickupNotification(phone, reference, customerName);
```

---

## 7️⃣ MCP Integration (Optional)

### Puppeteer MCP for PDF Generation
Currently using jsPDF. To enable Puppeteer MCP:

1. Verify Puppeteer MCP server is running in Windsurf
2. Update `lib/mcp/puppeteer-client.ts` with actual MCP calls
3. Replace placeholder in `app/actions/pdf-generation.ts`

See `MCP_INTEGRATION_GUIDE.md` for details.

### Supabase MCP (Already Active)
✅ Used for database migrations
✅ Available for SQL execution
✅ Can generate TypeScript types

---

## 8️⃣ Production Deployment

### Build for Production
```bash
# Run TypeScript checks
npx tsc --noEmit

# Run linting
npm run lint

# Build application
npm run build
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Or connect GitHub repo for auto-deploy
```

### Environment Variables in Production
Add all `.env.local` variables to Vercel:
1. Go to Project Settings → Environment Variables
2. Add each variable
3. Redeploy

---

## 9️⃣ Monitoring & Maintenance

### Check Logs
```bash
# Supabase logs
# Go to Supabase Dashboard → Logs

# Vercel logs
vercel logs

# Sentry errors
# Check Sentry dashboard
```

### Database Maintenance
```sql
-- Check audit log size
SELECT COUNT(*) FROM audit_logs;

-- Clean old audit logs (optional)
DELETE FROM audit_logs 
WHERE created_at < NOW() - INTERVAL '90 days';

-- Check storage usage
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🔧 Troubleshooting

### Issue: PDF Not Generating
**Check:**
1. Supabase Storage buckets created?
2. Environment variables set?
3. Check browser console for errors
4. Check Supabase logs

**Fix:**
```typescript
// Manually trigger PDF generation
import { generateInvoicePDF } from '@/app/actions/pdf-generation';
const result = await generateInvoicePDF('invoice_id');
console.log(result);
```

### Issue: Email Not Sending
**Check:**
1. `RESEND_API_KEY` set correctly?
2. Sending domain verified in Resend?
3. Check Resend dashboard for errors

**Fix:**
```typescript
// Test email service
import { sendEmail } from '@/lib/services/email-service';
const result = await sendEmail({
  to: 'test@example.com',
  subject: 'Test',
  html: '<p>Test email</p>'
});
console.log(result);
```

### Issue: SMS Not Sending
**Check:**
1. Twilio credentials correct?
2. Phone number purchased and active?
3. Sufficient Twilio balance?

**Fix:**
```typescript
// Test SMS service
import { sendSMS } from '@/lib/services/sms-service';
const result = await sendSMS('+1234567890', 'Test message');
console.log(result);
```

### Issue: Audit Logs Not Creating
**Check:**
1. Triggers created? `SELECT * FROM pg_trigger WHERE tgname LIKE 'audit%';`
2. Function exists? `SELECT * FROM pg_proc WHERE proname = 'create_audit_log';`

**Fix:**
Re-apply migration 007 or create triggers manually.

---

## 📚 Additional Resources

**Documentation:**
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Complete feature list
- [ENTERPRISE_ENHANCEMENT_PLAN.md](./ENTERPRISE_ENHANCEMENT_PLAN.md) - Future roadmap
- [MCP_INTEGRATION_GUIDE.md](./MCP_INTEGRATION_GUIDE.md) - MCP integration
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Deployment guide

**External Links:**
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Resend Docs](https://resend.com/docs)
- [Twilio Docs](https://www.twilio.com/docs)
- [IATA Cargo Standards](https://www.iata.org/en/programs/cargo/)

---

## ✅ Setup Complete!

You now have a fully functional enterprise cargo management system with:
- ✅ IATA-compliant invoice fields
- ✅ Automatic PDF generation
- ✅ Comprehensive audit logging
- ✅ Email & SMS notifications
- ✅ Multi-tenant security
- ✅ Document versioning
- ✅ Webhook support
- ✅ API key management

**Next Steps:**
1. Create test data
2. Customize branding
3. Configure email templates
4. Set up production environment
5. Train users

**Support:**
- Check documentation files
- Review Supabase logs
- Monitor Sentry errors
- Consult IATA standards

---

**Version:** 1.0  
**Last Updated:** January 11, 2026  
**Status:** Production Ready 🚀
