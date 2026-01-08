/**
 * Invoice PDF Generation
 * Generates professional invoices with GST compliance
 */

export interface InvoiceData {
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  customer: {
    name: string;
    gst_number?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    gst_rate: number;
    line_total: number;
  }>;
  subtotal: number;
  gst_amount: number;
  total_amount: number;
  currency: string;
  payment_terms?: string;
  notes?: string;
}

/**
 * Generate invoice HTML for PDF conversion
 * Uses modern CSS for print-friendly layout
 */
export function generateInvoiceHTML(data: InvoiceData): string {
  const itemsHTML = data.items
    .map(
      (item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${item.description}</td>
      <td style="text-align: center">${item.quantity}</td>
      <td style="text-align: right">₹${item.unit_price.toFixed(2)}</td>
      <td style="text-align: center">${item.gst_rate}%</td>
      <td style="text-align: right; font-weight: 600">₹${item.line_total.toFixed(2)}</td>
    </tr>
  `,
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${data.invoice_number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1f2937; line-height: 1.6; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; }
    .company { font-size: 28px; font-weight: 700; color: #8b5cf6; }
    .invoice-title { font-size: 24px; font-weight: 600; margin-bottom: 8px; }
    .invoice-meta { color: #6b7280; font-size: 14px; }
    .section { margin-bottom: 30px; }
    .section-title { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6b7280; margin-bottom: 8px; }
    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
    .detail-box { background: #f9fafb; padding: 20px; border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: 600; font-size: 12px; text-transform: uppercase; color: #374151; }
    td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    .totals { margin-top: 30px; text-align: right; }
    .totals-row { display: flex; justify-content: flex-end; padding: 8px 0; }
    .totals-label { width: 200px; text-align: right; padding-right: 20px; color: #6b7280; }
    .totals-value { width: 150px; text-align: right; font-weight: 600; }
    .total-final { font-size: 20px; color: #8b5cf6; padding-top: 12px; border-top: 2px solid #8b5cf6; margin-top: 12px; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
    @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="company">TAC Cargo</div>
        <div style="color: #6b7280; font-size: 14px; margin-top: 4px;">
          Imphal-Delhi Logistics Corridor<br>
          GST: 15AABCT1234F1Z5
        </div>
      </div>
      <div style="text-align: right;">
        <div class="invoice-title">INVOICE</div>
        <div class="invoice-meta">
          ${data.invoice_number}<br>
          Date: ${new Date(data.invoice_date).toLocaleDateString("en-IN")}<br>
          Due: ${new Date(data.due_date).toLocaleDateString("en-IN")}
        </div>
      </div>
    </div>

    <div class="section">
      <div class="details-grid">
        <div class="detail-box">
          <div class="section-title">Bill To</div>
          <div style="font-weight: 600; margin-bottom: 4px;">${data.customer.name}</div>
          ${data.customer.gst_number ? `<div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">GST: ${data.customer.gst_number}</div>` : ""}
          <div style="font-size: 14px; color: #4b5563;">
            ${data.customer.address}<br>
            ${data.customer.city}, ${data.customer.state} ${data.customer.pincode}
          </div>
        </div>
        <div class="detail-box">
          <div class="section-title">Payment Terms</div>
          <div>${data.payment_terms || "Net 30"}</div>
          ${data.notes ? `<div style="margin-top: 16px;"><div class="section-title">Notes</div><div style="font-size: 14px;">${data.notes}</div></div>` : ""}
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Invoice Items</div>
      <table>
        <thead>
          <tr>
            <th style="width: 40px;">#</th>
            <th>Description</th>
            <th style="width: 80px; text-align: center;">Qty</th>
            <th style="width: 120px; text-align: right;">Rate</th>
            <th style="width: 80px; text-align: center;">GST</th>
            <th style="width: 120px; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>
    </div>

    <div class="totals">
      <div class="totals-row">
        <div class="totals-label">Subtotal:</div>
        <div class="totals-value">₹${data.subtotal.toFixed(2)}</div>
      </div>
      <div class="totals-row">
        <div class="totals-label">GST:</div>
        <div class="totals-value">₹${data.gst_amount.toFixed(2)}</div>
      </div>
      <div class="totals-row total-final">
        <div class="totals-label">Total (${data.currency}):</div>
        <div class="totals-value">₹${data.total_amount.toFixed(2)}</div>
      </div>
    </div>

    <div class="footer">
      <strong>Thank you for your business!</strong><br>
      This is a computer-generated invoice. For queries, contact: billing@taccargo.com
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate invoice URL (for server-side PDF generation)
 * In production, use Puppeteer or a PDF service
 */
export async function generateInvoicePDF(data: InvoiceData): Promise<string> {
  // For now, return HTML-based invoice
  // In production, integrate with Puppeteer/jsPDF or cloud PDF service
  const html = generateInvoiceHTML(data);

  // Simulate PDF generation - in production, use actual PDF service
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  return url;
}
