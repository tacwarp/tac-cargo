/**
 * PDF Generation Service using Puppeteer MCP
 * Generates invoices, labels, and manifests as PDFs
 */

import { createClient } from "@/lib/supabase/server";

export interface InvoicePDFData {
  invoice: any;
  organization: any;
  items: any[];
}

export interface LabelPDFData {
  invoice: any;
  barcode: string;
  qrCode: string;
}

/**
 * Generate Invoice PDF HTML
 */
export function generateInvoiceHTML(data: InvoicePDFData): string {
  const { invoice, organization, items } = data;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Arial', sans-serif; 
      font-size: 11px;
      line-height: 1.4;
      color: #000;
    }
    .container { 
      width: 210mm; 
      padding: 10mm;
      margin: 0 auto;
    }
    .header {
      border: 2px solid #000;
      padding: 10px;
      margin-bottom: 10px;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 10px;
    }
    .company-info h1 {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .company-info p {
      margin: 2px 0;
      font-size: 10px;
    }
    .invoice-title {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      background: #000;
      color: #fff;
      padding: 8px;
      margin: 10px 0;
    }
    .invoice-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }
    .detail-box {
      border: 1px solid #000;
      padding: 8px;
    }
    .detail-box h3 {
      font-size: 12px;
      font-weight: bold;
      margin-bottom: 5px;
      border-bottom: 1px solid #000;
      padding-bottom: 3px;
    }
    .detail-row {
      display: flex;
      margin: 3px 0;
    }
    .detail-label {
      font-weight: bold;
      min-width: 120px;
    }
    .parties-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }
    .party-box {
      border: 1px solid #000;
      padding: 8px;
      min-height: 120px;
    }
    .party-box h3 {
      font-size: 12px;
      font-weight: bold;
      background: #f0f0f0;
      padding: 5px;
      margin: -8px -8px 8px -8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
    }
    th {
      background: #000;
      color: #fff;
      padding: 8px;
      text-align: left;
      font-size: 11px;
      font-weight: bold;
    }
    td {
      border: 1px solid #000;
      padding: 6px;
      font-size: 10px;
    }
    .charges-section {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }
    .charges-table {
      border: 1px solid #000;
    }
    .charge-row {
      display: flex;
      justify-content: space-between;
      padding: 5px 10px;
      border-bottom: 1px solid #ddd;
    }
    .charge-row.total {
      background: #f0f0f0;
      font-weight: bold;
      border-bottom: 2px solid #000;
    }
    .charge-row.grand-total {
      background: #000;
      color: #fff;
      font-weight: bold;
      font-size: 13px;
    }
    .terms {
      border: 1px solid #000;
      padding: 10px;
      margin-top: 10px;
    }
    .terms h3 {
      font-size: 12px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .terms ol {
      margin-left: 20px;
      font-size: 9px;
    }
    .terms li {
      margin: 3px 0;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #000;
    }
    .signature-box {
      text-align: center;
      min-width: 150px;
    }
    .signature-line {
      border-top: 1px solid #000;
      margin-top: 40px;
      padding-top: 5px;
      font-weight: bold;
    }
    @media print {
      .container { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="header-top">
        <div class="company-info">
          <h1>${organization?.name || 'TAC CARGO'}</h1>
          <p><strong>GSTIN:</strong> ${organization?.gstin || 'N/A'}</p>
          <p>${organization?.address || ''}</p>
          <p><strong>Phone:</strong> ${organization?.phone || ''} | <strong>Email:</strong> ${organization?.email || ''}</p>
        </div>
        <div style="text-align: right;">
          <img src="data:image/svg+xml;base64,${generateBarcodeSVG(invoice.awb_no || invoice.invoice_no)}" 
               style="height: 50px;" alt="Barcode" />
        </div>
      </div>
    </div>

    <!-- Invoice Title -->
    <div class="invoice-title">
      TAX INVOICE / CONSIGNMENT NOTE
    </div>

    <!-- Invoice Details -->
    <div class="invoice-details">
      <div class="detail-box">
        <h3>Invoice Details</h3>
        <div class="detail-row">
          <span class="detail-label">Invoice No:</span>
          <span>${invoice.invoice_no}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">AWB No:</span>
          <span>${invoice.awb_no || 'N/A'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Consignment No:</span>
          <span>${invoice.consignment_no || 'N/A'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Invoice Date:</span>
          <span>${new Date(invoice.invoice_date || invoice.created_at).toLocaleDateString('en-IN')}</span>
        </div>
      </div>
      <div class="detail-box">
        <h3>Shipment Details</h3>
        <div class="detail-row">
          <span class="detail-label">Transport Mode:</span>
          <span>${(invoice.transport_mode || 'AIR').toUpperCase()}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Payment Mode:</span>
          <span>${(invoice.payment_mode || 'PREPAID').toUpperCase()}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Origin:</span>
          <span>${invoice.origin_city || 'N/A'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Destination:</span>
          <span>${invoice.destination_city || 'N/A'}</span>
        </div>
      </div>
    </div>

    <!-- Parties Section -->
    <div class="parties-section">
      <div class="party-box">
        <h3>CONSIGNOR (SHIPPER)</h3>
        <p><strong>${invoice.consignor_name}</strong></p>
        <p>${invoice.consignor_address}</p>
        <p>${invoice.consignor_city}, ${invoice.consignor_state} - ${invoice.consignor_pincode}</p>
        <p><strong>Phone:</strong> ${invoice.consignor_phone}</p>
        ${invoice.consignor_gstin ? `<p><strong>GSTIN:</strong> ${invoice.consignor_gstin}</p>` : ''}
      </div>
      <div class="party-box">
        <h3>CONSIGNEE (RECEIVER)</h3>
        <p><strong>${invoice.consignee_name}</strong></p>
        <p>${invoice.consignee_address}</p>
        <p>${invoice.consignee_city}, ${invoice.consignee_state} - ${invoice.consignee_pincode}</p>
        <p><strong>Phone:</strong> ${invoice.consignee_phone}</p>
      </div>
    </div>

    <!-- Items Table -->
    <table>
      <thead>
        <tr>
          <th style="width: 5%;">#</th>
          <th style="width: 35%;">Description</th>
          <th style="width: 10%;">Qty</th>
          <th style="width: 12%;">Weight (kg)</th>
          <th style="width: 13%;">Rate/kg</th>
          <th style="width: 12%;">HSN</th>
          <th style="width: 13%;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${items.map((item: any, index: number) => `
          <tr>
            <td>${index + 1}</td>
            <td>${item.description || 'N/A'}</td>
            <td>${item.quantity || 1}</td>
            <td>${item.weight || 0}</td>
            <td>₹${(item.unit_price || 0).toFixed(2)}</td>
            <td>${invoice.hs_code || '996819'}</td>
            <td style="text-align: right;">₹${(item.line_total || 0).toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Charges Section -->
    <div class="charges-section">
      <div class="detail-box">
        <h3>Package Details</h3>
        <div class="detail-row">
          <span class="detail-label">Total Pieces:</span>
          <span>${invoice.pieces || 0}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Actual Weight:</span>
          <span>${invoice.actual_weight || 0} kg</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Chargeable Weight:</span>
          <span>${invoice.chargeable_weight || 0} kg</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Declared Value:</span>
          <span>₹${(invoice.declared_value || 0).toLocaleString('en-IN')}</span>
        </div>
      </div>
      <div class="charges-table">
        <div class="charge-row">
          <span>Freight Charge:</span>
          <span>₹${(invoice.freight_charge || 0).toFixed(2)}</span>
        </div>
        <div class="charge-row">
          <span>Pickup Charge:</span>
          <span>₹${(invoice.pickup_charge || 0).toFixed(2)}</span>
        </div>
        <div class="charge-row">
          <span>Packing Charge:</span>
          <span>₹${(invoice.packing_charge || 0).toFixed(2)}</span>
        </div>
        <div class="charge-row">
          <span>Delivery Charge:</span>
          <span>₹${(invoice.delivery_charge || 0).toFixed(2)}</span>
        </div>
        <div class="charge-row">
          <span>Insurance:</span>
          <span>₹${(invoice.insurance_charge || 0).toFixed(2)}</span>
        </div>
        <div class="charge-row total">
          <span>Subtotal:</span>
          <span>₹${(invoice.subtotal || 0).toFixed(2)}</span>
        </div>
        <div class="charge-row">
          <span>CGST (${invoice.cgst_rate || 9}%):</span>
          <span>₹${(invoice.cgst || 0).toFixed(2)}</span>
        </div>
        <div class="charge-row">
          <span>SGST (${invoice.sgst_rate || 9}%):</span>
          <span>₹${(invoice.sgst || 0).toFixed(2)}</span>
        </div>
        <div class="charge-row">
          <span>IGST (${invoice.igst_rate || 0}%):</span>
          <span>₹${(invoice.igst || 0).toFixed(2)}</span>
        </div>
        <div class="charge-row grand-total">
          <span>GRAND TOTAL:</span>
          <span>₹${(invoice.total_amount || 0).toFixed(2)}</span>
        </div>
      </div>
    </div>

    <!-- Terms & Conditions -->
    <div class="terms">
      <h3>TERMS & CONDITIONS</h3>
      <ol>
        <li>The consignee must declare the contents, value and conditions of the item before the consignment is booked.</li>
        <li>Any illegal/prohibited/contraband/hazardous items found will solely be responsible by consignor.</li>
        <li>Any consignment found damaged, lost or misplaced will be compensated by the weight of the items with regard to value of Rs.150/Kg.</li>
        <li>Any fragile/electronics items will be considered as shipment at owner risk unless the item is booked under a special insurance programme.</li>
        <li>Any consignment reached the destination office must be collected within a week.</li>
        <li>Any consignment at the destination office which are reluctant and neglected to collect will be considered as unclaimed items after 45 days from the received date.</li>
      </ol>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="signature-box">
        <div class="signature-line">Consignor Signature</div>
      </div>
      <div class="signature-box">
        <div class="signature-line">Authorized Signatory</div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate Shipping Label HTML
 */
export function generateLabelHTML(data: LabelPDFData): string {
  const { invoice, barcode, qrCode } = data;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Arial', sans-serif; 
      font-size: 12px;
      color: #000;
    }
    .label {
      width: 100mm;
      height: 150mm;
      border: 3px solid #000;
      padding: 5mm;
      page-break-after: always;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #000;
      padding-bottom: 5px;
      margin-bottom: 5px;
    }
    .header h1 {
      font-size: 18px;
      font-weight: bold;
    }
    .awb-section {
      text-align: center;
      margin: 10px 0;
      padding: 10px;
      background: #000;
      color: #fff;
    }
    .awb-section h2 {
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 2px;
    }
    .barcode-section {
      text-align: center;
      margin: 10px 0;
    }
    .route-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 10px 0;
      padding: 10px;
      border: 2px solid #000;
      background: #f0f0f0;
    }
    .route-city {
      font-size: 20px;
      font-weight: bold;
    }
    .arrow {
      font-size: 24px;
      font-weight: bold;
    }
    .party-section {
      border: 1px solid #000;
      padding: 8px;
      margin: 5px 0;
      min-height: 60px;
    }
    .party-section h3 {
      font-size: 11px;
      font-weight: bold;
      background: #000;
      color: #fff;
      padding: 3px 5px;
      margin: -8px -8px 5px -8px;
    }
    .party-section p {
      font-size: 10px;
      margin: 2px 0;
    }
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px;
      margin: 5px 0;
    }
    .detail-item {
      border: 1px solid #000;
      padding: 5px;
      font-size: 10px;
    }
    .detail-item strong {
      display: block;
      font-size: 9px;
      color: #666;
    }
    .qr-section {
      text-align: center;
      margin-top: 10px;
    }
    @media print {
      .label { border: 3px solid #000; }
    }
  </style>
</head>
<body>
  <div class="label">
    <!-- Header -->
    <div class="header">
      <h1>TAC CARGO</h1>
      <p style="font-size: 10px;">Air & Surface Cargo Services</p>
    </div>

    <!-- AWB Number -->
    <div class="awb-section">
      <h2>${invoice.awb_no || invoice.invoice_no}</h2>
    </div>

    <!-- Barcode -->
    <div class="barcode-section">
      <img src="data:image/svg+xml;base64,${barcode}" style="height: 40px; width: 100%;" alt="Barcode" />
    </div>

    <!-- Route -->
    <div class="route-section">
      <div class="route-city">${invoice.origin_city || 'N/A'}</div>
      <div class="arrow">→</div>
      <div class="route-city">${invoice.destination_city || 'N/A'}</div>
    </div>

    <!-- From -->
    <div class="party-section">
      <h3>FROM</h3>
      <p><strong>${invoice.consignor_name}</strong></p>
      <p>${invoice.consignor_city}, ${invoice.consignor_state}</p>
      <p>${invoice.consignor_phone}</p>
    </div>

    <!-- To -->
    <div class="party-section">
      <h3>TO</h3>
      <p><strong>${invoice.consignee_name}</strong></p>
      <p>${invoice.consignee_address}</p>
      <p>${invoice.consignee_city}, ${invoice.consignee_state} - ${invoice.consignee_pincode}</p>
      <p>${invoice.consignee_phone}</p>
    </div>

    <!-- Details -->
    <div class="details-grid">
      <div class="detail-item">
        <strong>PIECES</strong>
        ${invoice.pieces || 0}
      </div>
      <div class="detail-item">
        <strong>WEIGHT</strong>
        ${invoice.actual_weight || 0} kg
      </div>
      <div class="detail-item">
        <strong>MODE</strong>
        ${(invoice.transport_mode || 'AIR').toUpperCase()}
      </div>
      <div class="detail-item">
        <strong>PAYMENT</strong>
        ${(invoice.payment_mode || 'PREPAID').toUpperCase()}
      </div>
    </div>

    <!-- QR Code -->
    <div class="qr-section">
      <img src="data:image/svg+xml;base64,${qrCode}" style="height: 60px; width: 60px;" alt="QR Code" />
      <p style="font-size: 9px; margin-top: 3px;">Scan to track</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate simple barcode SVG (Code 128 style)
 */
function generateBarcodeSVG(text: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="50">
    <rect width="200" height="50" fill="white"/>
    <text x="100" y="30" font-family="monospace" font-size="14" text-anchor="middle" fill="black">${text}</text>
  </svg>`;
  return Buffer.from(svg).toString('base64');
}

/**
 * Store PDF in Supabase Storage
 */
export async function storePDFInStorage(
  pdfBuffer: Buffer,
  path: string,
  organizationId: string
): Promise<string> {
  const supabase = await createClient();
  
  const filePath = `${organizationId}/${path}`;
  
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(filePath, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload PDF: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from('documents')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}
