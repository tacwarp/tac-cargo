import { z } from "zod";

/**
 * Shipment creation and validation schema
 * Enforces business rules and data constraints
 */
export const shipmentSchema = z.object({
  customer_id: z.string().uuid("Invalid customer").optional().or(z.literal("")),
  reference: z
    .string()
    .min(3, "Reference must be at least 3 characters")
    .optional(),
  origin_warehouse_id: z.string().uuid("Select origin warehouse").optional().or(z.literal("")),
  destination_warehouse_id: z.string().uuid("Select destination warehouse").optional().or(z.literal("")),
  transport_mode: z.enum(["air", "surface", "express", "economy"], {
    message: "Select a valid transport mode",
  }),
  service_level_id: z.string().uuid("Select service level").optional().or(z.literal("")),
  weight_kg: z
    .number()
    .positive("Weight must be positive")
    .max(30000, "Maximum weight is 30,000 kg (30 tons)")
    .optional(),
  pieces: z
    .number()
    .int("Pieces must be a whole number")
    .positive("Pieces must be positive")
    .max(10000, "Maximum 10,000 pieces per shipment"),
  consignee_name: z
    .string()
    .min(2, "Consignee name is required")
    .max(100, "Name too long"),
  consignee_phone: z
    .string()
    .min(10, "Phone number is required")
    .max(15, "Phone number too long"),
  consignee_email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  consignee_address: z
    .string()
    .min(5, "Address is required")
    .max(500, "Address too long"),
  consignee_city: z.string().min(2, "City is required"),
  consignee_state: z.string().min(2, "State is required"),
  consignee_pincode: z
    .string()
    .min(5, "Pincode is required")
    .max(10, "Pincode too long"),
  declared_value: z.number().positive().optional(),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

export type ShipmentFormData = z.infer<typeof shipmentSchema>;

/**
 * Manifest creation schema
 */
export const manifestSchema = z.object({
  manifest_number: z
    .string()
    .min(5, "Manifest number is required")
    .regex(/^MNF-[A-Z0-9]+$/, "Must start with MNF-"),
  origin_warehouse_id: z.string().uuid("Select origin warehouse"),
  destination_warehouse_id: z.string().uuid("Select destination warehouse"),
  transport_mode: z.enum(["air", "surface", "express", "economy"]),
  vehicle_number: z
    .string()
    .min(5, "Vehicle number is required")
    .max(20, "Vehicle number too long")
    .optional(),
  driver_name: z
    .string()
    .min(2, "Driver name is required")
    .max(100, "Name too long")
    .optional(),
  driver_phone: z
    .string()
    .regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number")
    .optional(),
  planned_departure: z.string().datetime("Invalid departure time"),
  planned_arrival: z.string().datetime("Invalid arrival time"),
  seal_number: z
    .string()
    .min(5, "Seal number is required")
    .max(50, "Seal number too long")
    .optional(),
});

export type ManifestFormData = z.infer<typeof manifestSchema>;

/**
 * Invoice creation schema
 */
export const invoiceSchema = z.object({
  invoice_number: z
    .string()
    .min(5, "Invoice number is required")
    .regex(/^INV-[A-Z0-9]+$/, "Must start with INV-"),
  customer_id: z.string().uuid("Select customer"),
  invoice_date: z.string().date("Invalid invoice date"),
  due_date: z.string().date("Invalid due date"),
  payment_terms: z.string().max(100, "Payment terms too long").optional(),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;

/**
 * Customer creation schema
 */
export const customerSchema = z.object({
  name: z.string().min(2, "Company name is required").max(200, "Name too long"),
  gst_number: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GST number format",
    )
    .optional()
    .or(z.literal("")),
  contact_person: z
    .string()
    .min(2, "Contact person name is required")
    .max(100, "Name too long"),
  contact_email: z.string().email("Invalid email address"),
  contact_phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number"),
  billing_address: z
    .string()
    .min(10, "Billing address is required")
    .max(500, "Address too long"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode. Must be 6 digits"),
  credit_limit: z
    .number()
    .nonnegative("Credit limit cannot be negative")
    .optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
