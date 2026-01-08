-- =====================================================
-- TAC Cargo Logistics Platform - Database Schema
-- GS1 Compliant, Industry Standard
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUM TYPES
-- =====================================================

CREATE TYPE shipment_status AS ENUM (
  'booked',
  'picked_up',
  'at_origin_hub',
  'in_transit',
  'at_destination_hub',
  'out_for_delivery',
  'delivered',
  'exception',
  'returned',
  'cancelled'
);

CREATE TYPE transport_mode AS ENUM (
  'air',
  'surface',
  'express',
  'economy'
);

CREATE TYPE payment_mode AS ENUM (
  'prepaid',
  'to_pay',
  'credit'
);

CREATE TYPE invoice_status AS ENUM (
  'draft',
  'pending',
  'paid',
  'partial',
  'overdue',
  'cancelled'
);

CREATE TYPE manifest_status AS ENUM (
  'draft',
  'finalized',
  'dispatched',
  'in_transit',
  'arrived',
  'completed'
);

CREATE TYPE scan_event_type AS ENUM (
  'booking',
  'pickup',
  'arrival_hub',
  'departure_hub',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'exception',
  'return_initiated',
  'returned'
);

CREATE TYPE exception_type AS ENUM (
  'address_issue',
  'customer_unavailable',
  'damaged',
  'delayed',
  'lost',
  'refused',
  'weather',
  'other'
);

CREATE TYPE payment_method AS ENUM (
  'cash',
  'upi',
  'bank_transfer',
  'card',
  'credit_account',
  'cheque'
);

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Customers (Shippers)
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_code VARCHAR(20) UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  gstin VARCHAR(15),
  pan VARCHAR(10),
  credit_limit DECIMAL(12, 2) DEFAULT 0,
  credit_balance DECIMAL(12, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer Addresses (Multiple per customer)
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  type VARCHAR(20) DEFAULT 'shipping', -- 'shipping', 'billing', 'both'
  contact_name VARCHAR(255),
  contact_phone VARCHAR(20),
  line1 VARCHAR(255) NOT NULL,
  line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  country VARCHAR(100) DEFAULT 'India',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Warehouses / Hubs
CREATE TABLE warehouses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10),
  phone VARCHAR(20),
  email VARCHAR(255),
  is_hub BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices (with AWB)
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_no VARCHAR(20) UNIQUE NOT NULL,
  awb_no VARCHAR(20) UNIQUE NOT NULL,
  barcode_data VARCHAR(50), -- GS1-128 encoded string
  
  -- Customer/Shipper
  customer_id UUID REFERENCES customers(id),
  shipper_name VARCHAR(255),
  shipper_address TEXT,
  shipper_phone VARCHAR(20),
  shipper_gstin VARCHAR(15),
  
  -- Consignee
  consignee_name VARCHAR(255) NOT NULL,
  consignee_address TEXT NOT NULL,
  consignee_city VARCHAR(100) NOT NULL,
  consignee_state VARCHAR(100) NOT NULL,
  consignee_pincode VARCHAR(10) NOT NULL,
  consignee_phone VARCHAR(20),
  consignee_email VARCHAR(255),
  
  -- Shipment Details
  origin_warehouse_id UUID REFERENCES warehouses(id),
  destination_warehouse_id UUID REFERENCES warehouses(id),
  transport_mode transport_mode DEFAULT 'surface',
  payment_mode payment_mode DEFAULT 'prepaid',
  
  -- Package Summary
  total_pieces INTEGER DEFAULT 1,
  total_weight DECIMAL(10, 2),
  total_volumetric_weight DECIMAL(10, 2),
  chargeable_weight DECIMAL(10, 2),
  declared_value DECIMAL(12, 2),
  content_description TEXT,
  
  -- Charges
  freight_charge DECIMAL(10, 2) DEFAULT 0,
  pickup_charge DECIMAL(10, 2) DEFAULT 0,
  delivery_charge DECIMAL(10, 2) DEFAULT 0,
  packing_charge DECIMAL(10, 2) DEFAULT 0,
  insurance_charge DECIMAL(10, 2) DEFAULT 0,
  handling_charge DECIMAL(10, 2) DEFAULT 0,
  other_charges DECIMAL(10, 2) DEFAULT 0,
  subtotal DECIMAL(12, 2) DEFAULT 0,
  cgst DECIMAL(10, 2) DEFAULT 0,
  sgst DECIMAL(10, 2) DEFAULT 0,
  igst DECIMAL(10, 2) DEFAULT 0,
  total_tax DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(12, 2) DEFAULT 0,
  
  -- Status & Dates
  status invoice_status DEFAULT 'pending',
  invoice_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  paid_amount DECIMAL(12, 2) DEFAULT 0,
  balance_due DECIMAL(12, 2) DEFAULT 0,
  
  -- PDF Storage
  invoice_pdf_url TEXT,
  label_pdf_url TEXT,
  
  -- Metadata
  notes TEXT,
  special_instructions TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Packages (Multiple per invoice/shipment)
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  package_no INTEGER DEFAULT 1,
  
  -- Dimensions (cm)
  length DECIMAL(8, 2),
  width DECIMAL(8, 2),
  height DECIMAL(8, 2),
  
  -- Weight (kg)
  actual_weight DECIMAL(8, 2),
  volumetric_weight DECIMAL(8, 2), -- Calculated: (L*W*H)/5000
  
  -- Content
  description VARCHAR(255),
  declared_value DECIMAL(10, 2),
  
  -- Packaging
  packaging_type VARCHAR(50), -- 'box', 'envelope', 'pallet', 'other'
  is_fragile BOOLEAN DEFAULT false,
  requires_special_handling BOOLEAN DEFAULT false,
  handling_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shipments (Tracking entity linked to invoice)
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  awb_no VARCHAR(20) NOT NULL,
  
  status shipment_status DEFAULT 'booked',
  current_location VARCHAR(255),
  current_warehouse_id UUID REFERENCES warehouses(id),
  
  -- Timestamps
  booked_at TIMESTAMPTZ DEFAULT NOW(),
  picked_up_at TIMESTAMPTZ,
  eta TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  
  -- Proof of Delivery
  pod_signature_url TEXT,
  pod_photo_url TEXT,
  pod_receiver_name VARCHAR(255),
  pod_receiver_relation VARCHAR(100),
  pod_timestamp TIMESTAMPTZ,
  pod_latitude DECIMAL(10, 8),
  pod_longitude DECIMAL(11, 8),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shipment Events (Tracking History)
CREATE TABLE shipment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  
  event_type scan_event_type NOT NULL,
  location VARCHAR(255),
  warehouse_id UUID REFERENCES warehouses(id),
  
  remarks TEXT,
  scanned_by UUID,
  device_id VARCHAR(100),
  
  -- GPS
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  event_timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exceptions
CREATE TABLE exceptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  
  exception_type exception_type NOT NULL,
  description TEXT,
  resolution TEXT,
  
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  
  photo_urls TEXT[], -- Array of photo URLs
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Manifests
CREATE TABLE manifests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manifest_no VARCHAR(20) UNIQUE NOT NULL,
  barcode_data VARCHAR(50),
  
  -- Route
  origin_warehouse_id UUID REFERENCES warehouses(id),
  destination_warehouse_id UUID REFERENCES warehouses(id),
  transport_mode transport_mode DEFAULT 'surface',
  
  -- Vehicle/Flight Info
  vehicle_no VARCHAR(50),
  driver_name VARCHAR(255),
  driver_phone VARCHAR(20),
  flight_no VARCHAR(20),
  
  -- Totals
  total_shipments INTEGER DEFAULT 0,
  total_pieces INTEGER DEFAULT 0,
  total_weight DECIMAL(10, 2) DEFAULT 0,
  
  -- Status
  status manifest_status DEFAULT 'draft',
  dispatch_time TIMESTAMPTZ,
  arrival_time TIMESTAMPTZ,
  
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Manifest Details (Shipments in Manifest)
CREATE TABLE manifest_shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manifest_id UUID REFERENCES manifests(id) ON DELETE CASCADE,
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  scanned_by UUID,
  
  UNIQUE(manifest_id, shipment_id)
);

-- Inventory (Warehouse Stock)
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  warehouse_id UUID REFERENCES warehouses(id),
  
  bin_location VARCHAR(50),
  shelf_location VARCHAR(50),
  
  checked_in_at TIMESTAMPTZ DEFAULT NOW(),
  checked_out_at TIMESTAMPTZ,
  
  checked_in_by UUID,
  checked_out_by UUID,
  
  status VARCHAR(20) DEFAULT 'in_stock', -- 'in_stock', 'dispatched', 'delivered'
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  
  payment_method payment_method NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  
  transaction_id VARCHAR(100),
  reference_no VARCHAR(100),
  
  payment_date DATE DEFAULT CURRENT_DATE,
  received_by UUID,
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rate Cards
CREATE TABLE rate_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  
  origin_zone VARCHAR(50),
  destination_zone VARCHAR(50),
  transport_mode transport_mode,
  
  base_rate DECIMAL(10, 2),
  per_kg_rate DECIMAL(10, 2),
  min_weight DECIMAL(8, 2) DEFAULT 0.5,
  
  is_active BOOLEAN DEFAULT true,
  valid_from DATE,
  valid_to DATE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SEQUENCES FOR AUTO-GENERATION
-- =====================================================

CREATE SEQUENCE invoice_seq START 1000;
CREATE SEQUENCE awb_seq START 100000;
CREATE SEQUENCE manifest_seq START 1000;

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Generate Invoice Number: INV-YYYYMM-XXXX
CREATE OR REPLACE FUNCTION generate_invoice_no()
RETURNS VARCHAR(20) AS $$
DECLARE
  new_no VARCHAR(20);
BEGIN
  new_no := 'INV-' || TO_CHAR(CURRENT_DATE, 'YYYYMM') || '-' || LPAD(nextval('invoice_seq')::TEXT, 4, '0');
  RETURN new_no;
END;
$$ LANGUAGE plpgsql;

-- Generate AWB Number: TAC-XXXXXX (with check digit)
CREATE OR REPLACE FUNCTION generate_awb_no()
RETURNS VARCHAR(20) AS $$
DECLARE
  seq_val INTEGER;
  awb VARCHAR(20);
  check_digit INTEGER;
BEGIN
  seq_val := nextval('awb_seq');
  -- Simple check digit: sum of digits mod 10
  check_digit := (seq_val % 10 + (seq_val / 10) % 10 + (seq_val / 100) % 10 + 
                  (seq_val / 1000) % 10 + (seq_val / 10000) % 10 + (seq_val / 100000) % 10) % 10;
  awb := 'TAC' || LPAD(seq_val::TEXT, 6, '0') || check_digit::TEXT;
  RETURN awb;
END;
$$ LANGUAGE plpgsql;

-- Generate Manifest Number: MAN-YYYYMM-XXXX
CREATE OR REPLACE FUNCTION generate_manifest_no()
RETURNS VARCHAR(20) AS $$
DECLARE
  new_no VARCHAR(20);
BEGIN
  new_no := 'MAN-' || TO_CHAR(CURRENT_DATE, 'YYYYMM') || '-' || LPAD(nextval('manifest_seq')::TEXT, 4, '0');
  RETURN new_no;
END;
$$ LANGUAGE plpgsql;

-- Calculate volumetric weight
CREATE OR REPLACE FUNCTION calculate_volumetric_weight(l DECIMAL, w DECIMAL, h DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
  RETURN ROUND((l * w * h) / 5000, 2);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER customers_updated_at BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER warehouses_updated_at BEFORE UPDATE ON warehouses
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER invoices_updated_at BEFORE UPDATE ON invoices
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER shipments_updated_at BEFORE UPDATE ON shipments
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER manifests_updated_at BEFORE UPDATE ON manifests
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER inventory_updated_at BEFORE UPDATE ON inventory
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER exceptions_updated_at BEFORE UPDATE ON exceptions
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_awb ON invoices(awb_no);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_date ON invoices(invoice_date);

CREATE INDEX idx_shipments_awb ON shipments(awb_no);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_invoice ON shipments(invoice_id);

CREATE INDEX idx_shipment_events_shipment ON shipment_events(shipment_id);
CREATE INDEX idx_shipment_events_timestamp ON shipment_events(event_timestamp);

CREATE INDEX idx_manifest_shipments_manifest ON manifest_shipments(manifest_id);
CREATE INDEX idx_manifest_shipments_shipment ON manifest_shipments(shipment_id);

CREATE INDEX idx_inventory_warehouse ON inventory(warehouse_id);
CREATE INDEX idx_inventory_shipment ON inventory(shipment_id);

CREATE INDEX idx_payments_invoice ON payments(invoice_id);

CREATE INDEX idx_addresses_customer ON addresses(customer_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE manifests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Basic policies (adjust based on your auth setup)
CREATE POLICY "Enable read access for authenticated users" ON customers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable all access for authenticated users" ON invoices
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Enable all access for authenticated users" ON shipments
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Enable all access for authenticated users" ON manifests
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Enable all access for authenticated users" ON payments
  FOR ALL TO authenticated USING (true);
