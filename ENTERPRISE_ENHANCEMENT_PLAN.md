# TAC Cargo - Enterprise Enhancement Plan

## Executive Summary
Based on deep research of global cargo invoice standards (IATA, DHL, FedEx, UPS) and enterprise SaaS best practices, this plan addresses critical gaps in the current implementation to transform TAC Cargo into a production-ready, enterprise-grade logistics SaaS platform.

---

## 🚨 Critical Issues Identified

### 1. **Invoice Standards Non-Compliance**
**Current State:**
- Missing IATA Cargo-XML standard compliance
- No Air Waybill (AWB) format adherence
- Incomplete commercial invoice fields
- Missing customs documentation support
- No e-AWB/e-freight implementation

**Required Standards:**
- **IATA Cargo-XML**: Standard for electronic communication in air cargo
- **Air Waybill (AWB)**: 11-digit format with airline prefix
- **Commercial Invoice**: Must include HS codes, country of origin, incoterms
- **Customs Documentation**: Packing list, certificate of origin
- **Multi-modal Support**: Air, surface, express with specific requirements

### 2. **PDF Generation Incomplete**
**Current State:**
- Basic invoice document exists but not generating actual PDFs
- No server-side PDF generation implementation
- Missing label PDF generation
- No PDF storage/retrieval system

**Required Implementation:**
- Server-side PDF generation using jsPDF or Puppeteer
- PDF storage in Supabase Storage
- PDF URL tracking in database
- Automatic PDF generation on invoice creation
- Label PDF with barcode/QR code generation

### 3. **CRUD Operations Gaps**
**Current State:**
- Created detail pages but missing edit functionality for:
  - Manifests (no edit page)
  - Customers (no edit page)
  - Payments (no edit page)
- Inconsistent action patterns across modules
- Missing bulk operations
- No soft delete implementation

### 4. **Multi-Tenancy Security Issues**
**Current State:**
- RLS policies exist but not consistently enforced
- No organization-level isolation verification
- Missing tenant context in all queries
- No cross-tenant data leakage prevention tests

### 5. **Enterprise Features Missing**
- No audit logging system
- No document versioning
- No approval workflows
- No compliance reporting
- No data export/import
- No API rate limiting
- No webhook system
- No email notifications
- No SMS notifications

---

## 📋 Detailed Enhancement Roadmap

### Phase 1: Invoice Standards Compliance (Priority: CRITICAL)

#### 1.1 Commercial Invoice Enhancement
**Fields to Add:**
```typescript
interface CommercialInvoice {
  // Existing fields +
  
  // International Trade
  hsCode: string;                    // Harmonized System Code
  countryOfOrigin: string;           // Manufacturing country
  incoterms: string;                 // EXW, FOB, CIF, etc.
  exportLicenseNo?: string;
  importLicenseNo?: string;
  
  // Customs
  customsValue: number;
  customsCurrency: string;
  dutyPaid: boolean;
  taxExemptionCertificate?: string;
  
  // Cargo Details
  packageType: string;               // Carton, Pallet, Crate
  grossWeight: number;
  netWeight: number;
  volumetricWeight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'inch';
  };
  
  // Insurance
  insuranceProvider?: string;
  insurancePolicyNo?: string;
  insuranceAmount?: number;
  
  // Banking
  bankName?: string;
  accountNumber?: string;
  swiftCode?: string;
  
  // Compliance
  dangerousGoods: boolean;
  dgClass?: string;
  unNumber?: string;
  
  // Tracking
  masterAWB?: string;               // MAWB for consolidation
  houseAWB?: string;                // HAWB for freight forwarders
  flightNumber?: string;
  vesselName?: string;
  containerNumber?: string;
}
```

#### 1.2 Air Waybill (AWB) Implementation
- 11-digit AWB number format: `XXX-XXXXXXXX` (airline prefix + serial)
- Master AWB (MAWB) for direct shipments
- House AWB (HAWB) for consolidated shipments
- e-AWB electronic format support
- AWB barcode generation (Code 128)

#### 1.3 Shipping Label Standards
- IATA Resolution 606 compliance
- Barcode: AWB number in Code 128
- QR Code: Full shipment data
- Routing information
- Special handling codes (ECC, ECP)
- Dangerous goods markings
- Fragile/Handle with care indicators

### Phase 2: PDF Generation System (Priority: CRITICAL)

#### 2.1 Server-Side PDF Generation
**Technology Stack:**
- **Option A**: Puppeteer (HTML to PDF, high quality)
- **Option B**: jsPDF + jsPDF-AutoTable (programmatic, faster)
- **Recommendation**: Puppeteer for invoices, jsPDF for labels

**Implementation:**
```typescript
// app/actions/pdf-generation.ts
export async function generateInvoicePDF(invoiceId: string): Promise<ActionResult<string>>
export async function generateShippingLabelPDF(invoiceId: string): Promise<ActionResult<string>>
export async function generatePackingListPDF(invoiceId: string): Promise<ActionResult<string>>
export async function generateManifestPDF(manifestId: string): Promise<ActionResult<string>>
```

#### 2.2 PDF Storage Architecture
```
Supabase Storage Buckets:
├── invoices/
│   ├── {organization_id}/
│   │   ├── {year}/
│   │   │   ├── {month}/
│   │   │   │   ├── INV-{invoice_no}.pdf
├── labels/
│   ├── {organization_id}/
│   │   ├── {year}/
│   │   │   ├── {month}/
│   │   │   │   ├── LBL-{awb_no}.pdf
├── manifests/
└── documents/
```

#### 2.3 Database Schema Updates
```sql
ALTER TABLE invoices ADD COLUMN invoice_pdf_url TEXT;
ALTER TABLE invoices ADD COLUMN label_pdf_url TEXT;
ALTER TABLE invoices ADD COLUMN packing_list_pdf_url TEXT;
ALTER TABLE invoices ADD COLUMN pdf_generated_at TIMESTAMPTZ;
ALTER TABLE invoices ADD COLUMN pdf_version INTEGER DEFAULT 1;

ALTER TABLE manifests ADD COLUMN manifest_pdf_url TEXT;
ALTER TABLE manifests ADD COLUMN pdf_generated_at TIMESTAMPTZ;
```

### Phase 3: Complete CRUD Implementation (Priority: HIGH)

#### 3.1 Missing Edit Pages
- `app/(dashboard)/dashboard/manifests/[id]/edit/page.tsx`
- `app/(dashboard)/dashboard/customers/[id]/edit/page.tsx`
- `app/(dashboard)/dashboard/payments/[id]/edit/page.tsx`

#### 3.2 Bulk Operations
- Bulk status updates
- Bulk delete/cancel
- Bulk export
- Bulk print

#### 3.3 Soft Delete Implementation
```sql
ALTER TABLE invoices ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE shipments ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE manifests ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE customers ADD COLUMN deleted_at TIMESTAMPTZ;

-- Update RLS policies to exclude soft-deleted records
```

### Phase 4: Enterprise Security & Compliance (Priority: HIGH)

#### 4.1 Audit Logging System
```typescript
interface AuditLog {
  id: string;
  organization_id: string;
  user_id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'EXPORT';
  entity_type: 'invoice' | 'shipment' | 'manifest' | 'customer';
  entity_id: string;
  changes: JSONB;                    // Before/after values
  ip_address: string;
  user_agent: string;
  timestamp: Date;
}
```

#### 4.2 Document Versioning
- Track all invoice modifications
- Store previous versions
- Audit trail for compliance
- Restore capability

#### 4.3 Role-Based Access Control (RBAC)
```typescript
enum Role {
  SUPER_ADMIN = 'super_admin',
  ORG_ADMIN = 'org_admin',
  MANAGER = 'manager',
  OPERATOR = 'operator',
  VIEWER = 'viewer',
}

interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}
```

### Phase 5: Notification System (Priority: MEDIUM)

#### 5.1 Email Notifications
- Invoice created → Customer email
- Shipment status updates
- Payment received confirmation
- Delivery confirmation
- Exception alerts

#### 5.2 SMS Notifications
- Shipment picked up
- Out for delivery
- Delivered
- Exception occurred

#### 5.3 WhatsApp Integration (Existing - Enhance)
- Add template messages
- Add media support (PDF attachments)
- Add delivery status tracking

### Phase 6: API & Integrations (Priority: MEDIUM)

#### 6.1 REST API
```
/api/v1/invoices
/api/v1/shipments
/api/v1/manifests
/api/v1/tracking
/api/v1/webhooks
```

#### 6.2 Webhook System
- Invoice created
- Shipment status changed
- Payment received
- Delivery completed

#### 6.3 Third-Party Integrations
- Accounting software (QuickBooks, Xero)
- Payment gateways (Razorpay, Stripe)
- Courier APIs (Delhivery, Blue Dart)
- GST filing systems

### Phase 7: Analytics & Reporting (Priority: MEDIUM)

#### 7.1 Business Intelligence
- Revenue analytics
- Shipment volume trends
- Customer analytics
- Route optimization insights
- Exception analysis

#### 7.2 Compliance Reports
- GST reports
- Tax reports
- Customs documentation
- Audit reports

---

## 🔧 Technical Debt & Code Quality

### Issues Found:
1. **Duplicate Actions**: `shipment-crud.ts` created but `shipments.ts` already exists
2. **Inconsistent Naming**: Mix of kebab-case and camelCase
3. **Missing Error Handling**: Some actions lack proper error boundaries
4. **No Input Validation**: Missing Zod schemas for form validation
5. **No Rate Limiting**: API endpoints unprotected
6. **No Caching**: Database queries not cached

### Recommendations:
1. Consolidate duplicate action files
2. Implement Zod validation schemas
3. Add React Query for data fetching
4. Implement Redis caching layer
5. Add Sentry error tracking (already configured)
6. Add performance monitoring

---

## 📊 Database Schema Enhancements

### New Tables Required:

```sql
-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document Versions
CREATE TABLE document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type TEXT NOT NULL,
  document_id UUID NOT NULL,
  version INTEGER NOT NULL,
  data JSONB NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES auth.users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhooks
CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  url TEXT NOT NULL,
  events TEXT[] NOT NULL,
  secret TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Keys
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  permissions JSONB,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🚀 Implementation Priority Matrix

| Feature | Priority | Effort | Impact | Status |
|---------|----------|--------|--------|--------|
| PDF Generation System | P0 | High | Critical | Not Started |
| Invoice Standards Compliance | P0 | High | Critical | Not Started |
| Complete CRUD Operations | P1 | Medium | High | Partial |
| Audit Logging | P1 | Medium | High | Not Started |
| Multi-tenant Security Audit | P1 | Low | Critical | Not Started |
| Email Notifications | P2 | Medium | Medium | Not Started |
| SMS Notifications | P2 | Medium | Medium | Not Started |
| REST API | P2 | High | Medium | Not Started |
| Webhook System | P2 | Medium | Low | Not Started |
| Analytics Dashboard | P3 | High | Medium | Not Started |

---

## 📝 Next Immediate Steps

1. **Fix Import Error** ✅ (Completed)
2. **Consolidate Duplicate Actions** (shipment-crud.ts vs shipments.ts)
3. **Implement PDF Generation Service**
4. **Add Missing Invoice Fields**
5. **Create Edit Pages for Manifests/Customers/Payments**
6. **Implement Audit Logging**
7. **Add Input Validation with Zod**
8. **Implement Email Notification Service**
9. **Create API Documentation**
10. **Add Comprehensive Testing**

---

## 🎯 Success Metrics

- [ ] 100% IATA Cargo-XML compliance
- [ ] PDF generation < 3 seconds
- [ ] All CRUD operations complete
- [ ] Audit log coverage 100%
- [ ] Zero cross-tenant data leaks
- [ ] API response time < 200ms
- [ ] 99.9% uptime SLA
- [ ] Email delivery rate > 98%
- [ ] Customer satisfaction > 4.5/5

---

## 📚 References

- [IATA Cargo-XML Standards](https://www.iata.org/en/programs/cargo/e/cargo-xml/)
- [IATA e-AWB Guidelines](https://www.iata.org/en/programs/cargo/e/efreight/)
- [DHL Commercial Invoice Guide](https://www.dhl.com/discover/en-my/logistics-advice/essential-guides/how-to-prepare-a-commercial-invoice)
- [Multi-Tenant SaaS Architecture - Microsoft](https://learn.microsoft.com/en-us/azure/azure-sql/database/saas-tenancy-app-design-patterns)
- [AWS SaaS Multi-Tenancy Best Practices](https://docs.aws.amazon.com/prescriptive-guidance/latest/saas-multitenant-managed-postgresql/)

---

**Document Version:** 1.0  
**Last Updated:** January 11, 2026  
**Author:** TAC Cargo Development Team
