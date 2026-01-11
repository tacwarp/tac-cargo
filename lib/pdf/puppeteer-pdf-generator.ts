"use server";

/**
 * PDF Generation using Puppeteer MCP Server
 * This module uses the Puppeteer MCP server for high-quality HTML to PDF conversion
 */

import { InvoicePDFData } from "./invoice-pdf-generator";
import { ShippingLabelData } from "./label-pdf-generator";

/**
 * Generate Invoice HTML for Puppeteer
 */
export async function generateInvoiceHTML(data: InvoicePDFData): Promise<string> {
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
      line-height: 1.6;
      color: #333;
    }
    .container { padding: 20px; max-width: 800px; margin: 0 auto; }
    
    /* Header */
    .header { 
      background: linear-gradient(135deg, #2980b9 0%, #3498db 100%);
      color: white; 
      padding: 30px 20px;
      margin: -20px -20px 20px -20px;
    }
    .header h1 { font-size: 28px; margin-bottom: 5px; }
    .header p { font-size: 11px; opacity: 0.9; }
    
    .invoice-title {
      background: #34495e;
      color: white;
      padding: 15px 20px;
      margin: -20px -20px 20px -20px;
      text-align: right;
    }
    .invoice-title h2 { font-size: 20px; margin-bottom: 5px; }
    .invoice-title p { font-size: 11px; }
    
    /* AWB Section */
    .awb-section {
      background: #ecf0f1;
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 4px;
    }
    .awb-section strong { font-size: 14px; }
    
    /* Party Details */
    .parties { display: flex; gap: 20px; margin-bottom: 20px; }
    .party-box {
      flex: 1;
      border: 2px solid #3498db;
      border-radius: 4px;
      overflow: hidden;
    }
    .party-header {
      background: #3498db;
      color: white;
      padding: 10px;
      font-weight: bold;
      font-size: 11px;
    }
    .party-content { padding: 15px; }
    .party-content p { margin-bottom: 5px; }
    .party-name { font-weight: bold; font-size: 13px; margin-bottom: 8px; }
    
    /* Shipment Details */
    .shipment-details {
      background: #f8f9fa;
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 4px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
    }
    .detail-item strong { display: block; color: #7f8c8d; font-size: 10px; }
    .detail-item span { font-size: 13px; font-weight: bold; }
    
    /* Table */
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    thead { background: #3498db; color: white; }
    th { padding: 12px 8px; text-align: left; font-size: 11px; font-weight: bold; }
    td { padding: 10px 8px; border-bottom: 1px solid #ecf0f1; font-size: 11px; }
    tbody tr:hover { background: #f8f9fa; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    
    /* Summary */
    .summary { 
      margin-left: auto; 
      width: 300px; 
      margin-bottom: 20px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #ecf0f1;
    }
    .summary-row.total {
      background: #3498db;
      color: white;
      padding: 12px 15px;
      margin-top: 10px;
      font-size: 14px;
      font-weight: bold;
      border-radius: 4px;
    }
    .summary-row.payment {
      font-weight: bold;
      color: #e74c3c;
      font-size: 13px;
    }
    
    /* QR Code */
    .qr-code {
      position: absolute;
      bottom: 80px;
      left: 20px;
      width: 80px;
      height: 80px;
      border: 2px solid #ecf0f1;
      padding: 5px;
      background: white;
    }
    
    /* Terms */
    .terms {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #ecf0f1;
    }
    .terms h3 { font-size: 12px; margin-bottom: 10px; color: #34495e; }
    .terms ol { margin-left: 20px; }
    .terms li { margin-bottom: 5px; font-size: 10px; color: #7f8c8d; }
    
    /* Footer */
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ecf0f1;
      text-align: center;
      font-size: 10px;
      color: #95a5a6;
    }
    
    @media print {
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>${data.companyName}</h1>
      <p>${data.companyAddress}</p>
      <p>Phone: ${data.companyPhone} | Email: ${data.companyEmail}</p>
      <p>GSTIN: ${data.companyGSTIN}</p>
    </div>
    
    <div class="invoice-title">
      <h2>TAX INVOICE</h2>
      <p>Invoice No: ${data.invoiceNo}</p>
      <p>Date: ${new Date(data.invoiceDate).toLocaleDateString('en-IN')}</p>
      ${data.dueDate ? `<p>Due Date: ${new Date(data.dueDate).toLocaleDateString('en-IN')}</p>` : ''}
    </div>
    
    <!-- AWB Section -->
    <div class="awb-section">
      <strong>AWB No:</strong> ${data.awbNo} &nbsp;&nbsp;
      <strong>Consignment No:</strong> ${data.consignmentNo}
      ${data.masterAWB ? `&nbsp;&nbsp;<strong>MAWB:</strong> ${data.masterAWB}` : ''}
      ${data.houseAWB ? `&nbsp;&nbsp;<strong>HAWB:</strong> ${data.houseAWB}` : ''}
    </div>
    
    <!-- Parties -->
    <div class="parties">
      <div class="party-box">
        <div class="party-header">CONSIGNOR (SHIPPER)</div>
        <div class="party-content">
          <p class="party-name">${data.consignorName}</p>
          <p>${data.consignorAddress}</p>
          <p>${data.consignorCity}, ${data.consignorState} - ${data.consignorPincode}</p>
          <p>Phone: ${data.consignorPhone}</p>
          ${data.consignorGSTIN ? `<p>GSTIN: ${data.consignorGSTIN}</p>` : ''}
        </div>
      </div>
      
      <div class="party-box">
        <div class="party-header">CONSIGNEE (RECEIVER)</div>
        <div class="party-content">
          <p class="party-name">${data.consigneeName}</p>
          <p>${data.consigneeAddress}</p>
          <p>${data.consigneeCity}, ${data.consigneeState} - ${data.consigneePincode}</p>
          <p>Phone: ${data.consigneePhone}</p>
        </div>
      </div>
    </div>
    
    <!-- Shipment Details -->
    <div class="shipment-details">
      <div class="detail-item">
        <strong>ORIGIN</strong>
        <span>${data.origin}</span>
      </div>
      <div class="detail-item">
        <strong>DESTINATION</strong>
        <span>${data.destination}</span>
      </div>
      <div class="detail-item">
        <strong>MODE</strong>
        <span>${data.transportMode.toUpperCase()}</span>
      </div>
      <div class="detail-item">
        <strong>PIECES</strong>
        <span>${data.pieces}</span>
      </div>
      <div class="detail-item">
        <strong>ACTUAL WEIGHT</strong>
        <span>${data.actualWeight} kg</span>
      </div>
      <div class="detail-item">
        <strong>CHARGEABLE WEIGHT</strong>
        <span>${data.chargeableWeight} kg</span>
      </div>
    </div>
    
    <!-- Items Table -->
    <table>
      <thead>
        <tr>
          <th>Description</th>
          ${data.items[0]?.hsCode ? '<th>HS Code</th>' : ''}
          <th class="text-center">Qty</th>
          <th class="text-right">Weight (kg)</th>
          <th class="text-right">Rate/kg</th>
          <th class="text-right">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${data.items.map(item => `
          <tr>
            <td>${item.description}</td>
            ${item.hsCode ? `<td>${item.hsCode}</td>` : ''}
            <td class="text-center">${item.quantity}</td>
            <td class="text-right">${item.weight.toFixed(2)}</td>
            <td class="text-right">₹${item.rate.toFixed(2)}</td>
            <td class="text-right">₹${item.amount.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <!-- Summary -->
    <div class="summary">
      ${data.freightCharge > 0 ? `<div class="summary-row"><span>Freight Charge</span><span>₹${data.freightCharge.toFixed(2)}</span></div>` : ''}
      ${data.pickupCharge ? `<div class="summary-row"><span>Pickup Charge</span><span>₹${data.pickupCharge.toFixed(2)}</span></div>` : ''}
      ${data.deliveryCharge ? `<div class="summary-row"><span>Delivery Charge</span><span>₹${data.deliveryCharge.toFixed(2)}</span></div>` : ''}
      ${data.packingCharge ? `<div class="summary-row"><span>Packing Charge</span><span>₹${data.packingCharge.toFixed(2)}</span></div>` : ''}
      ${data.insuranceCharge ? `<div class="summary-row"><span>Insurance Charge</span><span>₹${data.insuranceCharge.toFixed(2)}</span></div>` : ''}
      ${data.handlingCharge ? `<div class="summary-row"><span>Handling Charge</span><span>₹${data.handlingCharge.toFixed(2)}</span></div>` : ''}
      ${data.otherCharges ? `<div class="summary-row"><span>Other Charges</span><span>₹${data.otherCharges.toFixed(2)}</span></div>` : ''}
      
      <div class="summary-row" style="font-weight: bold; margin-top: 10px;">
        <span>Subtotal</span><span>₹${data.subtotal.toFixed(2)}</span>
      </div>
      
      ${data.cgst > 0 ? `<div class="summary-row"><span>CGST</span><span>₹${data.cgst.toFixed(2)}</span></div>` : ''}
      ${data.sgst > 0 ? `<div class="summary-row"><span>SGST</span><span>₹${data.sgst.toFixed(2)}</span></div>` : ''}
      ${data.igst > 0 ? `<div class="summary-row"><span>IGST</span><span>₹${data.igst.toFixed(2)}</span></div>` : ''}
      
      <div class="summary-row total">
        <span>GRAND TOTAL</span><span>₹${data.grandTotal.toFixed(2)}</span>
      </div>
      
      <div class="summary-row" style="margin-top: 10px;">
        <span>Payment Mode</span><span>${data.paymentMode}</span>
      </div>
      ${data.advancePaid > 0 ? `<div class="summary-row"><span>Advance Paid</span><span>₹${data.advancePaid.toFixed(2)}</span></div>` : ''}
      <div class="summary-row payment">
        <span>Balance Due</span><span>₹${data.balanceDue.toFixed(2)}</span>
      </div>
    </div>
    
    ${data.remarks ? `
    <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
      <strong style="color: #856404;">Remarks:</strong>
      <p style="margin-top: 5px; color: #856404;">${data.remarks}</p>
    </div>
    ` : ''}
    
    <!-- Terms -->
    <div class="terms">
      <h3>TERMS AND CONDITIONS:</h3>
      <ol>
        ${(data.termsAndConditions || [
          'Payment is due within 30 days of invoice date.',
          'Goods once sold will not be taken back.',
          'Subject to jurisdiction of local courts only.',
          'Any dispute arising out of this invoice shall be settled through arbitration.'
        ]).map(term => `<li>${term}</li>`).join('')}
      </ol>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>This is a computer-generated invoice and does not require a signature.</p>
      <p>© ${new Date().getFullYear()} ${data.companyName}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate Shipping Label HTML for Puppeteer
 */
export async function generateShippingLabelHTML(data: ShippingLabelData): Promise<string> {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Arial', sans-serif; 
      width: 4in;
      height: 6in;
      padding: 0.2in;
      font-size: 10px;
    }
    
    .header {
      background: #000;
      color: white;
      text-align: center;
      padding: 10px;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .awb-section {
      background: #f0f0f0;
      padding: 8px;
      text-align: center;
      margin-bottom: 10px;
      border: 2px solid #000;
    }
    .awb-section .label { font-size: 8px; font-weight: bold; }
    .awb-section .number { font-size: 16px; font-weight: bold; margin-top: 3px; }
    
    .barcode {
      text-align: center;
      margin: 10px 0;
      height: 40px;
      background: #fff;
      border: 1px solid #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Courier New', monospace;
      font-size: 12px;
    }
    
    .routing {
      background: #ffeb3b;
      text-align: center;
      padding: 15px;
      font-size: 24px;
      font-weight: bold;
      margin: 10px 0;
      border: 3px solid #000;
    }
    
    .route-info {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      font-size: 9px;
    }
    .route-box {
      flex: 1;
      text-align: center;
    }
    .route-box .label { font-weight: bold; font-size: 7px; }
    .route-box .code { font-size: 14px; font-weight: bold; margin: 3px 0; }
    .route-box .city { font-size: 8px; }
    .arrow { font-size: 20px; align-self: center; }
    
    .address-box {
      border: 2px solid #000;
      padding: 10px;
      margin: 10px 0;
    }
    .address-box .header {
      background: #000;
      color: white;
      padding: 5px;
      font-weight: bold;
      font-size: 9px;
      margin: -10px -10px 8px -10px;
    }
    .address-box .name { font-weight: bold; font-size: 11px; margin-bottom: 5px; }
    .address-box p { margin-bottom: 3px; font-size: 9px; }
    
    .sender-box {
      border: 1px solid #ccc;
      padding: 8px;
      margin: 10px 0;
      background: #f9f9f9;
    }
    .sender-box .header {
      background: #f0f0f0;
      color: #000;
      padding: 4px;
      font-weight: bold;
      font-size: 8px;
      margin: -8px -8px 6px -8px;
    }
    
    .details {
      display: flex;
      gap: 10px;
      margin: 10px 0;
    }
    .detail-box {
      flex: 1;
      background: #f0f0f0;
      padding: 8px;
      text-align: center;
    }
    .detail-box .label { font-size: 7px; font-weight: bold; }
    .detail-box .value { font-size: 14px; font-weight: bold; margin-top: 3px; }
    
    .warning {
      background: #ff9800;
      color: white;
      padding: 6px;
      text-align: center;
      font-weight: bold;
      font-size: 9px;
      margin: 5px 0;
    }
    
    .danger {
      background: #f44336;
      color: white;
      padding: 6px;
      text-align: center;
      font-weight: bold;
      font-size: 9px;
      margin: 5px 0;
    }
    
    .footer {
      position: absolute;
      bottom: 0.2in;
      left: 0.2in;
      right: 0.2in;
      font-size: 7px;
      color: #666;
      border-top: 1px solid #ccc;
      padding-top: 5px;
    }
    
    @media print {
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header">TAC CARGO</div>
  
  <div class="awb-section">
    <div class="label">AIR WAYBILL</div>
    <div class="number">${data.awbNo}</div>
  </div>
  
  <div class="barcode">||||| ${data.awbNo} |||||</div>
  
  ${data.routingCode || data.sortCode ? `
  <div class="routing">${data.routingCode || data.sortCode}</div>
  ` : ''}
  
  <div class="route-info">
    <div class="route-box">
      <div class="label">FROM:</div>
      <div class="code">${data.originCode}</div>
      <div class="city">${data.originCity}</div>
    </div>
    <div class="arrow">→</div>
    <div class="route-box">
      <div class="label">TO:</div>
      <div class="code">${data.destinationCode}</div>
      <div class="city">${data.destinationCity}</div>
    </div>
  </div>
  
  <div class="address-box">
    <div class="header">DELIVER TO:</div>
    <div class="name">${data.consigneeName}</div>
    <p>${data.consigneeAddress}</p>
    <p>${data.consigneeCity}, ${data.consigneeState} - ${data.consigneePincode}</p>
    <p>Phone: ${data.consigneePhone}</p>
  </div>
  
  <div class="sender-box">
    <div class="header">FROM:</div>
    <div class="name">${data.consignorName}</div>
    <p>${data.consignorCity}, ${data.consignorState} - ${data.consignorPincode}</p>
    <p>Phone: ${data.consignorPhone}</p>
  </div>
  
  <div class="details">
    <div class="detail-box">
      <div class="label">PIECES</div>
      <div class="value">${data.pieces}</div>
    </div>
    <div class="detail-box">
      <div class="label">WEIGHT (KG)</div>
      <div class="value">${data.weight.toFixed(2)}</div>
    </div>
  </div>
  
  <p style="text-align: center; font-size: 8px; margin: 5px 0;">
    Service: <strong>${data.transportMode.toUpperCase()}</strong>
  </p>
  
  ${data.fragile ? '<div class="warning">⚠ FRAGILE - HANDLE WITH CARE</div>' : ''}
  ${data.dangerousGoods ? '<div class="danger">⚠ DANGEROUS GOODS</div>' : ''}
  
  <div class="footer">
    <div>Consignment: ${data.consignmentNo} | Invoice: ${data.invoiceNo}</div>
    <div>Date: ${new Date(data.shipmentDate).toLocaleDateString('en-IN')}</div>
  </div>
</body>
</html>
  `;
}
