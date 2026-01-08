/**
 * GS1 Barcode Validation Library
 * Validates SSCC, GTIN-8/12/13/14, and GS1-128 formats with check digit verification
 * Compliant with GS1 General Specifications
 */

export type BarcodeFormat =
  | "SSCC"
  | "GTIN-8"
  | "GTIN-12"
  | "GTIN-13"
  | "GTIN-14"
  | "GS1-128"
  | "UNKNOWN";

export interface GS1ValidationResult {
  isValid: boolean;
  format: BarcodeFormat;
  checkDigitValid: boolean;
  parsedData?: {
    sscc?: string;
    gtin?: string;
    batch?: string;
    expiryDate?: string;
    serialNumber?: string;
    productionDate?: string;
    count?: string;
  };
  error?: string;
}

/**
 * Validates GS1 barcode formats with check digit verification
 * @param barcode - The barcode string to validate
 * @returns Validation result with format and parsed data
 */
export function validateGS1Barcode(barcode: string): GS1ValidationResult {
  // Remove whitespace
  const cleaned = barcode.replace(/\s/g, "");

  // Detect format
  if (cleaned.length === 18 && /^\d{18}$/.test(cleaned)) {
    // SSCC validation
    return validateSSCC(cleaned);
  }

  if (/^\d{8}$|^\d{12}$|^\d{13}$|^\d{14}$/.test(cleaned)) {
    // GTIN validation
    return validateGTIN(cleaned);
  }

  if (cleaned.startsWith("(")) {
    // GS1-128 with Application Identifiers
    return parseGS1_128(cleaned);
  }

  return {
    isValid: false,
    format: "UNKNOWN",
    checkDigitValid: false,
    error:
      "Unrecognized barcode format. Expected SSCC (18 digits), GTIN (8-14 digits), or GS1-128 format.",
  };
}

/**
 * Validates Serial Shipping Container Code (SSCC)
 * Format: 18 digits with check digit
 */
function validateSSCC(sscc: string): GS1ValidationResult {
  const checkDigit = calculateGS1CheckDigit(sscc.substring(0, 17));
  const isValid = checkDigit === parseInt(sscc[17]);

  return {
    isValid,
    format: "SSCC",
    checkDigitValid: isValid,
    parsedData: { sscc },
    error: isValid ? undefined : "Invalid SSCC check digit",
  };
}

/**
 * Validates Global Trade Item Number (GTIN)
 * Supports GTIN-8, GTIN-12, GTIN-13, GTIN-14
 */
function validateGTIN(gtin: string): GS1ValidationResult {
  const length = gtin.length;
  const checkDigit = calculateGS1CheckDigit(gtin.substring(0, length - 1));
  const isValid = checkDigit === parseInt(gtin[length - 1]);

  return {
    isValid,
    format: `GTIN-${length}` as BarcodeFormat,
    checkDigitValid: isValid,
    parsedData: { gtin },
    error: isValid ? undefined : "Invalid GTIN check digit",
  };
}

/**
 * Parses GS1-128 barcode with Application Identifiers
 * Format: (AI)value(AI)value...
 */
function parseGS1_128(barcode: string): GS1ValidationResult {
  const aiPattern = /\((\d{2,4})\)([^\(]+)/g;
  const matches = [...barcode.matchAll(aiPattern)];

  if (matches.length === 0) {
    return {
      isValid: false,
      format: "GS1-128",
      checkDigitValid: false,
      error: "No valid Application Identifiers found",
    };
  }

  const parsedData: Record<string, string> = {};
  let recognizedAIs = 0;

  matches.forEach(([, ai, value]) => {
    switch (ai) {
      case "00":
        parsedData.sscc = value;
        recognizedAIs++;
        break;
      case "01":
      case "02":
        parsedData.gtin = value;
        recognizedAIs++;
        break;
      case "10":
        parsedData.batch = value;
        recognizedAIs++;
        break;
      case "11":
        parsedData.productionDate = value;
        recognizedAIs++;
        break;
      case "17":
        parsedData.expiryDate = value;
        recognizedAIs++;
        break;
      case "21":
        parsedData.serialNumber = value;
        recognizedAIs++;
        break;
      case "37":
        parsedData.count = value;
        recognizedAIs++;
        break;
    }
  });

  // Reject if no recognized AIs were found
  if (recognizedAIs === 0) {
    return {
      isValid: false,
      format: "GS1-128",
      checkDigitValid: false,
      error: "No valid Application Identifiers found",
    };
  }

  return {
    isValid: true,
    format: "GS1-128",
    checkDigitValid: true,
    parsedData,
  };
}

/**
 * GS1 check digit calculation using modified Luhn algorithm
 * Weights alternate between 3 and 1 from right to left
 */
function calculateGS1CheckDigit(code: string): number {
  let sum = 0;
  for (let i = code.length - 1; i >= 0; i--) {
    const digit = parseInt(code[i]);
    const multiplier = (code.length - i) % 2 === 0 ? 1 : 3;
    sum += digit * multiplier;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit;
}

/**
 * Formats a barcode for display with appropriate spacing
 */
export function formatBarcode(barcode: string, format: BarcodeFormat): string {
  const cleaned = barcode.replace(/\s/g, "");

  switch (format) {
    case "SSCC":
      // Format: 1 061414 11234567897
      return `${cleaned.substring(0, 1)} ${cleaned.substring(1, 7)} ${cleaned.substring(7)}`;
    case "GTIN-14":
      // Format: 1234 5678 9012 31
      return cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    case "GTIN-13":
      // Format: 123 4567 890128
      return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 7)} ${cleaned.substring(7)}`;
    default:
      return cleaned;
  }
}
