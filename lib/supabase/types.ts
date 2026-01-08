/**
 * @fileoverview Supabase database types
 * @module lib/supabase/types
 *
 * Type definitions for the TAC Cargo database schema.
 * These types should match your Supabase database structure.
 *
 * @note Generate these types automatically using:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts
 */

/**
 * Database schema definition
 */
export interface Database {
  public: {
    Tables: {
      customers: {
        Row: Customer;
        Insert: CustomerInsert;
        Update: CustomerUpdate;
      };
      warehouses: {
        Row: Warehouse;
        Insert: WarehouseInsert;
        Update: WarehouseUpdate;
      };
      shipments: {
        Row: Shipment;
        Insert: ShipmentInsert;
        Update: ShipmentUpdate;
      };
      scan_events: {
        Row: ScanEvent;
        Insert: ScanEventInsert;
        Update: ScanEventUpdate;
      };
      invoices: {
        Row: Invoice;
        Insert: InvoiceInsert;
        Update: InvoiceUpdate;
      };
      packages: {
        Row: Package;
        Insert: PackageInsert;
        Update: PackageUpdate;
      };
      manifests: {
        Row: Manifest;
        Insert: ManifestInsert;
        Update: ManifestUpdate;
      };
      payments: {
        Row: Payment;
        Insert: PaymentInsert;
        Update: PaymentUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      shipment_status: ShipmentStatus;
      transport_mode: TransportMode;
      scan_type: ScanType;
      invoice_status: InvoiceStatus;
      payment_mode: PaymentMode;
      manifest_status: ManifestStatus;
    };
  };
}

/**
 * Shipment status enum
 */
export type ShipmentStatus =
  | "pending"
  | "picked_up"
  | "in_transit"
  | "at_hub"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "exception";

/**
 * Transport mode enum
 */
export type TransportMode = "air" | "surface" | "express" | "economy";

/**
 * Scan event type enum
 */
export type ScanType =
  | "pickup"
  | "arrival"
  | "departure"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "exception"
  | "return";

/**
 * Customer table row type
 */
export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  gst_number: string | null;
  created_at: string;
  updated_at: string;
}

export type CustomerInsert = Omit<Customer, "id" | "created_at" | "updated_at">;
export type CustomerUpdate = Partial<CustomerInsert>;

/**
 * Warehouse table row type
 */
export interface Warehouse {
  id: string;
  code: string;
  name: string;
  address: string | null;
  city: string;
  state: string;
  pincode: string | null;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type WarehouseInsert = Omit<
  Warehouse,
  "id" | "created_at" | "updated_at"
>;
export type WarehouseUpdate = Partial<WarehouseInsert>;

/**
 * Shipment table row type
 */
export interface Shipment {
  id: string;
  reference: string;
  customer_id: string | null;
  origin_warehouse_id: string | null;
  destination_warehouse_id: string | null;
  status: ShipmentStatus;
  transport_mode: TransportMode;
  weight: number | null;
  pieces: number | null;
  description: string | null;
  consignee_name: string | null;
  consignee_address: string | null;
  consignee_phone: string | null;
  consignee_email: string | null;
  eta: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ShipmentInsert = Omit<Shipment, "id" | "created_at" | "updated_at">;
export type ShipmentUpdate = Partial<ShipmentInsert>;

/**
 * Scan event table row type
 */
export interface ScanEvent {
  id: string;
  shipment_id: string;
  warehouse_id: string | null;
  scan_type: ScanType;
  location: string | null;
  remarks: string | null;
  scanned_by: string | null;
  scanned_at: string;
  created_at: string;
}

export type ScanEventInsert = Omit<ScanEvent, "id" | "created_at">;
export type ScanEventUpdate = Partial<ScanEventInsert>;

/**
 * Shipment with related data (for API responses)
 */
export interface ShipmentWithRelations extends Shipment {
  customer: Pick<Customer, "name" | "phone" | "email"> | null;
  origin_warehouse: Pick<Warehouse, "code" | "name" | "city" | "state"> | null;
  destination_warehouse: Pick<
    Warehouse,
    "code" | "name" | "city" | "state"
  > | null;
}

/**
 * Scan event with warehouse data
 */
export interface ScanEventWithWarehouse extends ScanEvent {
  warehouse: Pick<Warehouse, "code" | "name" | "city"> | null;
}

/**
 * Tracking API response type
 */
export interface TrackingResponse {
  shipment: {
    reference: string;
    status: ShipmentStatus;
    transport_mode: TransportMode;
    weight: number | null;
    pieces: number | null;
    description: string | null;
    eta: string | null;
    delivered_at: string | null;
    created_at: string;
    consignee_name: string | null;
    consignee_address: string | null;
    consignee_phone: string | null;
    origin: Pick<Warehouse, "code" | "name" | "city" | "state"> | null;
    destination: Pick<Warehouse, "code" | "name" | "city" | "state"> | null;
    customer: Pick<Customer, "name" | "phone" | "email"> | null;
  };
  events: ScanEventWithWarehouse[];
}

/**
 * API error response type
 */
export interface ApiError {
  error: string;
  code: string;
  details?: unknown;
}

/**
 * Invoice status enum
 */
export type InvoiceStatus =
  | "draft"
  | "pending"
  | "paid"
  | "partial"
  | "overdue"
  | "cancelled";

/**
 * Payment mode enum
 */
export type PaymentMode = "prepaid" | "to_pay" | "credit";

/**
 * Manifest status enum
 */
export type ManifestStatus =
  | "draft"
  | "finalized"
  | "dispatched"
  | "in_transit"
  | "arrived"
  | "completed";

/**
 * Invoice table row type
 */
export interface Invoice {
  id: string;
  invoice_no: string;
  awb_no: string;
  barcode_data: string | null;
  customer_id: string | null;
  shipper_name: string | null;
  shipper_address: string | null;
  shipper_phone: string | null;
  shipper_gstin: string | null;
  consignee_name: string;
  consignee_address: string;
  consignee_city: string;
  consignee_state: string;
  consignee_pincode: string;
  consignee_phone: string | null;
  consignee_email: string | null;
  origin_warehouse_id: string | null;
  destination_warehouse_id: string | null;
  transport_mode: TransportMode;
  payment_mode: PaymentMode;
  total_pieces: number;
  total_weight: number | null;
  total_volumetric_weight: number | null;
  chargeable_weight: number | null;
  declared_value: number | null;
  content_description: string | null;
  freight_charge: number;
  pickup_charge: number;
  delivery_charge: number;
  packing_charge: number;
  insurance_charge: number;
  handling_charge: number;
  other_charges: number;
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total_tax: number;
  total_amount: number;
  status: InvoiceStatus;
  invoice_date: string;
  due_date: string | null;
  paid_amount: number;
  balance_due: number;
  invoice_pdf_url: string | null;
  label_pdf_url: string | null;
  notes: string | null;
  special_instructions: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type InvoiceInsert = Omit<Invoice, "id" | "created_at" | "updated_at">;
export type InvoiceUpdate = Partial<InvoiceInsert>;

/**
 * Package table row type
 */
export interface Package {
  id: string;
  invoice_id: string;
  package_no: number;
  length: number | null;
  width: number | null;
  height: number | null;
  actual_weight: number | null;
  volumetric_weight: number | null;
  description: string | null;
  declared_value: number | null;
  packaging_type: string | null;
  is_fragile: boolean;
  requires_special_handling: boolean;
  handling_notes: string | null;
  created_at: string;
}

export type PackageInsert = Omit<Package, "id" | "created_at">;
export type PackageUpdate = Partial<PackageInsert>;

/**
 * Manifest table row type
 */
export interface Manifest {
  id: string;
  manifest_no: string;
  barcode_data: string | null;
  origin_warehouse_id: string | null;
  destination_warehouse_id: string | null;
  transport_mode: TransportMode;
  vehicle_no: string | null;
  driver_name: string | null;
  driver_phone: string | null;
  flight_no: string | null;
  total_shipments: number;
  total_pieces: number;
  total_weight: number;
  status: ManifestStatus;
  dispatch_time: string | null;
  arrival_time: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type ManifestInsert = Omit<Manifest, "id" | "created_at" | "updated_at">;
export type ManifestUpdate = Partial<ManifestInsert>;

/**
 * Payment method enum
 */
export type PaymentMethod =
  | "cash"
  | "upi"
  | "bank_transfer"
  | "card"
  | "credit_account"
  | "cheque";

/**
 * Payment table row type
 */
export interface Payment {
  id: string;
  invoice_id: string;
  payment_method: PaymentMethod;
  amount: number;
  transaction_id: string | null;
  reference_no: string | null;
  payment_date: string;
  received_by: string | null;
  notes: string | null;
  created_at: string;
}

export type PaymentInsert = Omit<Payment, "id" | "created_at">;
export type PaymentUpdate = Partial<PaymentInsert>;
