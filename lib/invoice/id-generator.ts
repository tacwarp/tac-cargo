/**
 * Invoice & AWB ID Generation Utilities
 * Generates unique, sequential IDs for invoices and AWB tracking numbers
 */

/**
 * Generate a unique Invoice Number
 * Format: TAC-XXXX (e.g., TAC-4921)
 */
export function generateInvoiceNumber(): string {
  const random = typeof crypto === "undefined"
    ? Math.floor(Math.random() * 9000 + 1000).toString()
    : (Math.floor((crypto.getRandomValues(new Uint32Array(1))[0] / 0xffffffff) * 9000) + 1000).toString();
  return `TAC-${random}`;
}

/**
 * Generate a unique AWB (Air Waybill) Number
 * Format: 365XXXXXXXX (11 digits: 365 + 8 random digits)
 */
export function generateAWBNumber(): string {
  const prefix = "365";
  const random = typeof crypto === "undefined"
    ? Math.floor(Math.random() * 100000000).toString().padStart(8, "0")
    : (Math.floor((crypto.getRandomValues(new Uint32Array(1))[0] / 0xffffffff) * 100000000)).toString().padStart(8, "0");
  return `${prefix}${random}`;
}

/**
 * Generate a unique Consignment Number
 * Format: TA + YY + timestamp + random (e.g., TA25-1A2B3C4D)
 * More unique than sequence-based to avoid duplicates
 */
export function generateConsignmentNumber(): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const timestamp = Date.now().toString(36).toUpperCase().slice(-6);
  const random = typeof crypto === "undefined"
    ? Math.random().toString(36).substring(2, 4).toUpperCase()
    : Array.from(crypto.getRandomValues(new Uint8Array(2))).map(b => b.toString(36)).join("").substring(0, 2).toUpperCase();
  return `TA${year}-${timestamp}${random}`;
}

/**
 * Generate barcode-compatible number (Code128)
 * 12-digit numeric for standard barcode scanners
 */
export function generateBarcodeNumber(): string {
  const timestamp = Date.now().toString().slice(-9);
  const random = typeof crypto === "undefined"
    ? Math.floor(Math.random() * 1000).toString().padStart(3, "0")
    : (crypto.getRandomValues(new Uint16Array(1))[0] % 1000).toString().padStart(3, "0");
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
  const sectorNum = typeof crypto === "undefined"
    ? Math.floor(Math.random() * 20 + 1)
    : (crypto.getRandomValues(new Uint8Array(1))[0] % 20) + 1;
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
export function generateAllIds(): IDGeneratorResult {
  return {
    invoiceNo: generateInvoiceNumber(),
    awbNo: generateAWBNumber(),
    consignmentNo: generateConsignmentNumber(),
    barcodeNo: generateBarcodeNumber(),
  };
}
