"use server";

import jsPDF from "jspdf";
import QRCode from "qrcode";
import bwipjs from "bwip-js";

export interface ShippingLabelData {
  // AWB Details
  awbNo: string;
  masterAWB?: string;
  houseAWB?: string;
  
  // Shipment Reference
  consignmentNo: string;
  invoiceNo: string;
  
  // Origin
  originName: string;
  originCode: string;
  originCity: string;
  originState: string;
  
  // Destination
  destinationName: string;
  destinationCode: string;
  destinationCity: string;
  destinationState: string;
  
  // Consignor
  consignorName: string;
  consignorAddress: string;
  consignorCity: string;
  consignorState: string;
  consignorPincode: string;
  consignorPhone: string;
  
  // Consignee
  consigneeName: string;
  consigneeAddress: string;
  consigneeCity: string;
  consigneeState: string;
  consigneePincode: string;
  consigneePhone: string;
  
  // Shipment Details
  pieces: number;
  weight: number;
  transportMode: string;
  serviceType?: string;
  
  // Special Handling
  specialInstructions?: string;
  dangerousGoods?: boolean;
  fragile?: boolean;
  
  // Routing
  routingCode?: string;
  sortCode?: string;
  
  // Dates
  shipmentDate: string;
  expectedDelivery?: string;
}

/**
 * Generate Shipping Label PDF
 * IATA Resolution 606 compliant
 */
export async function generateShippingLabelPDF(data: ShippingLabelData): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [100, 150], // Standard 4x6 inch label
  });

  const pageWidth = 100;
  const pageHeight = 150;
  let yPos = 5;

  // Colors
  const black: [number, number, number] = [0, 0, 0];
  const red: [number, number, number] = [220, 53, 69];
  const orange: [number, number, number] = [255, 152, 0];

  // Header - Company Logo Area
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, pageWidth, 15, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("TAC CARGO", pageWidth / 2, 10, { align: "center" });

  yPos = 18;

  // AWB Number - Large and prominent
  doc.setFillColor(240, 240, 240);
  doc.rect(5, yPos, pageWidth - 10, 12, "F");
  
  doc.setTextColor(...black);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("AIR WAYBILL", 8, yPos + 4);
  
  doc.setFontSize(14);
  doc.text(data.awbNo, pageWidth / 2, yPos + 9, { align: "center" });

  yPos += 15;

  // Generate AWB Barcode (Code 128) - Server-side
  try {
    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: "code128",
      text: data.awbNo,
      scale: 2,
      height: 10,
      includetext: false,
    });
    const barcodeDataUrl = `data:image/png;base64,${barcodeBuffer.toString("base64")}`;
    doc.addImage(barcodeDataUrl, "PNG", 10, yPos, 80, 12);
  } catch (error) {
    console.error("Barcode generation error:", error);
  }

  yPos += 15;

  // Routing Information
  if (data.routingCode || data.sortCode) {
    doc.setFillColor(255, 255, 0);
    doc.rect(5, yPos, pageWidth - 10, 15, "F");
    
    doc.setTextColor(...black);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    const routingText = data.routingCode || data.sortCode || "";
    doc.text(routingText, pageWidth / 2, yPos + 10, { align: "center" });
    
    yPos += 18;
  }

  // Origin → Destination
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("FROM:", 8, yPos);
  doc.setFontSize(12);
  doc.text(data.originCode, 8, yPos + 5);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(data.originCity, 8, yPos + 9);

  doc.setFont("helvetica", "bold");
  doc.text("TO:", pageWidth - 30, yPos);
  doc.setFontSize(12);
  doc.text(data.destinationCode, pageWidth - 30, yPos + 5);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(data.destinationCity, pageWidth - 30, yPos + 9);

  // Arrow
  doc.setFontSize(16);
  doc.text("→", pageWidth / 2 - 3, yPos + 5);

  yPos += 15;

  // Consignee Details (Receiver) - Most Important
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(5, yPos, pageWidth - 10, 30);
  
  doc.setFillColor(0, 0, 0);
  doc.rect(5, yPos, pageWidth - 10, 6, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("DELIVER TO:", 8, yPos + 4);
  
  doc.setTextColor(...black);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(data.consigneeName, 8, yPos + 10, { maxWidth: pageWidth - 16 });
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(data.consigneeAddress, 8, yPos + 15, { maxWidth: pageWidth - 16 });
  doc.text(`${data.consigneeCity}, ${data.consigneeState} - ${data.consigneePincode}`, 8, yPos + 22);
  doc.text(`Phone: ${data.consigneePhone}`, 8, yPos + 27);

  yPos += 33;

  // Consignor Details (Sender)
  doc.rect(5, yPos, pageWidth - 10, 20);
  
  doc.setFillColor(240, 240, 240);
  doc.rect(5, yPos, pageWidth - 10, 5, "F");
  doc.setTextColor(...black);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("FROM:", 8, yPos + 3.5);
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(data.consignorName, 8, yPos + 8, { maxWidth: pageWidth - 16 });
  
  doc.setFont("helvetica", "normal");
  doc.text(`${data.consignorCity}, ${data.consignorState} - ${data.consignorPincode}`, 8, yPos + 12);
  doc.text(`Phone: ${data.consignorPhone}`, 8, yPos + 16);

  yPos += 23;

  // Shipment Details
  doc.setFillColor(240, 240, 240);
  doc.rect(5, yPos, (pageWidth - 15) / 2, 12, "F");
  doc.rect(10 + (pageWidth - 15) / 2, yPos, (pageWidth - 15) / 2, 12, "F");
  
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("PIECES", 8, yPos + 3);
  doc.setFontSize(12);
  doc.text(data.pieces.toString(), 8, yPos + 9);
  
  doc.setFontSize(7);
  doc.text("WEIGHT (KG)", 13 + (pageWidth - 15) / 2, yPos + 3);
  doc.setFontSize(12);
  doc.text(data.weight.toFixed(2), 13 + (pageWidth - 15) / 2, yPos + 9);

  yPos += 15;

  // Service Type and Mode
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Service: ${data.transportMode.toUpperCase()}`, 8, yPos);
  if (data.serviceType) {
    doc.text(`Type: ${data.serviceType}`, 8, yPos + 4);
  }

  yPos += 8;

  // Special Handling Indicators
  if (data.fragile || data.dangerousGoods || data.specialInstructions) {
    yPos += 2;
    
    if (data.fragile) {
      doc.setFillColor(...orange);
      doc.rect(5, yPos, pageWidth - 10, 6, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("⚠ FRAGILE - HANDLE WITH CARE", pageWidth / 2, yPos + 4, { align: "center" });
      yPos += 8;
    }
    
    if (data.dangerousGoods) {
      doc.setFillColor(...red);
      doc.rect(5, yPos, pageWidth - 10, 6, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("⚠ DANGEROUS GOODS", pageWidth / 2, yPos + 4, { align: "center" });
      yPos += 8;
    }
  }

  // QR Code with shipment data
  const qrData = JSON.stringify({
    awb: data.awbNo,
    consignment: data.consignmentNo,
    from: data.originCode,
    to: data.destinationCode,
    pieces: data.pieces,
    weight: data.weight,
  });
  
  const qrCodeDataUrl = await QRCode.toDataURL(qrData, { width: 200 });
  doc.addImage(qrCodeDataUrl, "PNG", pageWidth - 25, pageHeight - 25, 20, 20);

  // Footer - Reference Numbers
  doc.setFontSize(6);
  doc.setTextColor(128, 128, 128);
  doc.text(`Consignment: ${data.consignmentNo}`, 5, pageHeight - 8);
  doc.text(`Invoice: ${data.invoiceNo}`, 5, pageHeight - 5);
  doc.text(`Date: ${new Date(data.shipmentDate).toLocaleDateString()}`, 5, pageHeight - 2);

  // Return as Buffer
  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
  return pdfBuffer;
}
