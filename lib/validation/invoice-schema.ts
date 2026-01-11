import { z } from "zod";

/**
 * Enhanced Invoice Validation Schema with IATA Compliance
 */
export const enhancedInvoiceSchema = z.object({
  // Transport & Payment
  transportMode: z.enum(["air", "surface", "express", "economy"]),
  paymentMode: z.enum(["PREPAID", "COD", "TO PAY", "CREDIT"]),
  
  // Consignor Details
  consignor: z.object({
    name: z.string().min(1, "Consignor name is required"),
    phone: z.string().min(10, "Valid phone number required"),
    email: z.string().email().optional().or(z.literal("")),
    gstin: z.string().optional().or(z.literal("")),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().regex(/^\d{6}$/, "Valid 6-digit pincode required"),
  }),
  
  // Consignee Details
  consignee: z.object({
    name: z.string().min(1, "Consignee name is required"),
    phone: z.string().min(10, "Valid phone number required"),
    email: z.string().email().optional().or(z.literal("")),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().regex(/^\d{6}$/, "Valid 6-digit pincode required"),
  }),
  
  // Package Details
  packages: z.array(
    z.object({
      description: z.string().min(1, "Description is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      weight: z.number().min(0.1, "Weight must be greater than 0"),
      length: z.number().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
      declaredValue: z.number().optional(),
      hsCode: z.string().optional(),
    })
  ).min(1, "At least one package is required"),
  
  // Charges
  charges: z.object({
    ratePerKg: z.number().min(0, "Rate must be positive"),
    pickupCharge: z.number().optional(),
    deliveryCharge: z.number().optional(),
    packingCharge: z.number().optional(),
    insuranceCharge: z.number().optional(),
    handlingCharge: z.number().optional(),
    otherCharges: z.number().optional(),
    advancePaid: z.number().optional(),
  }),
  
  // IATA Compliance Fields (Optional)
  hsCode: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  incoterms: z.enum(["EXW", "FCA", "CPT", "CIP", "DAP", "DPU", "DDP", "FAS", "FOB", "CFR", "CIF"]).optional(),
  masterAWB: z.string().optional(),
  houseAWB: z.string().optional(),
  
  // Dangerous Goods
  dangerousGoods: z.boolean().optional(),
  dgClass: z.string().optional(),
  unNumber: z.string().optional(),
  
  // Additional
  remarks: z.string().optional(),
  specialInstructions: z.string().optional(),
  customerId: z.string().uuid().optional(),
  shipmentId: z.string().uuid().optional(),
});

export type EnhancedInvoiceInput = z.infer<typeof enhancedInvoiceSchema>;

/**
 * Customer Validation Schema
 */
export const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/, "Valid 6-digit pincode required").optional().or(z.literal("")),
  gstNumber: z.string().optional(),
  customerType: z.enum(["regular", "corporate", "vip"]).default("regular"),
  creditLimit: z.number().min(0).default(0),
});

export type CustomerInput = z.infer<typeof customerSchema>;

/**
 * Payment Validation Schema
 */
export const paymentSchema = z.object({
  invoiceId: z.string().uuid("Valid invoice ID required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  paymentMethod: z.enum(["cash", "card", "upi", "bank_transfer", "cheque"]).optional(),
  paymentReference: z.string().optional(),
  notes: z.string().optional(),
});

export type PaymentInput = z.infer<typeof paymentSchema>;

/**
 * Manifest Validation Schema
 */
export const manifestSchema = z.object({
  transportMode: z.enum(["air", "surface", "express"]),
  vehicleNumber: z.string().optional(),
  driverName: z.string().optional(),
  driverPhone: z.string().optional(),
  sealNumber: z.string().optional(),
  plannedDeparture: z.string().datetime().optional(),
  plannedArrival: z.string().datetime().optional(),
  originWarehouseId: z.string().uuid("Valid warehouse ID required"),
  destinationWarehouseId: z.string().uuid("Valid warehouse ID required"),
  notes: z.string().optional(),
});

export type ManifestInput = z.infer<typeof manifestSchema>;

/**
 * Webhook Validation Schema
 */
export const webhookSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Valid URL required"),
  events: z.array(z.string()).min(1, "At least one event is required"),
  secret: z.string().min(16, "Secret must be at least 16 characters"),
});

export type WebhookInput = z.infer<typeof webhookSchema>;
