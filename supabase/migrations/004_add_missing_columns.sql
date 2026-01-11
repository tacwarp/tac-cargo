-- =====================================================
-- Migration: Add missing columns to match application schema
-- Date: 2026-01-09
-- =====================================================

-- Add missing columns to shipments table
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS reference VARCHAR(50);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES customers(id);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS consignee_name VARCHAR(255);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS consignee_phone VARCHAR(20);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS consignee_email VARCHAR(255);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS consignee_address TEXT;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS consignee_city VARCHAR(100);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS consignee_state VARCHAR(100);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS consignee_pincode VARCHAR(10);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS origin_warehouse_id UUID REFERENCES warehouses(id);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS destination_warehouse_id UUID REFERENCES warehouses(id);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS manifest_id UUID;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS transport_mode VARCHAR(20);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS payment_mode VARCHAR(20);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS pieces INTEGER DEFAULT 1;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS weight_kg DECIMAL(10, 2);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS volumetric_weight DECIMAL(10, 2);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS chargeable_weight DECIMAL(10, 2);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS declared_value DECIMAL(12, 2);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS cod_amount DECIMAL(12, 2);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS special_instructions TEXT;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS organization_id UUID;

-- Add missing columns to manifests table
ALTER TABLE manifests ADD COLUMN IF NOT EXISTS manifest_number VARCHAR(50);
ALTER TABLE manifests ADD COLUMN IF NOT EXISTS origin_warehouse_id UUID REFERENCES warehouses(id);
ALTER TABLE manifests ADD COLUMN IF NOT EXISTS destination_warehouse_id UUID REFERENCES warehouses(id);
ALTER TABLE manifests ADD COLUMN IF NOT EXISTS transport_mode VARCHAR(20);
ALTER TABLE manifests ADD COLUMN IF NOT EXISTS vehicle_number VARCHAR(50);
ALTER TABLE manifests ADD COLUMN IF NOT EXISTS driver_name VARCHAR(255);
ALTER TABLE manifests ADD COLUMN IF NOT EXISTS driver_phone VARCHAR(20);
ALTER TABLE manifests ADD COLUMN IF NOT EXISTS seal_number VARCHAR(50);
ALTER TABLE manifests ADD COLUMN IF NOT EXISTS planned_departure TIMESTAMPTZ;
ALTER TABLE manifests ADD COLUMN IF NOT EXISTS actual_departure TIMESTAMPTZ;
ALTER TABLE manifests ADD COLUMN IF NOT EXISTS planned_arrival TIMESTAMPTZ;
ALTER TABLE manifests ADD COLUMN IF NOT EXISTS actual_arrival TIMESTAMPTZ;
ALTER TABLE manifests ADD COLUMN IF NOT EXISTS total_pieces INTEGER;
ALTER TABLE manifests ADD COLUMN IF NOT EXISTS total_weight DECIMAL(10, 2);
ALTER TABLE manifests ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE manifests ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE manifests ADD COLUMN IF NOT EXISTS organization_id UUID;

-- Add missing columns to invoices table  
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'label';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS shipment_id UUID;

-- Create manifests table if it doesn't exist
CREATE TABLE IF NOT EXISTS manifests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manifest_number VARCHAR(50) UNIQUE,
  origin_warehouse_id UUID REFERENCES warehouses(id),
  destination_warehouse_id UUID REFERENCES warehouses(id),
  transport_mode VARCHAR(20) DEFAULT 'surface',
  status VARCHAR(20) DEFAULT 'draft',
  vehicle_number VARCHAR(50),
  driver_name VARCHAR(255),
  driver_phone VARCHAR(20),
  seal_number VARCHAR(50),
  planned_departure TIMESTAMPTZ,
  actual_departure TIMESTAMPTZ,
  planned_arrival TIMESTAMPTZ,
  actual_arrival TIMESTAMPTZ,
  total_pieces INTEGER DEFAULT 0,
  total_weight DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  created_by UUID,
  organization_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generate reference for shipments that don't have one
UPDATE shipments SET reference = 'TAC' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0') 
WHERE reference IS NULL;

-- Enable RLS on manifests
ALTER TABLE manifests ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for manifests
DROP POLICY IF EXISTS "manifests_select" ON manifests;
DROP POLICY IF EXISTS "manifests_insert" ON manifests;
DROP POLICY IF EXISTS "manifests_update" ON manifests;
DROP POLICY IF EXISTS "manifests_delete" ON manifests;

CREATE POLICY "manifests_select" ON manifests FOR SELECT TO authenticated USING (true);
CREATE POLICY "manifests_insert" ON manifests FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "manifests_update" ON manifests FOR UPDATE TO authenticated USING (true);
CREATE POLICY "manifests_delete" ON manifests FOR DELETE TO authenticated USING (true);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_shipments_reference ON shipments(reference);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_manifests_manifest_number ON manifests(manifest_number);
