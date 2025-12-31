export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      barcodes: {
        Row: {
          barcode_number: string
          barcode_type: string | null
          created_at: string | null
          id: string
          shipment_id: string | null
          status: string | null
        }
        Insert: {
          barcode_number: string
          barcode_type?: string | null
          created_at?: string | null
          id?: string
          shipment_id?: string | null
          status?: string | null
        }
        Update: {
          barcode_number?: string
          barcode_type?: string | null
          created_at?: string | null
          id?: string
          shipment_id?: string | null
          status?: string | null
        }
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          created_by: string | null
          credit_limit: number | null
          customer_type: Database["public"]["Enums"]["customer_type"] | null
          email: string | null
          gst_number: string | null
          id: string
          name: string
          phone: string
          pincode: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          created_by?: string | null
          credit_limit?: number | null
          customer_type?: Database["public"]["Enums"]["customer_type"] | null
          email?: string | null
          gst_number?: string | null
          id?: string
          name: string
          phone: string
          pincode?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          created_by?: string | null
          credit_limit?: number | null
          customer_type?: Database["public"]["Enums"]["customer_type"] | null
          email?: string | null
          gst_number?: string | null
          id?: string
          name?: string
          phone?: string
          pincode?: string | null
          state?: string | null
          updated_at?: string | null
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
          warehouse_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          warehouse_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          warehouse_id?: string | null
        }
      }
      scan_events: {
        Row: {
          created_at: string | null
          id: string
          location: string
          notes: string | null
          barcode_id: string | null
          scanned_at: string | null
          scanned_by: string | null
          shipment_id: string | null
          status: string
          warehouse_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          location: string
          notes?: string | null
          barcode_id?: string | null
          scanned_at?: string | null
          scanned_by?: string | null
          shipment_id?: string | null
          status: string
          warehouse_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string
          notes?: string | null
          barcode_id?: string | null
          scanned_at?: string | null
          scanned_by?: string | null
          shipment_id?: string | null
          status?: string
          warehouse_id?: string | null
        }
      }
      shipments: {
        Row: {
          chargeable_weight: number | null
          consignee_address: string | null
          consignee_name: string | null
          consignee_phone: string | null
          created_at: string | null
          created_by: string | null
          customer_id: string
          delivered_at: string | null
          description: string | null
          destination_warehouse_id: string
          eta: string | null
          height_cm: number | null
          id: string
          length_cm: number | null
          origin_warehouse_id: string
          pieces: number | null
          reference: string
          special_instructions: string | null
          status: Database["public"]["Enums"]["shipment_status"] | null
          transport_mode: Database["public"]["Enums"]["transport_mode"] | null
          updated_at: string | null
          volumetric_weight: number | null
          weight: number
          width_cm: number | null
        }
        Insert: {
          chargeable_weight?: number | null
          consignee_address?: string | null
          consignee_name?: string | null
          consignee_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          delivered_at?: string | null
          description?: string | null
          destination_warehouse_id: string
          eta?: string | null
          height_cm?: number | null
          id?: string
          length_cm?: number | null
          origin_warehouse_id: string
          pieces?: number | null
          reference: string
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["shipment_status"] | null
          transport_mode?: Database["public"]["Enums"]["transport_mode"] | null
          updated_at?: string | null
          volumetric_weight?: number | null
          weight: number
          width_cm?: number | null
        }
        Update: {
          chargeable_weight?: number | null
          consignee_address?: string | null
          consignee_name?: string | null
          consignee_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          delivered_at?: string | null
          description?: string | null
          destination_warehouse_id?: string
          eta?: string | null
          height_cm?: number | null
          id?: string
          length_cm?: number | null
          origin_warehouse_id?: string
          pieces?: number | null
          reference?: string
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["shipment_status"] | null
          transport_mode?: Database["public"]["Enums"]["transport_mode"] | null
          updated_at?: string | null
          volumetric_weight?: number | null
          weight?: number
          width_cm?: number | null
        }
      }
      warehouses: {
        Row: {
          address: string | null
          city: string | null
          code: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          pincode: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          code: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          code?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      customer_type: "regular" | "corporate" | "vip"
      invoice_status: "pending" | "paid" | "overdue" | "cancelled"
      manifest_status: "draft" | "finalized" | "dispatched" | "received"
      payment_mode: "cash" | "upi" | "neft" | "cheque" | "credit"
      shipment_status:
        | "pending"
        | "picked_up"
        | "in_transit"
        | "at_hub"
        | "out_for_delivery"
        | "delivered"
        | "cancelled"
        | "exception"
      transport_mode: "air" | "surface" | "express"
      user_role: "admin" | "manager" | "operator" | "viewer"
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T]
