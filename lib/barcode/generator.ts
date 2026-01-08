/**
 * Barcode & AWB Generator Library
 * Generates GS1-compliant barcodes and AWB numbers for cargo logistics
 */

/**
 * Generate a unique Invoice Number
 * Format: INV-YYYYMM-XXXX
 */
export function generateInvoiceNumber(sequenceNumber?: number): string {
  const date = new Date();
  const yearMonth = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
  // Use crypto for better randomness to reduce collision risk
  const seq =
    sequenceNumber ||
    (typeof crypto !== "undefined"
      ? parseInt(
          crypto.getRandomValues(new Uint32Array(1))[0].toString().slice(-4),
        )
      : Math.floor(Math.random() * 9000) + 1000);
  return `INV-${yearMonth}-${String(seq).padStart(4, "0")}`;
}

/**
 * Generate a unique AWB Number with check digit
 * Format: TAC-XXXXXX-C (where C is check digit)
 */
export function generateAWBNumber(sequenceNumber?: number): string {
  // Use crypto for better randomness to reduce collision risk
  const seq =
    sequenceNumber ||
    (typeof crypto !== "undefined"
      ? parseInt(
          crypto.getRandomValues(new Uint32Array(1))[0].toString().slice(0, 6),
        )
      : Math.floor(Math.random() * 900000) + 100000);
  const checkDigit = calculateCheckDigit(seq);
  return `TAC${String(seq).padStart(6, "0")}${checkDigit}`;
}

/**
 * Calculate check digit using modulo 10 algorithm
 */
function calculateCheckDigit(num: number): number {
  const digits = String(num).split("").map(Number);
  const sum = digits.reduce((acc, digit, index) => {
    const weight = (digits.length - index) % 2 === 0 ? 1 : 3;
    return acc + digit * weight;
  }, 0);
  return (10 - (sum % 10)) % 10;
}

/**
 * Generate Manifest Number
 * Format: MAN-YYYYMM-XXXX
 */
export function generateManifestNumber(sequenceNumber?: number): string {
  const date = new Date();
  const yearMonth = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
  // Use crypto for better randomness to reduce collision risk
  const seq =
    sequenceNumber ||
    (typeof crypto !== "undefined"
      ? parseInt(
          crypto.getRandomValues(new Uint32Array(1))[0].toString().slice(-4),
        )
      : Math.floor(Math.random() * 9000) + 1000);
  return `MAN-${yearMonth}-${String(seq).padStart(4, "0")}`;
}

/**
 * Generate GS1-128 barcode data string
 * Includes Application Identifiers for logistics
 */
export function generateGS1BarcodeData(options: {
  awb: string;
  weight?: number;
  pieces?: number;
  date?: Date;
}): string {
  const { awb, weight, pieces, date = new Date() } = options;

  // AI (00) = SSCC (we'll use AWB as identifier)
  // AI (91) = Company internal info
  // AI (310x) = Net weight in kg
  // AI (37) = Count of items

  let barcodeData = `(91)${awb.replace(/[^A-Z0-9]/g, "")}`;

  if (weight) {
    // AI 3102 = Net weight, kg, 2 decimal places
    const weightStr = String(Math.round(weight * 100)).padStart(6, "0");
    barcodeData += `(3102)${weightStr}`;
  }

  if (pieces) {
    // AI 37 = Count of items
    barcodeData += `(37)${String(pieces).padStart(4, "0")}`;
  }

  // AI 11 = Production date (YYMMDD)
  const dateStr = `${String(date.getFullYear()).slice(2)}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  barcodeData += `(11)${dateStr}`;

  return barcodeData;
}

/**
 * Calculate volumetric weight
 * Formula: (L × W × H) / 5000 for air cargo
 * Formula: (L × W × H) / 4000 for surface cargo
 */
export function calculateVolumetricWeight(
  length: number,
  width: number,
  height: number,
  mode: "air" | "surface" = "air",
): number {
  const divisor = mode === "air" ? 5000 : 4000;
  return Math.round(((length * width * height) / divisor) * 100) / 100;
}

/**
 * Calculate chargeable weight (higher of actual vs volumetric)
 */
export function calculateChargeableWeight(
  actualWeight: number,
  volumetricWeight: number,
): number {
  return Math.max(actualWeight, volumetricWeight);
}

/**
 * Generate tracking URL for QR code
 */
export function generateTrackingURL(awb: string, baseUrl?: string): string {
  const base =
    baseUrl || process.env.NEXT_PUBLIC_APP_URL || "https://taccargo.com";
  return `${base}/track/${encodeURIComponent(awb)}`;
}

/**
 * Validate AWB number format and check digit
 */
export function validateAWB(awb: string): { valid: boolean; error?: string } {
  // Expected format: TAC followed by 6 digits and 1 check digit
  const pattern = /^TAC(\d{6})(\d)$/;
  const match = awb.match(pattern);

  if (!match) {
    return { valid: false, error: "Invalid AWB format. Expected: TACXXXXXX#" };
  }

  const [, sequence, checkDigitStr] = match;
  const expectedCheckDigit = calculateCheckDigit(parseInt(sequence));

  if (parseInt(checkDigitStr) !== expectedCheckDigit) {
    return { valid: false, error: "Invalid check digit" };
  }

  return { valid: true };
}

/**
 * Parse AWB to extract components
 */
export function parseAWB(awb: string): {
  prefix: string;
  sequence: string;
  checkDigit: string;
} | null {
  const pattern = /^(TAC)(\d{6})(\d)$/;
  const match = awb.match(pattern);

  if (!match) return null;

  return {
    prefix: match[1],
    sequence: match[2],
    checkDigit: match[3],
  };
}

/**
 * Generate barcode SVG for Code 128
 * Returns SVG string for rendering
 */
export function generateBarcodeSVG(
  data: string,
  options: {
    width?: number;
    height?: number;
    displayValue?: boolean;
    fontSize?: number;
  } = {},
): string {
  const {
    width = 200,
    height = 80,
    displayValue = true,
    fontSize = 12,
  } = options;

  // Simplified Code 128 encoding (for display purposes)
  // In production, use a proper barcode library like JsBarcode
  const barWidth = 2;
  const bars = encodeToCode128(data);
  const totalBars = bars.length;
  const scaledWidth = Math.min(width, totalBars * barWidth);
  const barHeight = displayValue ? height - fontSize - 4 : height;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  svg += `<rect width="${width}" height="${height}" fill="white"/>`;

  const startX = (width - scaledWidth) / 2;
  let x = startX;

  for (let i = 0; i < bars.length; i++) {
    if (bars[i] === "1") {
      svg += `<rect x="${x}" y="0" width="${barWidth}" height="${barHeight}" fill="black"/>`;
    }
    x += barWidth;
  }

  if (displayValue) {
    const escapedData = data
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
    svg += `<text x="${width / 2}" y="${height - 2}" text-anchor="middle" font-family="monospace" font-size="${fontSize}">${escapedData}</text>`;
  }

  svg += "</svg>";
  return svg;
}

/**
 * Simple Code 128 encoding (subset B)
 * For production, use a proper barcode library
 */
function encodeToCode128(data: string): string {
  // Simplified pattern generation
  // Real implementation would use proper Code 128 character set
  let pattern = "11010010000"; // Start Code B

  for (const char of data) {
    const code = char.charCodeAt(0) - 32;
    // Generate a simple pattern based on character code
    pattern +=
      String(code % 2).repeat(2) +
      "0" +
      String((code >> 1) % 2).repeat(2) +
      "0" +
      String((code >> 2) % 2).repeat(2) +
      "00";
  }

  pattern += "1100011101011"; // Stop pattern
  return pattern;
}

export interface AWBGenerationResult {
  invoiceNo: string;
  awbNo: string;
  barcodeData: string;
  trackingUrl: string;
}

/**
 * Generate complete AWB package with all identifiers
 */
export function generateAWBPackage(options?: {
  invoiceSeq?: number;
  awbSeq?: number;
  weight?: number;
  pieces?: number;
}): AWBGenerationResult {
  const invoiceNo = generateInvoiceNumber(options?.invoiceSeq);
  const awbNo = generateAWBNumber(options?.awbSeq);
  const barcodeData = generateGS1BarcodeData({
    awb: awbNo,
    weight: options?.weight,
    pieces: options?.pieces,
  });
  const trackingUrl = generateTrackingURL(awbNo);

  return {
    invoiceNo,
    awbNo,
    barcodeData,
    trackingUrl,
  };
}
