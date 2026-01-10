/**
 * Invoice Module Exports
 * Central export for all invoice-related utilities
 */

// ID Generation
export {
  generateInvoiceNumber,
  generateAWBNumber,
  generateConsignmentNumber,
  generateBarcodeNumber,
  generateAllIds,
  validateAWBNumber,
  validateInvoiceNumber,
  generateSortCode,
  generateDeliveryStationCode,
  type IDGeneratorResult,
} from "./id-generator";

// Calculations
export {
  calculateVolumetricWeight,
  calculateChargeableWeight,
  calculateFreightCharge,
  calculateInsuranceCharge,
  calculateGST,
  calculateInvoice,
  isInterStateTransaction,
  formatCurrency,
  parseWeight,
  VOLUMETRIC_FACTORS,
  GST_RATES,
  type Dimensions,
  type PackageDetails,
  type ChargeBreakdown,
  type TaxCalculation,
  type InvoiceCalculation,
} from "./calculations";

// Indian Cities Data
export {
  INDIAN_CITIES,
  INDIAN_STATES,
  PRIORITY_CITIES,
  getCityByName,
  getCitiesByState,
  searchCities,
  getStateByCode,
  type City,
} from "./indian-cities";

// PDF Generation
export {
  generateInvoicePDF,
  generateAWBLabelPDF,
  downloadPDF,
  getPDFBlob,
  getPDFBase64,
} from "./pdf-generator";
