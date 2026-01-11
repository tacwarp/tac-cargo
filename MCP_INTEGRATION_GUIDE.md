# TAC Cargo - MCP Integration Guide

## Overview

This guide explains how to integrate Puppeteer MCP and Supabase MCP servers with TAC Cargo for enhanced PDF generation and database operations.

---

## 🎭 Puppeteer MCP Server

### Purpose
The Puppeteer MCP server provides high-quality HTML to PDF conversion, enabling professional invoice and shipping label generation.

### Current Status
- ✅ HTML templates created (`lib/pdf/puppeteer-pdf-generator.ts`)
- ✅ MCP client wrapper created (`lib/mcp/puppeteer-client.ts`)
- ⏳ Actual MCP integration pending (currently using placeholder)

### Integration Steps

#### 1. Verify Puppeteer MCP Server is Running
The Puppeteer MCP server should be available in your Windsurf MCP configuration.

Check `C:\Users\%USERNAME%\.codeium\windsurf\mcp_config.json`:
```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

#### 2. Update PDF Generation to Use MCP

Replace the placeholder in `app/actions/pdf-generation.ts`:

```typescript
// Current placeholder:
const pdfBuffer = Buffer.from(html, 'utf-8');

// Replace with actual MCP call:
import { generatePDFFromHTML } from "@/lib/mcp/puppeteer-client";

const pdfBuffer = await generatePDFFromHTML(html, {
  format: 'A4',
  printBackground: true,
  margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' }
});
```

#### 3. MCP Call Structure

The Puppeteer MCP server provides these operations:
- `navigate` - Navigate to a URL
- `screenshot` - Take a screenshot
- `evaluate` - Execute JavaScript
- `click`, `fill`, `hover` - Interact with page elements

For PDF generation, the typical flow is:
```typescript
// 1. Navigate to data URL with HTML content
await mcp.puppeteer.navigate({
  url: `data:text/html;base64,${Buffer.from(html).toString('base64')}`
});

// 2. Wait for page to load
await new Promise(resolve => setTimeout(resolve, 1000));

// 3. Take screenshot or generate PDF
const pdf = await mcp.puppeteer.screenshot({
  fullPage: true,
  type: 'pdf'
});
```

### HTML Templates

**Invoice Template:** `lib/pdf/puppeteer-pdf-generator.ts::generateInvoiceHTML()`
- Professional layout with company branding
- IATA-compliant fields
- GST tax breakdown
- Terms and conditions
- QR code placeholder

**Shipping Label Template:** `lib/pdf/puppeteer-pdf-generator.ts::generateShippingLabelHTML()`
- 4x6 inch format (standard shipping label)
- Barcode representation
- Routing codes
- Consignee/consignor details
- Special handling indicators

---

## 🗄️ Supabase MCP Server

### Purpose
The Supabase MCP server provides direct database operations, migrations, and type generation capabilities.

### Current Status
- ✅ MCP client wrapper created (`lib/mcp/supabase-client.ts`)
- ✅ Fallback to regular Supabase client
- ⏳ Actual MCP integration pending

### Integration Steps

#### 1. Configure Supabase MCP Server

Add to MCP configuration:
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-supabase"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "your_access_token"
      }
    }
  }
}
```

#### 2. Available Operations

The Supabase MCP client provides:

**Database Operations:**
```typescript
import { executeSQL, applyMigration } from "@/lib/mcp/supabase-client";

// Execute SQL query
const { data, error } = await executeSQL(projectId, 'SELECT * FROM invoices LIMIT 10');

// Apply migration
const result = await applyMigration(projectId, 'add_new_field', `
  ALTER TABLE invoices ADD COLUMN new_field TEXT;
`);
```

**Type Generation:**
```typescript
import { generateTypes } from "@/lib/mcp/supabase-client";

const { types, error } = await generateTypes(projectId);
// Returns TypeScript types for all database tables
```

**Security Advisors:**
```typescript
import { getAdvisors } from "@/lib/mcp/supabase-client";

const { data, error } = await getAdvisors(projectId, 'security');
// Returns security recommendations (RLS policies, etc.)
```

#### 3. Migration Management

Use Supabase MCP for applying migrations:

```typescript
// Apply enhanced invoice fields migration
await applyMigration(
  process.env.SUPABASE_PROJECT_ID!,
  '006_enhanced_invoice_fields',
  fs.readFileSync('supabase/migrations/006_enhanced_invoice_fields.sql', 'utf-8')
);

// Apply audit logging migration
await applyMigration(
  process.env.SUPABASE_PROJECT_ID!,
  '007_audit_logging_system',
  fs.readFileSync('supabase/migrations/007_audit_logging_system.sql', 'utf-8')
);
```

---

## 🔧 Implementation Checklist

### Puppeteer MCP
- [ ] Verify Puppeteer MCP server is running
- [ ] Test HTML to PDF conversion
- [ ] Update `generateInvoicePDF` to use MCP
- [ ] Update `generateLabelPDF` to use MCP
- [ ] Test invoice PDF generation end-to-end
- [ ] Test label PDF generation end-to-end
- [ ] Verify PDFs stored in Supabase Storage

### Supabase MCP
- [ ] Configure Supabase access token
- [ ] Test SQL execution via MCP
- [ ] Apply database migrations via MCP
- [ ] Generate TypeScript types
- [ ] Run security advisors
- [ ] Verify RLS policies

---

## 📝 Environment Variables

Add to `.env.local`:

```env
# Supabase MCP
SUPABASE_PROJECT_ID=your_project_id
SUPABASE_ACCESS_TOKEN=your_access_token

# Already configured
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

---

## 🧪 Testing

### Test PDF Generation

```typescript
// Test invoice PDF
const result = await generateInvoicePDF('invoice_id_here');
console.log('PDF URL:', result.data);

// Test label PDF
const labelResult = await generateLabelPDF('invoice_id_here');
console.log('Label URL:', labelResult.data);
```

### Test Supabase MCP

```typescript
// Test SQL execution
const { data, error } = await executeSQL(
  process.env.SUPABASE_PROJECT_ID!,
  'SELECT COUNT(*) FROM invoices'
);
console.log('Invoice count:', data);

// Test advisors
const advisors = await getAdvisors(
  process.env.SUPABASE_PROJECT_ID!,
  'security'
);
console.log('Security recommendations:', advisors.data);
```

---

## 🚀 Production Deployment

### Before Deploying:

1. **Enable MCP Servers**
   - Ensure Puppeteer MCP is running
   - Ensure Supabase MCP is configured

2. **Update Placeholders**
   - Replace all `Buffer.from(html, 'utf-8')` with actual MCP calls
   - Remove TODO comments

3. **Test Thoroughly**
   - Generate test invoices
   - Verify PDFs are created correctly
   - Check Supabase Storage uploads
   - Verify email/SMS notifications

4. **Monitor Performance**
   - PDF generation should be < 3 seconds
   - Database queries should be < 200ms
   - Storage uploads should be < 1 second

---

## 📚 MCP Server Documentation

### Puppeteer MCP
- GitHub: https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer
- Capabilities: Navigation, screenshots, PDF generation, page interaction

### Supabase MCP
- GitHub: https://github.com/modelcontextprotocol/servers/tree/main/src/supabase
- Capabilities: SQL execution, migrations, type generation, advisors

---

## 🐛 Troubleshooting

### Puppeteer MCP Issues

**Problem:** PDF not generating
- Check if Puppeteer MCP server is running
- Verify HTML is valid
- Check console for errors

**Problem:** PDF quality issues
- Adjust print options (margins, scale)
- Ensure `printBackground: true` for colors
- Use web-safe fonts

### Supabase MCP Issues

**Problem:** SQL execution fails
- Verify access token is valid
- Check project ID is correct
- Ensure RLS policies allow operation

**Problem:** Migration fails
- Check SQL syntax
- Verify migration hasn't been applied already
- Review Supabase logs

---

## 📊 Performance Metrics

**Target Metrics:**
- PDF Generation: < 3 seconds
- SQL Execution: < 200ms
- Storage Upload: < 1 second
- Total Invoice Creation: < 5 seconds

**Monitoring:**
- Log all MCP calls
- Track success/failure rates
- Monitor response times
- Alert on errors

---

## 🔄 Fallback Strategy

If MCP servers are unavailable:

1. **Puppeteer Fallback:** Use jsPDF (already implemented)
2. **Supabase Fallback:** Use regular Supabase client (already implemented)

The current implementation includes automatic fallbacks, so the system will continue to function even if MCP servers are not available.

---

**Version:** 1.0  
**Last Updated:** January 11, 2026  
**Status:** MCP Integration Ready
