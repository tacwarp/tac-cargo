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
        Row: Customer
        Insert: CustomerInsert
        Update: CustomerUpdate
      }
      warehouses: {
        Row: Warehouse
        Insert: WarehouseInsert
        Update: WarehouseUpdate
      }
      shipments: {
        Row: Shipment
        Insert: ShipmentInsert
        Update: ShipmentUpdate
      }
      scan_events: {
        Row: ScanEvent
        Insert: ScanEventInsert
        Update: ScanEventUpdate
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      shipment_status: ShipmentStatus
      transport_mode: TransportMode
      scan_type: ScanType
    }
  }
}

/**
 * Shipment status enum
 */
export type ShipmentStatus =
  | 'pending'
  | 'picked_up'
  | 'in_transit'
  | 'at_hub'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'exception'

/**
 * Transport mode enum
 */
export type TransportMode = 'air' | 'surface' | 'express' | 'economy'

/**
 * Scan event type enum
 */
export type ScanType =
  | 'pickup'
  | 'arrival'
  | 'departure'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'exception'
  | 'return'

/**
 * Customer table row type
 */
export interface Customer {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  pincode: string | null
  gst_number: string | null
  created_at: string
  updated_at: string
}

export type CustomerInsert = Omit<Customer, 'id' | 'created_at' | 'updated_at'>
export type CustomerUpdate = Partial<CustomerInsert>

/**
 * Warehouse table row type
 */
export interface Warehouse {
  id: string
  code: string
  name: string
  address: string | null
  city: string
  state: string
  pincode: string | null
  phone: string | null
  email: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type WarehouseInsert = Omit<Warehouse, 'id' | 'created_at' | 'updated_at'>
export type WarehouseUpdate = Partial<WarehouseInsert>

/**
 * Shipment table row type
 */
export interface Shipment {
  id: string
  reference: string
  customer_id: string | null
  origin_warehouse_id: string | null
  destination_warehouse_id: string | null
  status: ShipmentStatus
  transport_mode: TransportMode
  weight: number | null
  pieces: number | null
  description: string | null
  consignee_name: string | null
  consignee_address: string | null
  consignee_phone: string | null
  consignee_email: string | null
  eta: string | null
  delivered_at: string | null
  created_at: string
  updated_at: string
}

export type ShipmentInsert = Omit<Shipment, 'id' | 'created_at' | 'updated_at'>
export type ShipmentUpdate = Partial<ShipmentInsert>

/**
 * Scan event table row type
 */
export interface ScanEvent {
  id: string
  shipment_id: string
  warehouse_id: string | null
  scan_type: ScanType
  location: string | null
  remarks: string | null
  scanned_by: string | null
  scanned_at: string
  created_at: string
}

export type ScanEventInsert = Omit<ScanEvent, 'id' | 'created_at'>
export type ScanEventUpdate = Partial<ScanEventInsert>

/**
 * Shipment with related data (for API responses)
 */
export interface ShipmentWithRelations extends Shipment {
  customer: Pick<Customer, 'name' | 'phone' | 'email'> | null
  origin_warehouse: Pick<Warehouse, 'code' | 'name' | 'city' | 'state'> | null
  destination_warehouse: Pick<Warehouse, 'code' | 'name' | 'city' | 'state'> | null
}

/**
 * Scan event with warehouse data
 */
export interface ScanEventWithWarehouse extends ScanEvent {
  warehouse: Pick<Warehouse, 'code' | 'name' | 'city'> | null
}

/**
 * Tracking API response type
 */
export interface TrackingResponse {
  shipment: {
    reference: string
    status: ShipmentStatus
    transport_mode: TransportMode
    weight: number | null
    pieces: number | null
    description: string | null
    eta: string | null
    delivered_at: string | null
    created_at: string
    consignee_name: string | null
    consignee_address: string | null
    consignee_phone: string | null
    origin: Pick<Warehouse, 'code' | 'name' | 'city' | 'state'> | null
    destination: Pick<Warehouse, 'code' | 'name' | 'city' | 'state'> | null
    customer: Pick<Customer, 'name' | 'phone' | 'email'> | null
  }
  events: ScanEventWithWarehouse[]
}

/**
 * API error response type
 */
export interface ApiError {
  error: string
  code: string
  details?: unknown
}
