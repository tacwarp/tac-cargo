/**
 * Server-only Barcode Generator
 * Uses bwip-js for production-grade barcode PNG generation
 * This file should only be imported in server components/API routes
 */

import "server-only";

// Dynamic import for bwip-js to avoid client-side bundling issues
async function getBwipJs() {
  const bwipjs = await import("bwip-js");
  return bwipjs;
}

export interface BarcodeOptions {
  type?: "code128" | "gs1-128" | "qrcode" | "datamatrix";
  scale?: number;
  height?: number;
  includetext?: boolean;
  textsize?: number;
}

/**
 * Generate production-grade barcode PNG buffer
 * Supports Code128, GS1-128, QR codes, DataMatrix
 */
export async function generateBarcodePNG(
  data: string,
  options: BarcodeOptions = {},
): Promise<Buffer> {
  const {
    type = "code128",
    scale = 3,
    height = 10,
    includetext = true,
    textsize = 10,
  } = options;

  const bcidMap: Record<string, string> = {
    code128: "code128",
    "gs1-128": "gs1-128",
    qrcode: "qrcode",
    datamatrix: "datamatrix",
  };

  const bwipjs = await getBwipJs();

  try {
    const png = await bwipjs.toBuffer({
      bcid: bcidMap[type] || "code128",
      text: data,
      scale,
      height,
      includetext,
      textxalign: "center",
      textsize,
    });
    return png;
  } catch (error) {
    console.error("Barcode generation error:", error);
    throw new Error(`Failed to generate barcode: ${error}`);
  }
}

/**
 * Generate barcode as base64 data URL for embedding in HTML/PDF
 */
export async function generateBarcodeDataURL(
  data: string,
  options: BarcodeOptions = {},
): Promise<string> {
  const png = await generateBarcodePNG(data, options);
  return `data:image/png;base64,${png.toString("base64")}`;
}

/**
 * Generate AWB barcode as PNG
 */
export async function generateAWBBarcode(awb: string): Promise<Buffer> {
  return generateBarcodePNG(awb, {
    type: "code128",
    scale: 3,
    height: 15,
    includetext: true,
  });
}

/**
 * Generate GS1-128 barcode for shipping labels
 */
export async function generateGS1Barcode(data: string): Promise<Buffer> {
  // Remove parentheses for barcode encoding (they're for human reading)
  const cleanData = data.replaceAll("(", "").replaceAll(")", "");

  return generateBarcodePNG(cleanData, {
    type: "code128", // Use code128 as fallback if gs1-128 not available
    scale: 2,
    height: 12,
    includetext: true,
  });
}

/**
 * Generate QR code for tracking URL
 */
export async function generateTrackingQR(trackingUrl: string): Promise<Buffer> {
  return generateBarcodePNG(trackingUrl, {
    type: "qrcode",
    scale: 4,
    height: 40,
    includetext: false,
  });
}

/**
 * Generate complete shipping label barcodes (AWB + QR)
 */
export async function generateLabelBarcodes(
  awb: string,
  trackingUrl: string,
): Promise<{
  awbBarcode: string;
  trackingQR: string;
}> {
  const [awbPng, qrPng] = await Promise.all([
    generateAWBBarcode(awb),
    generateTrackingQR(trackingUrl),
  ]);

  return {
    awbBarcode: `data:image/png;base64,${awbPng.toString("base64")}`,
    trackingQR: `data:image/png;base64,${qrPng.toString("base64")}`,
  };
}
