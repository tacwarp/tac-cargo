/**
 * PDF Generation Utilities
 * Uses jsPDF for client-side PDF generation
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import type { InvoiceDocumentData } from "@/components/invoice/invoice-document";
import type { AWBLabelData } from "@/components/invoice/awb-label";

const COMPANY_INFO = {
  name: "TAPAN ASSOCIATE CARGO SERVICE",
  tagline: "(DELHI-IMPHAL-DELHI)",
  address: "1498, Gr. Floor, Wazir Nagar, Kotla-Mubarakpur, Gali No.3, New Delhi-110003",
  gstin: "07AAMFT6165B1Z3",
  phone: "9711011416, 9999983936, 01147093936",
  branchAddress: "Singjamei Thongam Leikai, Lane no. 6 Junction opposite Community hall, Imphal West - 795008",
  branchPhone: "+913853570445, 6909383936",
};

const TERMS = [
  "THE CONSIGNEE MUST DECLARE THE CONTAINS, VALUE AND CONDITIONS OF THE ITEM BEFORE THE CONSIGNMENT IS BOOKED.",
  "ANY ILLEGAL/PROHIBITED/CONTRABAND/HAZARDOUS ITEMS FOUND WILL SOLELY BE RESPONSIBLE BY CONSIGNOR.",
  "ANY CONSIGNMENT FOUND DAMAGED, LOST OR MISPLACED WILL BE COMPENSATED BY THE WEIGHT OF THE ITEMS WITH REGARD TO VALUE OF Rs.150/Kg.",
  "ANY FRAGILE/ELECTRONICS ITEMS WILL BE CONSIDER AS SHIPMENT AT OWNER RISK UNTIL OR UNLESS THE ITEM IS BOOKED UNDER A SPECIAL INSURANCE PROGRAMME.",
  "ANY CONSIGNMENT REACHED THE DESTINATION OFFICE MUST BE COLLECTED WITHIN A WEEK.",
  "ANY CONSIGNMENT AT THE DESTINATION OFFICE WHICH ARE RELUCTANT AND NEGLECTED TO COLLECT WILL BE CONSIDER AS UNCLAIM ITEMS AFTER 45 DAYS FROM THE RECEIVED DATE.",
  "ANY CONSIGNMENT AT THE DESTINATION OFFICE ARE LIABLE TO PAY GODOWN CHARGES OF Rs.5/DAY AFTER 21 DAY FROM THE RECEIVED DATE.",
  "ANY UNCLAIM ITEMS/CONSIGNMENT WILL DISPOSED AFTER 100 DAYS FROM THE RECEIVED DATE.",
  "ANY CONSIGNMENT BOOKED IS ABIDE BY THE ABOVE TERMS AND CONDITIONS (ALL TERMS AND CONDITIONS WILL EXERCISE UNDER DELHI JURISDICTION).",
];

/**
 * Generate Invoice PDF
 */
export function generateInvoicePDF(data: InvoiceDocumentData): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 15;

  // Header
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(data.companyName || COMPANY_INFO.name, pageWidth / 2, yPos, { align: "center" });
  
  yPos += 5;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(COMPANY_INFO.tagline, pageWidth / 2, yPos, { align: "center" });
  
  yPos += 4;
  doc.setFontSize(7);
  doc.text(data.companyAddress || COMPANY_INFO.address, pageWidth / 2, yPos, { align: "center" });
  
  yPos += 4;
  doc.text(`GSTIN: ${data.companyGSTIN || COMPANY_INFO.gstin} | Mobile: ${data.companyPhone || COMPANY_INFO.phone}`, pageWidth / 2, yPos, { align: "center" });

  yPos += 6;
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(10, yPos, pageWidth - 10, yPos);

  // Invoice Details Row
  yPos += 5;
  
  autoTable(doc, {
    startY: yPos,
    head: [["Consignment No.", "Date of Booking", "Nature of Quantity", "Declared Value"]],
    body: [[
      data.consignmentNo,
      format(data.invoiceDate, "dd MMM yyyy"),
      data.natureOfQuantity || "Others",
      data.declaredValue ? `Rs. ${data.declaredValue}` : "USED"
    ]],
    theme: "grid",
    headStyles: { fillColor: [240, 240, 240], textColor: [80, 80, 80], fontSize: 7 },
    bodyStyles: { fontSize: 9, fontStyle: "bold" },
    margin: { left: 10, right: 10 },
  });

  yPos = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 5;

  // Consignor / Consignee
  autoTable(doc, {
    startY: yPos,
    head: [["CONSIGNOR", "CONSIGNEE"]],
    body: [[
      `${data.consignorName}\n${data.consignorAddress}\n${data.consignorCity} - ${data.consignorPincode}\nPhone: ${data.consignorPhone}`,
      `${data.consigneeName}\n${data.consigneeAddress}\n${data.consigneeCity} - ${data.consigneePincode}\nPhone: ${data.consigneePhone}`
    ]],
    theme: "grid",
    headStyles: { fillColor: [240, 240, 240], textColor: [80, 80, 80], fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    margin: { left: 10, right: 10 },
  });

  yPos = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 5;

  // Courier Details & Payment Details
  autoTable(doc, {
    startY: yPos,
    head: [["Courier Details & Rate", "", "Payment Details", "To Pay"]],
    body: [
      ["Origin", data.origin, "Payment Mode", data.paymentMode],
      ["Destination", data.destination, "Freight", `Rs. ${data.freightCharge.toFixed(2)}`],
      ["No. of Pieces", String(data.pieces), "Pickup Charge", `Rs. ${data.pickupCharge.toFixed(2)}`],
      ["Actual Weight", `${data.actualWeight} Kg`, "Packing", `Rs. ${data.packingCharge.toFixed(2)}`],
      ["Charged Weight", `${data.chargeableWeight} Kg`, "Docket Charges", `Rs. ${(data.handlingCharge || 0).toFixed(2)}`],
      ["Rate", `Rs. ${data.ratePerKg}`, "Insurance Charge", `Rs. ${data.insuranceCharge.toFixed(2)}`],
      ["Remarks", data.remarks || data.paymentMode, `GST (${data.igst > 0 ? "18" : "0"}%)`, `Rs. ${data.totalTax.toFixed(2)}`],
      ["", "", "Total", `Rs. ${data.grandTotal.toFixed(2)}`],
      ["", "", "Advance Paid", `Rs. ${data.advancePaid.toFixed(2)}`],
      ["", "", "Balance", `Rs. ${data.balanceDue.toFixed(2)}`],
    ],
    theme: "grid",
    headStyles: { fillColor: [240, 240, 240], textColor: [80, 80, 80], fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 45 },
      2: { cellWidth: 35 },
      3: { cellWidth: 35, halign: "right" },
    },
    margin: { left: 10, right: 10 },
    didParseCell: (hookData) => {
      // Bold the total and balance rows
      if (hookData.row.index >= 7 && hookData.column.index >= 2) {
        hookData.cell.styles.fontStyle = "bold";
      }
    },
  });

  yPos = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 5;

  // Office Hours
  doc.setFontSize(8);
  doc.text(`New Delhi Office Hours: ${data.officeHoursDelhi || "11 AM to 9 PM"}`, 10, yPos);
  doc.text(`Imphal Office Hours: ${data.officeHoursImphal || "9 AM to 6 PM"}`, pageWidth - 10, yPos, { align: "right" });

  yPos += 8;

  // Terms and Conditions
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(10, yPos, pageWidth - 10, yPos);
  
  yPos += 5;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("TERMS AND CONDITIONS:", 10, yPos);
  
  yPos += 4;
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  
  TERMS.forEach((term, index) => {
    const lines = doc.splitTextToSize(`${index + 1}. ${term}`, pageWidth - 20);
    doc.text(lines, 10, yPos);
    yPos += lines.length * 3;
  });

  return doc;
}

/**
 * Generate AWB Label PDF (4x6 inch shipping label)
 */
export function generateAWBLabelPDF(data: AWBLabelData): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "in",
    format: [4, 6], // 4x6 inch label
  });

  const pageWidth = 4;
  let yPos = 0.3;

  // AWB Barcode placeholder (text representation)
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`AWB: ${data.awbNumber}`, pageWidth / 2, yPos, { align: "center" });

  yPos += 0.3;

  // Header row with station and weight
  doc.setFontSize(12);
  doc.rect(0.2, yPos, 0.8, 0.4);
  doc.text(data.originStation || "SUR", 0.6, yPos + 0.28, { align: "center" });

  doc.rect(1.1, yPos, 0.8, 0.4);
  doc.setFontSize(10);
  doc.text(`${data.weight} kgs`, 1.5, yPos + 0.28, { align: "center" });

  doc.rect(2, yPos, 0.8, 0.4);
  doc.text(data.packageType || "LARGE", 2.4, yPos + 0.28, { align: "center" });

  doc.rect(2.9, yPos, 0.9, 0.4);
  doc.text(format(data.shipDate, "dd/MM"), 3.35, yPos + 0.28, { align: "center" });

  yPos += 0.6;

  // Ship To
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Ship To:", 0.2, yPos);
  
  yPos += 0.15;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(data.consigneeName.toUpperCase(), 0.2, yPos);
  
  yPos += 0.2;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const addressLines = doc.splitTextToSize(
    `${data.consigneeAddress}\n${data.consigneeCity} - ${data.consigneeState}\n${data.consigneePincode}`,
    3.5
  );
  doc.text(addressLines, 0.2, yPos);
  yPos += addressLines.length * 0.15 + 0.1;

  if (data.consigneePhone) {
    doc.text(`Ph: ${data.consigneePhone}`, 0.2, yPos);
    yPos += 0.2;
  }

  // Delivery Station
  yPos += 0.1;
  doc.setDrawColor(0);
  doc.line(0.2, yPos, 3.8, yPos);
  yPos += 0.15;

  doc.setFontSize(7);
  doc.text("DELIVERY STATION", 0.6, yPos, { align: "center" });
  doc.text("SECTOR", 1.5, yPos, { align: "center" });
  doc.text("SORTZONE", 2.4, yPos, { align: "center" });

  yPos += 0.05;
  doc.rect(0.2, yPos, 0.8, 0.35);
  doc.rect(1.1, yPos, 0.8, 0.35);
  doc.rect(2, yPos, 0.8, 0.35);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(data.destinationStation || "GAUA", 0.6, yPos + 0.25, { align: "center" });
  doc.text(data.sector || "S-05", 1.5, yPos + 0.25, { align: "center" });
  doc.text(data.sortCode || "GAUA", 2.4, yPos + 0.25, { align: "center" });

  yPos += 0.5;

  // Ship Date and Invoice
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Ship Date: ${format(data.shipDate, "dd/MM/yyyy")}`, 0.2, yPos);
  doc.text(`Invoice ID: ${data.invoiceNo || "-"}`, 2, yPos);

  yPos += 0.15;
  if (data.shipperGSTIN) {
    doc.text(`GST# ${data.shipperGSTIN}`, 0.2, yPos);
    yPos += 0.2;
  }

  // Ordered From
  yPos += 0.1;
  doc.setFontSize(7);
  doc.text("Ordered From:", 0.2, yPos);
  yPos += 0.15;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(data.shipperName.toUpperCase(), 0.2, yPos);

  yPos += 0.3;

  // Ship From
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text(`Ship From: ${data.shipperName}`, 0.2, yPos);
  yPos += 0.12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  const returnAddress = `Return Address: ${data.shipperAddress}, ${data.shipperCity}, ${data.shipperState} ${data.shipperPincode}`;
  const returnLines = doc.splitTextToSize(returnAddress, 3.5);
  doc.text(returnLines, 0.2, yPos);

  yPos += returnLines.length * 0.1 + 0.15;

  // Disclaimer
  doc.setFontSize(5);
  const disclaimer = "Shipper declares that package does not contain any products that are prohibited or restricted by law or otherwise under the conditions of carriage.";
  const disclaimerLines = doc.splitTextToSize(disclaimer, 3.5);
  doc.text(disclaimerLines, 0.2, yPos);

  yPos += disclaimerLines.length * 0.08 + 0.2;

  // Item description
  if (data.contentDescription) {
    doc.line(0.2, yPos, 3.8, yPos);
    yPos += 0.15;
    doc.setFontSize(7);
    doc.text("#    Item description", 0.2, yPos);
    yPos += 0.15;
    doc.setFontSize(8);
    doc.text(`1    ${data.contentDescription.toUpperCase()}`, 0.2, yPos);
  }

  // Footer branding
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("TAC cargo", pageWidth - 0.2, 5.8, { align: "right" });

  return doc;
}

/**
 * Download PDF
 */
export function downloadPDF(doc: jsPDF, filename: string): void {
  doc.save(filename);
}

/**
 * Get PDF as Blob
 */
export function getPDFBlob(doc: jsPDF): Blob {
  return doc.output("blob");
}

/**
 * Get PDF as Base64
 */
export function getPDFBase64(doc: jsPDF): string {
  return doc.output("datauristring");
}
