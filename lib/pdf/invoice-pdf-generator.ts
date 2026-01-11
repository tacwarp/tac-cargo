"use server";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import { format } from "date-fns";

export interface InvoicePDFData {
  // Company Details
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyGSTIN: string;
  companyLogo?: string;

  // Invoice Details
  invoiceNo: string;
  invoiceDate: string;
  dueDate?: string;
  awbNo: string;
  consignmentNo: string;
  
  // IATA Compliance Fields
  masterAWB?: string;
  houseAWB?: string;
  flightNumber?: string;
  hsCode?: string;
  countryOfOrigin?: string;
  incoterms?: string;

  // Consignor (Shipper)
  consignorName: string;
  consignorAddress: string;
  consignorCity: string;
  consignorState: string;
  consignorPincode: string;
  consignorPhone: string;
  consignorGSTIN?: string;
  consignorEmail?: string;

  // Consignee (Receiver)
  consigneeName: string;
  consigneeAddress: string;
  consigneeCity: string;
  consigneeState: string;
  consigneePincode: string;
  consigneePhone: string;
  consigneeEmail?: string;

  // Shipment Details
  origin: string;
  destination: string;
  transportMode: string;
  pieces: number;
  actualWeight: number;
  chargeableWeight: number;
  volumetricWeight?: number;
  declaredValue?: number;
  
  // Package Details
  packageType?: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };

  // Items
  items: Array<{
    description: string;
    hsCode?: string;
    quantity: number;
    weight: number;
    rate: number;
    amount: number;
  }>;

  // Charges
  freightCharge: number;
  pickupCharge?: number;
  deliveryCharge?: number;
  packingCharge?: number;
  insuranceCharge?: number;
  handlingCharge?: number;
  otherCharges?: number;
  fuelSurcharge?: number;

  // Tax
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  grandTotal: number;

  // Payment
  paymentMode: string;
  advancePaid: number;
  balanceDue: number;

  // Additional
  remarks?: string;
  specialInstructions?: string;
  termsAndConditions?: string[];
}

/**
 * Generate Invoice PDF using jsPDF
 * Compliant with IATA and Indian GST standards
 */
export async function generateInvoicePDF(data: InvoicePDFData): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 15;

  // Colors
  const primaryColor: [number, number, number] = [41, 128, 185];
  const secondaryColor: [number, number, number] = [52, 73, 94];
  const lightGray: [number, number, number] = [240, 240, 240];

  // Header - Company Details
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(data.companyName, 15, 15);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(data.companyAddress, 15, 22);
  doc.text(`Phone: ${data.companyPhone} | Email: ${data.companyEmail}`, 15, 27);
  doc.text(`GSTIN: ${data.companyGSTIN}`, 15, 32);

  // Invoice Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("TAX INVOICE", pageWidth - 15, 20, { align: "right" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice No: ${data.invoiceNo}`, pageWidth - 15, 27, { align: "right" });
  doc.text(`Date: ${format(new Date(data.invoiceDate), "dd MMM yyyy")}`, pageWidth - 15, 32, { align: "right" });
  if (data.dueDate) {
    doc.text(`Due Date: ${format(new Date(data.dueDate), "dd MMM yyyy")}`, pageWidth - 15, 37, { align: "right" });
  }

  yPos = 45;

  // AWB and Consignment Numbers
  doc.setFillColor(...lightGray);
  doc.rect(15, yPos, pageWidth - 30, 15, "F");
  
  doc.setTextColor(...secondaryColor);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`AWB No: ${data.awbNo}`, 20, yPos + 6);
  doc.text(`Consignment No: ${data.consignmentNo}`, 20, yPos + 11);
  
  if (data.masterAWB) {
    doc.text(`MAWB: ${data.masterAWB}`, pageWidth / 2, yPos + 6);
  }
  if (data.houseAWB) {
    doc.text(`HAWB: ${data.houseAWB}`, pageWidth / 2, yPos + 11);
  }

  yPos += 20;

  // Consignor and Consignee Details
  const boxWidth = (pageWidth - 35) / 2;
  
  // Consignor Box
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.rect(15, yPos, boxWidth, 35);
  
  doc.setFillColor(...primaryColor);
  doc.rect(15, yPos, boxWidth, 7, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("CONSIGNOR (SHIPPER)", 20, yPos + 5);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(data.consignorName, 20, yPos + 12);
  doc.setFont("helvetica", "normal");
  doc.text(data.consignorAddress, 20, yPos + 17, { maxWidth: boxWidth - 10 });
  doc.text(`${data.consignorCity}, ${data.consignorState} - ${data.consignorPincode}`, 20, yPos + 24);
  doc.text(`Phone: ${data.consignorPhone}`, 20, yPos + 29);
  if (data.consignorGSTIN) {
    doc.text(`GSTIN: ${data.consignorGSTIN}`, 20, yPos + 33);
  }

  // Consignee Box
  doc.rect(20 + boxWidth, yPos, boxWidth, 35);
  doc.setFillColor(...primaryColor);
  doc.rect(20 + boxWidth, yPos, boxWidth, 7, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("CONSIGNEE (RECEIVER)", 25 + boxWidth, yPos + 5);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(data.consigneeName, 25 + boxWidth, yPos + 12);
  doc.setFont("helvetica", "normal");
  doc.text(data.consigneeAddress, 25 + boxWidth, yPos + 17, { maxWidth: boxWidth - 10 });
  doc.text(`${data.consigneeCity}, ${data.consigneeState} - ${data.consigneePincode}`, 25 + boxWidth, yPos + 24);
  doc.text(`Phone: ${data.consigneePhone}`, 25 + boxWidth, yPos + 29);

  yPos += 40;

  // Shipment Details
  doc.setFillColor(...lightGray);
  doc.rect(15, yPos, pageWidth - 30, 20, "F");
  
  doc.setTextColor(...secondaryColor);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("SHIPMENT DETAILS", 20, yPos + 5);
  
  doc.setFont("helvetica", "normal");
  doc.text(`Origin: ${data.origin}`, 20, yPos + 10);
  doc.text(`Destination: ${data.destination}`, 20, yPos + 15);
  
  doc.text(`Mode: ${data.transportMode.toUpperCase()}`, pageWidth / 2 - 10, yPos + 10);
  doc.text(`Pieces: ${data.pieces}`, pageWidth / 2 - 10, yPos + 15);
  
  doc.text(`Actual Wt: ${data.actualWeight} kg`, pageWidth - 70, yPos + 10);
  doc.text(`Chargeable Wt: ${data.chargeableWeight} kg`, pageWidth - 70, yPos + 15);

  yPos += 25;

  // Items Table
  autoTable(doc, {
    startY: yPos,
    head: [["Description", "HS Code", "Qty", "Weight (kg)", "Rate/kg", "Amount (₹)"]],
    body: data.items.map(item => [
      item.description,
      item.hsCode || "-",
      item.quantity.toString(),
      item.weight.toFixed(2),
      `₹${item.rate.toFixed(2)}`,
      `₹${item.amount.toFixed(2)}`,
    ]),
    theme: "grid",
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 25 },
      2: { cellWidth: 15, halign: "center" },
      3: { cellWidth: 25, halign: "right" },
      4: { cellWidth: 25, halign: "right" },
      5: { cellWidth: 30, halign: "right" },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Charges Summary
  const summaryX = pageWidth - 80;
  const summaryWidth = 65;
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  
  const charges = [
    { label: "Freight Charge", amount: data.freightCharge },
    { label: "Pickup Charge", amount: data.pickupCharge || 0 },
    { label: "Delivery Charge", amount: data.deliveryCharge || 0 },
    { label: "Packing Charge", amount: data.packingCharge || 0 },
    { label: "Insurance Charge", amount: data.insuranceCharge || 0 },
    { label: "Handling Charge", amount: data.handlingCharge || 0 },
    { label: "Other Charges", amount: data.otherCharges || 0 },
  ];

  charges.forEach((charge, index) => {
    if (charge.amount > 0) {
      doc.text(charge.label, summaryX, yPos + (index * 5));
      doc.text(`₹${charge.amount.toFixed(2)}`, summaryX + summaryWidth, yPos + (index * 5), { align: "right" });
    }
  });

  yPos += charges.filter(c => c.amount > 0).length * 5 + 3;

  // Subtotal
  doc.setDrawColor(...secondaryColor);
  doc.line(summaryX, yPos, summaryX + summaryWidth, yPos);
  yPos += 5;
  doc.setFont("helvetica", "bold");
  doc.text("Subtotal", summaryX, yPos);
  doc.text(`₹${data.subtotal.toFixed(2)}`, summaryX + summaryWidth, yPos, { align: "right" });
  yPos += 5;

  // Tax
  doc.setFont("helvetica", "normal");
  if (data.cgst > 0) {
    doc.text("CGST", summaryX, yPos);
    doc.text(`₹${data.cgst.toFixed(2)}`, summaryX + summaryWidth, yPos, { align: "right" });
    yPos += 5;
  }
  if (data.sgst > 0) {
    doc.text("SGST", summaryX, yPos);
    doc.text(`₹${data.sgst.toFixed(2)}`, summaryX + summaryWidth, yPos, { align: "right" });
    yPos += 5;
  }
  if (data.igst > 0) {
    doc.text("IGST", summaryX, yPos);
    doc.text(`₹${data.igst.toFixed(2)}`, summaryX + summaryWidth, yPos, { align: "right" });
    yPos += 5;
  }

  // Grand Total
  doc.setFillColor(...primaryColor);
  doc.rect(summaryX - 2, yPos - 2, summaryWidth + 4, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("GRAND TOTAL", summaryX, yPos + 3);
  doc.text(`₹${data.grandTotal.toFixed(2)}`, summaryX + summaryWidth, yPos + 3, { align: "right" });
  
  yPos += 12;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Payment Mode: ${data.paymentMode}`, summaryX, yPos);
  yPos += 5;
  if (data.advancePaid > 0) {
    doc.text(`Advance Paid: ₹${data.advancePaid.toFixed(2)}`, summaryX, yPos);
    yPos += 5;
  }
  doc.setFont("helvetica", "bold");
  doc.text(`Balance Due: ₹${data.balanceDue.toFixed(2)}`, summaryX, yPos);

  // QR Code for digital verification
  const qrData = JSON.stringify({
    invoice: data.invoiceNo,
    awb: data.awbNo,
    amount: data.grandTotal,
    date: data.invoiceDate,
  });
  
  const qrCodeDataUrl = await QRCode.toDataURL(qrData, { width: 200 });
  doc.addImage(qrCodeDataUrl, "PNG", 15, yPos - 15, 30, 30);

  // Terms and Conditions
  if (yPos + 40 < pageHeight - 20) {
    yPos += 35;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("TERMS AND CONDITIONS:", 15, yPos);
    yPos += 4;
    
    doc.setFont("helvetica", "normal");
    const terms = data.termsAndConditions || [
      "Payment is due within 30 days of invoice date.",
      "Goods once sold will not be taken back.",
      "Subject to jurisdiction of local courts only.",
      "Any dispute arising out of this invoice shall be settled through arbitration.",
    ];
    
    terms.forEach((term, index) => {
      doc.text(`${index + 1}. ${term}`, 15, yPos, { maxWidth: pageWidth - 30 });
      yPos += 4;
    });
  }

  // Footer
  const footerY = pageHeight - 15;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text("This is a computer-generated invoice and does not require a signature.", pageWidth / 2, footerY, { align: "center" });
  doc.text(`Page 1 of 1`, pageWidth - 15, footerY, { align: "right" });

  // Return as Buffer
  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
  return pdfBuffer;
}
