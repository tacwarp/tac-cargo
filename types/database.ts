/**
 * Database entity types derived from Supabase schema
 * Single source of truth for all table shapes
 */

export type ShipmentStatus =
  | "booked"
  | "picked_up"
  | "at_origin_hub"
  | "in_transit"
  | "at_destination_hub"
  | "out_for_delivery"
  | "delivered"
  | "exception"
  | "returned"
  | "cancelled";

export type ManifestStatus = "draft" | "finalized" | "dispatched" | "in_transit" | "arrived" | "completed";

export type InvoiceType = "label" | "customer";

export type InvoiceStatus =
  | "draft"
  | "pending"
  | "paid"
  | "partial"
  | "overdue"
  | "cancelled";

export type TransportMode = "air" | "surface" | "express" | "economy";

export type PaymentMode = "prepaid" | "cod" | "credit" | "to_pay";

export type PaymentStatus = "pending" | "partial" | "completed" | "refunded";

export type CustomerType = "regular" | "corporate" | "vip";

export type UserRole = "admin" | "manager" | "operator" | "viewer";

// Database row types
export interface Shipment {
  id: string;
  reference: string;
  customer_id: string | null;
  consignee_name: string | null;
  consignee_phone: string | null;
  consignee_email: string | null;
  consignee_address: string | null;
  consignee_city: string | null;
  consignee_state: string | null;
  consignee_pincode: string | null;
  origin_warehouse_id: string | null;
  destination_warehouse_id: string | null;
  manifest_id: string | null;
  status: ShipmentStatus;
  transport_mode: TransportMode | null;
  payment_mode: PaymentMode | null;
  pieces: number | null;
  weight_kg: number | null;
  volumetric_weight: number | null;
  chargeable_weight: number | null;
  declared_value: number | null;
  cod_amount: number | null;
  service_level_id: string | null;
  notes: string | null;
  special_instructions: string | null;
  created_by: string | null;
  organization_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Manifest {
  id: string;
  manifest_number: string;
  origin_warehouse_id: string | null;
  destination_warehouse_id: string | null;
  transport_mode: TransportMode | null;
  status: ManifestStatus;
  vehicle_number: string | null;
  driver_name: string | null;
  driver_phone: string | null;
  seal_number: string | null;
  planned_departure: string | null;
  actual_departure: string | null;
  planned_arrival: string | null;
  actual_arrival: string | null;
  total_pieces: number | null;
  total_weight: number | null;
  notes: string | null;
  created_by: string | null;
  organization_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  invoice_no: string;
  type: InvoiceType;
  status: InvoiceStatus;
  shipment_id: string | null;
  customer_id: string | null;
  awb_no: string | null;
  origin_warehouse_id: string | null;
  destination_warehouse_id: string | null;
  consignee_name: string | null;
  consignee_address: string | null;
  consignee_city: string | null;
  consignee_state: string | null;
  consignee_pincode: string | null;
  subtotal: number;
  total_tax: number;
  total_amount: number;
  balance_due: number;
  invoice_date: string;
  due_date: string | null;
  pdf_url: string | null;
  sent_via_whatsapp_at: string | null;
  notes: string | null;
  created_by: string | null;
  organization_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  gst_number: string | null;
  customer_type: CustomerType;
  credit_limit: number;
  created_by: string | null;
  organization_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  phone: string | null;
  is_active: boolean;
  organization_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScanEvent {
  id: string;
  shipment_id: string | null;
  manifest_id: string | null;
  scan_type: string;
  location: string | null;
  warehouse_id: string | null;
  scanned_by: string | null;
  notes: string | null;
  organization_id: string | null;
  created_at: string;
}

export interface TrackingEvent {
  id: string;
  shipment_id: string;
  status: ShipmentStatus;
  location: string | null;
  description: string | null;
  is_public: boolean;
  organization_id: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_method: string | null;
  payment_reference: string | null;
  status: PaymentStatus;
  notes: string | null;
  received_by: string | null;
  organization_id: string | null;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  shipment_id: string | null;
  warehouse_id: string | null;
  location_code: string | null;
  status: string;
  notes: string | null;
  organization_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  warehouse_id: string | null;
  is_active: boolean;
  organization_id: string | null;
  permissions: unknown[];
  preferences: { theme: string; notifications: boolean };
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  phone: string | null;
  email: string | null;
  gst_number: string | null;
  pan_number: string | null;
  logo_url: string | null;
  settings: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
