/**
 * Supabase Database Types for TAC Cargo Logistics Platform
 * Auto-generated schema types matching the migration
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

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

export type TransportMode = "air" | "surface" | "express" | "economy";

export type PaymentMode = "prepaid" | "to_pay" | "credit";

export type InvoiceStatus =
  | "draft"
  | "pending"
  | "paid"
  | "partial"
  | "overdue"
  | "cancelled";

export type ManifestStatus =
  | "draft"
  | "finalized"
  | "dispatched"
  | "in_transit"
  | "arrived"
  | "completed";

export type ScanEventType =
  | "booking"
  | "pickup"
  | "arrival_hub"
  | "departure_hub"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "exception"
  | "return_initiated"
  | "returned";

export type ExceptionType =
  | "address_issue"
  | "customer_unavailable"
  | "damaged"
  | "delayed"
  | "lost"
  | "refused"
  | "weather"
  | "other";

export type PaymentMethod =
  | "cash"
  | "upi"
  | "bank_transfer"
  | "card"
  | "credit_account"
  | "cheque";

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          customer_code: string | null;
          name: string;
          email: string | null;
          phone: string | null;
          gstin: string | null;
          pan: string | null;
          credit_limit: number;
          credit_balance: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["customers"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["customers"]["Insert"]>;
      };
      addresses: {
        Row: {
          id: string;
          customer_id: string | null;
          type: string;
          contact_name: string | null;
          contact_phone: string | null;
          line1: string;
          line2: string | null;
          city: string;
          state: string;
          pincode: string;
          country: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["addresses"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["addresses"]["Insert"]>;
      };
      warehouses: {
        Row: {
          id: string;
          code: string;
          name: string;
          address: string | null;
          city: string;
          state: string;
          pincode: string | null;
          phone: string | null;
          email: string | null;
          is_hub: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["warehouses"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["warehouses"]["Insert"]>;
      };
      invoices: {
        Row: {
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
        };
        Insert: Omit<
          Database["public"]["Tables"]["invoices"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["invoices"]["Insert"]>;
      };
      packages: {
        Row: {
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
        };
        Insert: Omit<
          Database["public"]["Tables"]["packages"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["packages"]["Insert"]>;
      };
      shipments: {
        Row: {
          id: string;
          invoice_id: string;
          awb_no: string;
          status: ShipmentStatus;
          current_location: string | null;
          current_warehouse_id: string | null;
          booked_at: string;
          picked_up_at: string | null;
          eta: string | null;
          delivered_at: string | null;
          pod_signature_url: string | null;
          pod_photo_url: string | null;
          pod_receiver_name: string | null;
          pod_receiver_relation: string | null;
          pod_timestamp: string | null;
          pod_latitude: number | null;
          pod_longitude: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["shipments"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["shipments"]["Insert"]>;
      };
      shipment_events: {
        Row: {
          id: string;
          shipment_id: string;
          event_type: ScanEventType;
          location: string | null;
          warehouse_id: string | null;
          remarks: string | null;
          scanned_by: string | null;
          device_id: string | null;
          latitude: number | null;
          longitude: number | null;
          event_timestamp: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["shipment_events"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["shipment_events"]["Insert"]
        >;
      };
      exceptions: {
        Row: {
          id: string;
          shipment_id: string;
          exception_type: ExceptionType;
          description: string | null;
          resolution: string | null;
          is_resolved: boolean;
          resolved_at: string | null;
          resolved_by: string | null;
          photo_urls: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["exceptions"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["exceptions"]["Insert"]>;
      };
      manifests: {
        Row: {
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
        };
        Insert: Omit<
          Database["public"]["Tables"]["manifests"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["manifests"]["Insert"]>;
      };
      manifest_shipments: {
        Row: {
          id: string;
          manifest_id: string;
          shipment_id: string;
          scanned_at: string;
          scanned_by: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["manifest_shipments"]["Row"],
          "id"
        >;
        Update: Partial<
          Database["public"]["Tables"]["manifest_shipments"]["Insert"]
        >;
      };
      inventory: {
        Row: {
          id: string;
          shipment_id: string;
          warehouse_id: string;
          bin_location: string | null;
          shelf_location: string | null;
          checked_in_at: string;
          checked_out_at: string | null;
          checked_in_by: string | null;
          checked_out_by: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["inventory"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["inventory"]["Insert"]>;
      };
      payments: {
        Row: {
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
        };
        Insert: Omit<
          Database["public"]["Tables"]["payments"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
      };
      rate_cards: {
        Row: {
          id: string;
          name: string;
          origin_zone: string | null;
          destination_zone: string | null;
          transport_mode: TransportMode | null;
          base_rate: number | null;
          per_kg_rate: number | null;
          min_weight: number;
          is_active: boolean;
          valid_from: string | null;
          valid_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["rate_cards"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["rate_cards"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      generate_invoice_no: {
        Args: Record<string, never>;
        Returns: string;
      };
      generate_awb_no: {
        Args: Record<string, never>;
        Returns: string;
      };
      generate_manifest_no: {
        Args: Record<string, never>;
        Returns: string;
      };
      calculate_volumetric_weight: {
        Args: { l: number; w: number; h: number };
        Returns: number;
      };
    };
    Enums: {
      shipment_status: ShipmentStatus;
      transport_mode: TransportMode;
      payment_mode: PaymentMode;
      invoice_status: InvoiceStatus;
      manifest_status: ManifestStatus;
      scan_event_type: ScanEventType;
      exception_type: ExceptionType;
      payment_method: PaymentMethod;
    };
  };
}

// Utility types for common operations
export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type CustomerInsert =
  Database["public"]["Tables"]["customers"]["Insert"];
export type Address = Database["public"]["Tables"]["addresses"]["Row"];
export type Warehouse = Database["public"]["Tables"]["warehouses"]["Row"];
export type Invoice = Database["public"]["Tables"]["invoices"]["Row"];
export type InvoiceInsert = Database["public"]["Tables"]["invoices"]["Insert"];
export type Package = Database["public"]["Tables"]["packages"]["Row"];
export type PackageInsert = Database["public"]["Tables"]["packages"]["Insert"];
export type Shipment = Database["public"]["Tables"]["shipments"]["Row"];
export type ShipmentEvent =
  Database["public"]["Tables"]["shipment_events"]["Row"];
export type Exception = Database["public"]["Tables"]["exceptions"]["Row"];
export type Manifest = Database["public"]["Tables"]["manifests"]["Row"];
export type ManifestShipment =
  Database["public"]["Tables"]["manifest_shipments"]["Row"];
export type Inventory = Database["public"]["Tables"]["inventory"]["Row"];
export type Payment = Database["public"]["Tables"]["payments"]["Row"];
export type RateCard = Database["public"]["Tables"]["rate_cards"]["Row"];

// Invoice with relations
export interface InvoiceWithRelations extends Invoice {
  customer?: Customer | null;
  packages?: Package[];
  shipment?: Shipment | null;
  origin_warehouse?: Warehouse | null;
  destination_warehouse?: Warehouse | null;
}

// Shipment with tracking events
export interface ShipmentWithEvents extends Shipment {
  events?: ShipmentEvent[];
  invoice?: Invoice | null;
}

// Manifest with shipments
export interface ManifestWithShipments extends Manifest {
  shipments?: ShipmentWithEvents[];
  origin_warehouse?: Warehouse | null;
  destination_warehouse?: Warehouse | null;
}
