/**
 * Shipping Label PDF Generation
 * Generates professional shipping labels with AWB barcodes
 */

/**
 * Escape HTML entities to prevent XSS attacks
 */
function escapeHtml(text: string | undefined | null): string {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export interface LabelData {
  awb_no: string;
  invoice_no: string;
  barcode_data: string;
  shipper: {
    name: string;
    address: string;
    phone: string;
    gstin?: string;
  };
  consignee: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  shipment: {
    pieces: number;
    weight: number;
    volumetric_weight: number;
    chargeable_weight: number;
    transport_mode: string;
    payment_mode: string;
    content_description?: string;
    special_instructions?: string;
  };
  created_at: string;
}

/**
 * Generate shipping label HTML
 * 4x6 inch thermal label format
 */
export function generateLabelHTML(data: LabelData): string {
  const labelDate = new Date(data.created_at).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Label - ${escapeHtml(data.awb_no)}</title>
  <style>
    @page { size: 4in 6in; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Arial', sans-serif; 
      width: 4in; 
      height: 6in; 
      padding: 8px;
      background: white;
      color: #000;
    }
    .label-container {
      border: 3px solid #000;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      border-bottom: 2px solid #000;
      background: #f5f5f5;
    }
    .logo {
      font-size: 20px;
      font-weight: 900;
      letter-spacing: -0.5px;
    }
    .mode-badge {
      background: #000;
      color: #fff;
      padding: 4px 12px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .barcode-section {
      padding: 12px;
      text-align: center;
      border-bottom: 2px solid #000;
      background: #fff;
    }
    .awb-number {
      font-size: 28px;
      font-weight: 900;
      font-family: 'Courier New', monospace;
      letter-spacing: 2px;
      margin-bottom: 8px;
    }
    .barcode {
      font-family: 'Libre Barcode 128', 'IDAutomationHC39M', monospace;
      font-size: 48px;
      line-height: 1;
    }
    .barcode-text {
      font-size: 10px;
      color: #666;
      margin-top: 4px;
    }
    .addresses {
      display: flex;
      flex: 1;
      border-bottom: 2px solid #000;
    }
    .address-box {
      flex: 1;
      padding: 10px;
    }
    .address-box:first-child {
      border-right: 2px solid #000;
    }
    .address-label {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      color: #666;
      margin-bottom: 4px;
      letter-spacing: 1px;
    }
    .address-name {
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 4px;
      line-height: 1.2;
    }
    .address-detail {
      font-size: 11px;
      line-height: 1.4;
      color: #333;
    }
    .address-phone {
      font-size: 12px;
      font-weight: 600;
      margin-top: 6px;
    }
    .pincode {
      font-size: 24px;
      font-weight: 900;
      font-family: 'Courier New', monospace;
      margin-top: 8px;
      background: #000;
      color: #fff;
      display: inline-block;
      padding: 4px 12px;
    }
    .shipment-details {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      border-bottom: 2px solid #000;
    }
    .detail-cell {
      padding: 8px;
      text-align: center;
      border-right: 1px solid #000;
    }
    .detail-cell:last-child {
      border-right: none;
    }
    .detail-label {
      font-size: 8px;
      font-weight: 600;
      text-transform: uppercase;
      color: #666;
    }
    .detail-value {
      font-size: 16px;
      font-weight: 700;
      font-family: 'Courier New', monospace;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      padding: 8px 12px;
      font-size: 9px;
      background: #f5f5f5;
    }
    .footer-item {
      text-align: center;
    }
    .footer-label {
      font-weight: 600;
      text-transform: uppercase;
      color: #666;
    }
    @media print {
      body { 
        print-color-adjust: exact; 
        -webkit-print-color-adjust: exact; 
      }
    }
  </style>
</head>
<body>
  <div class="label-container">
    <div class="header">
      <div class="logo">TAC CARGO</div>
      <div class="mode-badge">${escapeHtml(data.shipment.transport_mode).toUpperCase()}</div>
    </div>

    <div class="barcode-section">
      <div class="awb-number">${escapeHtml(data.awb_no)}</div>
      <div class="barcode">*${escapeHtml(data.awb_no)}*</div>
      <div class="barcode-text">INV: ${escapeHtml(data.invoice_no)}</div>
    </div>

    <div class="addresses">
      <div class="address-box">
        <div class="address-label">From / Shipper</div>
        <div class="address-name">${escapeHtml(data.shipper.name)}</div>
        <div class="address-detail">${escapeHtml(data.shipper.address)}</div>
        <div class="address-phone">📞 ${escapeHtml(data.shipper.phone) || "N/A"}</div>
      </div>
      <div class="address-box">
        <div class="address-label">To / Consignee</div>
        <div class="address-name">${escapeHtml(data.consignee.name)}</div>
        <div class="address-detail">
          ${escapeHtml(data.consignee.address)}<br>
          ${escapeHtml(data.consignee.city)}, ${escapeHtml(data.consignee.state)}
        </div>
        <div class="address-phone">📞 ${escapeHtml(data.consignee.phone)}</div>
        <div class="pincode">${escapeHtml(data.consignee.pincode)}</div>
      </div>
    </div>

    <div class="shipment-details">
      <div class="detail-cell">
        <div class="detail-label">Pieces</div>
        <div class="detail-value">${escapeHtml(String(data.shipment.pieces))}</div>
      </div>
      <div class="detail-cell">
        <div class="detail-label">Act. Wt</div>
        <div class="detail-value">${escapeHtml(String(data.shipment.weight))} kg</div>
      </div>
      <div class="detail-cell">
        <div class="detail-label">Chrg. Wt</div>
        <div class="detail-value">${escapeHtml(String(data.shipment.chargeable_weight))} kg</div>
      </div>
      <div class="detail-cell">
        <div class="detail-label">Payment</div>
        <div class="detail-value">${escapeHtml(data.shipment.payment_mode).toUpperCase()}</div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-item">
        <div class="footer-label">Date</div>
        <div>${escapeHtml(labelDate)}</div>
      </div>
      <div class="footer-item">
        <div class="footer-label">Contents</div>
        <div>${escapeHtml(data.shipment.content_description) || "General Cargo"}</div>
      </div>
      <div class="footer-item">
        <div class="footer-label">Track</div>
        <div>taccargo.com/track</div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate label buffer for PDF response
 */
export async function generateLabelPDF(data: LabelData): Promise<Buffer> {
  const html = generateLabelHTML(data);
  // Return HTML as buffer - in production use Puppeteer/wkhtmltopdf
  return Buffer.from(html, "utf-8");
}

/**
 * Generate QR code data URL for tracking
 */
export function generateQRCodeDataUrl(
  awb: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _baseUrl: string = "https://taccargo.com",
): string {
  const escapedAwb = awb
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
  // Simple QR code placeholder - in production use qrcode library
  return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="white" width="100" height="100"/><text x="50" y="55" text-anchor="middle" font-size="8">${escapedAwb}</text></svg>`;
}
