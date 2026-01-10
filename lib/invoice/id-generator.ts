/**
 * Invoice & AWB ID Generation Utilities
 * Generates unique, sequential IDs for invoices and AWB tracking numbers
 */

/**
 * Generate a unique Invoice Number
 * Format: INV-YYYYMM-XXXXXX (e.g., INV-202501-A1B2C3)
 */
export function generateInvoiceNumber(prefix = "INV"): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomBytes = typeof crypto !== "undefined" 
    ? Array.from(crypto.getRandomValues(new Uint8Array(2))).map(b => b.toString(36)).join("").substring(0, 2).toUpperCase()
    : Math.random().toString(36).substring(2, 4).toUpperCase();
  const random = randomBytes;
  return `${prefix}-${year}${month}-${timestamp}${random}`;
}

/**
 * Generate a unique AWB (Air Waybill) Number
 * Format: TACXXXXXXXX (13 digits for barcode compatibility)
 * Uses timestamp + random for uniqueness
 */
export function generateAWBNumber(): string {
  const prefix = "TAC";
  // Use last 8 digits of timestamp + 2 random digits = 10 digits after prefix
  const timestamp = Date.now().toString().slice(-8);
  const random = typeof crypto !== "undefined"
    ? (crypto.getRandomValues(new Uint8Array(1))[0] % 100).toString().padStart(2, "0")
    : Math.floor(Math.random() * 100).toString().padStart(2, "0");
  return `${prefix}${timestamp}${random}`;
}

/**
 * Generate a unique Consignment Number
 * Format: TA + YY + 5-digit sequence (e.g., TA2500001)
 */
export function generateConsignmentNumber(sequence: number): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const seq = sequence.toString().padStart(5, "0");
  return `TA${year}${seq}`;
}

/**
 * Generate barcode-compatible number (Code128)
 * 12-digit numeric for standard barcode scanners
 */
export function generateBarcodeNumber(): string {
  const timestamp = Date.now().toString().slice(-9);
  const random = typeof crypto !== "undefined"
    ? (crypto.getRandomValues(new Uint16Array(1))[0] % 1000).toString().padStart(3, "0")
    : Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `${timestamp}${random}`;
}

/**
 * Validate AWB number format
 */
export function validateAWBNumber(awb: string): boolean {
  // TAC followed by 10 digits
  const awbRegex = /^TAC\d{10}$/;
  return awbRegex.test(awb);
}

/**
 * Validate Invoice number format
 */
export function validateInvoiceNumber(invoice: string): boolean {
  // INV-YYYYMM-XXXXXX format
  const invoiceRegex = /^(INV|LBL)-\d{6}-[A-Z0-9]+$/;
  return invoiceRegex.test(invoice);
}

/**
 * Generate sort code for delivery station
 * Based on pincode and city
 */
export function generateSortCode(pincode: string, city: string): string {
  const cityCode = city.substring(0, 3).toUpperCase();
  const zoneCode = pincode.substring(0, 3);
  return `${cityCode}-${zoneCode}`;
}

/**
 * Generate delivery station code
 */
export function generateDeliveryStationCode(
  city: string,
  state: string
): { stationCode: string; sector: string; sortZone: string } {
  const cityAbbr = city.substring(0, 4).toUpperCase();
  const stateAbbr = state.substring(0, 2).toUpperCase();
  
  // Sector is based on city zone
  const sectorNum = typeof crypto !== "undefined"
    ? (crypto.getRandomValues(new Uint8Array(1))[0] % 20) + 1
    : Math.floor(Math.random() * 20 + 1);
  const sector = `S-${sectorNum.toString().padStart(2, "0")}`;
  
  return {
    stationCode: `${cityAbbr}${stateAbbr}`,
    sector,
    sortZone: cityAbbr,
  };
}

export interface IDGeneratorResult {
  invoiceNo: string;
  awbNo: string;
  consignmentNo: string;
  barcodeNo: string;
}

/**
 * Generate all IDs for a new shipment/invoice
 */
export function generateAllIds(sequence: number = 1): IDGeneratorResult {
  return {
    invoiceNo: generateInvoiceNumber(),
    awbNo: generateAWBNumber(),
    consignmentNo: generateConsignmentNumber(sequence),
    barcodeNo: generateBarcodeNumber(),
  };
}
