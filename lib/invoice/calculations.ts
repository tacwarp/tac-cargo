/**
 * Invoice Calculation Utilities
 * Handles volumetric weight, GST, and total calculations
 */

import Currency from "currency.js";

// Volumetric factor for different transport modes
export const VOLUMETRIC_FACTORS = {
  air: 5000, // kg/m³ - updated to 5000 as per TAC Enterprise v4.0.0
  surface: 4000, // kg/m³ - surface transport
  express: 5000, // kg/m³ - express delivery
  economy: 4000, // kg/m³ - economy
} as const;

// GST rates
export const GST_RATES = {
  CGST: 9, // Central GST
  SGST: 9, // State GST (same state)
  IGST: 18, // Integrated GST (inter-state)
} as const;

export interface Dimensions {
  length: number; // cm
  width: number; // cm
  height: number; // cm
}

export interface PackageDetails {
  actualWeight: number; // kg
  dimensions?: Dimensions;
  quantity?: number;
}

export interface ChargeBreakdown {
  freightCharge: number;
  pickupCharge: number;
  deliveryCharge: number;
  packingCharge: number;
  insuranceCharge: number;
  handlingCharge: number;
  otherCharges: number;
}

export interface TaxCalculation {
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  grandTotal: number;
  isInterState: boolean;
}

export interface InvoiceCalculation {
  actualWeight: number;
  volumetricWeight: number;
  chargeableWeight: number;
  charges: ChargeBreakdown;
  tax: TaxCalculation;
  balanceDue: number;
  advancePaid: number;
}

/**
 * Calculate volumetric weight
 * Formula: (L × W × H) / Volumetric Factor
 */
export function calculateVolumetricWeight(
  dimensions: Dimensions,
  transportMode: keyof typeof VOLUMETRIC_FACTORS = "air"
): number {
  const { length, width, height } = dimensions;
  const factor = VOLUMETRIC_FACTORS[transportMode];

  // Convert cm³ to volumetric weight in kg
  const volumetricWeight = (length * width * height) / factor;

  return Math.round(volumetricWeight * 100) / 100; // Round to 2 decimals
}

/**
 * Calculate chargeable weight (higher of actual vs volumetric)
 */
export function calculateChargeableWeight(
  actualWeight: number,
  volumetricWeight: number
): number {
  return Math.max(actualWeight, volumetricWeight);
}

/**
 * Calculate freight charge based on weight and rate
 */
export function calculateFreightCharge(
  chargeableWeight: number,
  ratePerKg: number,
  minCharge: number = 0
): number {
  const calculated = Currency(chargeableWeight).multiply(ratePerKg).value;
  return Math.max(calculated, minCharge);
}

/**
 * Calculate insurance charge
 * Typically 1-2% of declared value
 */
export function calculateInsuranceCharge(
  declaredValue: number,
  insuranceRate: number = 1
): number {
  return Currency(declaredValue).multiply(insuranceRate / 100).value;
}

/**
 * Calculate GST (CGST + SGST for intra-state, IGST for inter-state)
 */
export function calculateGST(
  subtotal: number,
  isInterState: boolean
): { cgst: number; sgst: number; igst: number; totalTax: number } {
  if (isInterState) {
    const igst = Currency(subtotal).multiply(GST_RATES.IGST / 100).value;
    return { cgst: 0, sgst: 0, igst, totalTax: igst };
  } else {
    const cgst = Currency(subtotal).multiply(GST_RATES.CGST / 100).value;
    const sgst = Currency(subtotal).multiply(GST_RATES.SGST / 100).value;
    return { cgst, sgst, igst: 0, totalTax: cgst + sgst };
  }
}

/**
 * Check if transaction is inter-state based on state codes
 */
export function isInterStateTransaction(
  originState: string,
  destinationState: string
): boolean {
  return originState.toLowerCase() !== destinationState.toLowerCase();
}

/**
 * Calculate complete invoice
 */
export function calculateInvoice(
  packages: PackageDetails[],
  charges: Partial<ChargeBreakdown>,
  ratePerKg: number,
  originState: string,
  destinationState: string,
  transportMode: keyof typeof VOLUMETRIC_FACTORS = "air",
  advancePaid: number = 0,
  declaredValue: number = 0
): InvoiceCalculation {
  // Calculate total weights
  let totalActualWeight = 0;
  let totalVolumetricWeight = 0;

  packages.forEach((pkg) => {
    const qty = pkg.quantity || 1;
    totalActualWeight += pkg.actualWeight * qty;

    if (pkg.dimensions) {
      const volWeight = calculateVolumetricWeight(pkg.dimensions, transportMode);
      totalVolumetricWeight += volWeight * qty;
    }
  });

  const chargeableWeight = calculateChargeableWeight(
    totalActualWeight,
    totalVolumetricWeight
  );

  // Calculate charges
  const freightCharge = calculateFreightCharge(chargeableWeight, ratePerKg);
  const insuranceCharge = charges.insuranceCharge ?? calculateInsuranceCharge(declaredValue);

  const fullCharges: ChargeBreakdown = {
    freightCharge,
    pickupCharge: charges.pickupCharge ?? 0,
    deliveryCharge: charges.deliveryCharge ?? 0,
    packingCharge: charges.packingCharge ?? 0,
    insuranceCharge,
    handlingCharge: charges.handlingCharge ?? 0,
    otherCharges: charges.otherCharges ?? 0,
  };

  // Calculate subtotal
  const subtotal = Object.values(fullCharges).reduce(
    (sum, charge) => Currency(sum).add(charge).value,
    0
  );

  // Calculate GST
  const isInterState = isInterStateTransaction(originState, destinationState);
  const gst = calculateGST(subtotal, isInterState);

  const grandTotal = Currency(subtotal).add(gst.totalTax).value;
  const balanceDue = Currency(grandTotal).subtract(advancePaid).value;

  return {
    actualWeight: Math.round(totalActualWeight * 100) / 100,
    volumetricWeight: Math.round(totalVolumetricWeight * 100) / 100,
    chargeableWeight: Math.round(chargeableWeight * 100) / 100,
    charges: fullCharges,
    tax: {
      subtotal,
      ...gst,
      grandTotal,
      isInterState,
    },
    balanceDue: Math.max(0, balanceDue),
    advancePaid,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Parse weight string to number
 */
export function parseWeight(weight: string | number): number {
  if (typeof weight === "number") return weight;
  const parsed = parseFloat(weight.replace(/[^\d.]/g, ""));
  return isNaN(parsed) ? 0 : parsed;
}
