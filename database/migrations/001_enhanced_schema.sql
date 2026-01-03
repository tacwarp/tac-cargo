-- TAC Cargo Enhanced Database Schema
-- Adds manifests, invoices, service levels, and traceability features

-- Create enum types
CREATE TYPE manifest_status AS ENUM (
  'draft',
  'sealed',
  'in_transit',
  'arrived',
  'reconciled',
  'cancelled'
);

CREATE TYPE invoice_status AS ENUM (
  'draft',
  'sent',
  'paid',
  'overdue',
  'cancelled'
);

-- Service levels table
CREATE TABLE IF NOT EXISTS service_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  transport_mode transport_mode NOT NULL,
  delivery_hours integer NOT NULL,
  price_multiplier numeric(3,2) DEFAULT 1.0,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Manifests table (master record for grouped shipments)
CREATE TABLE IF NOT EXISTS manifests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manifest_number text UNIQUE NOT NULL,
  origin_warehouse_id uuid REFERENCES warehouses(id),
  destination_warehouse_id uuid REFERENCES warehouses(id),
  transport_mode transport_mode NOT NULL,
  vehicle_number text,
  driver_name text,
  driver_phone text,
  status manifest_status NOT NULL DEFAULT 'draft',
  planned_departure timestamptz,
  actual_departure timestamptz,
  planned_arrival timestamptz,
  actual_arrival timestamptz,
  total_pieces integer DEFAULT 0,
  total_weight_kg numeric(10,2) DEFAULT 0,
  seal_number text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Manifest items (junction table: manifest ↔ shipments)
CREATE TABLE IF NOT EXISTS manifest_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manifest_id uuid REFERENCES manifests(id) ON DELETE CASCADE,
  shipment_id uuid REFERENCES shipments(id) ON DELETE CASCADE,
  sequence_number integer,
  declared_weight_kg numeric(10,2),
  scanned_at_origin timestamptz,
  scanned_at_destination timestamptz,
  discrepancy_notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(manifest_id, shipment_id)
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  customer_id uuid REFERENCES customers(id),
  invoice_date date NOT NULL,
  due_date date NOT NULL,
  subtotal numeric(10,2) NOT NULL,
  gst_amount numeric(10,2) NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'INR',
  status invoice_status NOT NULL DEFAULT 'draft',
  payment_terms text,
  notes text,
  pdf_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Invoice items (junction table: invoice ↔ shipments)
CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  shipment_id uuid REFERENCES shipments(id),
  description text NOT NULL,
  quantity integer DEFAULT 1,
  unit_price numeric(10,2) NOT NULL,
  gst_rate numeric(5,2) DEFAULT 18.00,
  line_total numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(invoice_id, shipment_id)
);

-- Add foreign keys to existing shipments table
ALTER TABLE shipments
ADD COLUMN IF NOT EXISTS invoice_id uuid REFERENCES invoices(id),
ADD COLUMN IF NOT EXISTS current_manifest_id uuid REFERENCES manifests(id),
ADD COLUMN IF NOT EXISTS service_level_id uuid REFERENCES service_levels(id),
ADD COLUMN IF NOT EXISTS sla_target timestamptz,
ADD COLUMN IF NOT EXISTS sla_status text CHECK (sla_status IN ('on_time', 'at_risk', 'breached'));

-- Enhance warehouses table with operational fields
ALTER TABLE warehouses
ADD COLUMN IF NOT EXISTS warehouse_type text CHECK (warehouse_type IN ('origin', 'hub', 'destination', 'return_center')),
ADD COLUMN IF NOT EXISTS capacity_pieces integer,
ADD COLUMN IF NOT EXISTS capacity_weight_kg numeric(10,2),
ADD COLUMN IF NOT EXISTS latitude numeric(10,6),
ADD COLUMN IF NOT EXISTS longitude numeric(10,6),
ADD COLUMN IF NOT EXISTS operating_hours jsonb,
ADD COLUMN IF NOT EXISTS cutoff_time time,
ADD COLUMN IF NOT EXISTS manager_name text,
ADD COLUMN IF NOT EXISTS manager_phone text,
ADD COLUMN IF NOT EXISTS manager_email text,
ADD COLUMN IF NOT EXISTS facilities text[],
ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'Asia/Kolkata';

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_manifests_status ON manifests(status);
CREATE INDEX IF NOT EXISTS idx_manifests_origin ON manifests(origin_warehouse_id);
CREATE INDEX IF NOT EXISTS idx_manifests_destination ON manifests(destination_warehouse_id);
CREATE INDEX IF NOT EXISTS idx_manifests_departure ON manifests(actual_departure);
CREATE INDEX IF NOT EXISTS idx_manifest_items_manifest ON manifest_items(manifest_id);
CREATE INDEX IF NOT EXISTS idx_manifest_items_shipment ON manifest_items(shipment_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(invoice_date DESC);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_shipment ON invoice_items(shipment_id);
CREATE INDEX IF NOT EXISTS idx_shipments_invoice ON shipments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_shipments_manifest ON shipments(current_manifest_id);
CREATE INDEX IF NOT EXISTS idx_shipments_service_level ON shipments(service_level_id);
CREATE INDEX IF NOT EXISTS idx_shipments_sla_status ON shipments(sla_status);

-- Function to calculate SLA status
CREATE OR REPLACE FUNCTION calculate_sla_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'delivered' THEN
    -- Shipment completed
    IF NEW.delivered_at <= NEW.sla_target THEN
      NEW.sla_status := 'on_time';
    ELSE
      NEW.sla_status := 'breached';
    END IF;
  ELSE
    -- Shipment in transit
    IF now() + interval '4 hours' >= NEW.sla_target THEN
      NEW.sla_status := 'at_risk';
    ELSE
      NEW.sla_status := 'on_time';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for SLA status calculation
DROP TRIGGER IF EXISTS update_sla_status ON shipments;
CREATE TRIGGER update_sla_status
BEFORE INSERT OR UPDATE ON shipments
FOR EACH ROW
EXECUTE FUNCTION calculate_sla_status();

-- Insert default service levels
INSERT INTO service_levels (code, name, transport_mode, delivery_hours, price_multiplier, description)
VALUES
  ('AIR_EXPRESS', 'Air Express', 'air', 24, 2.0, 'Next-day air delivery'),
  ('AIR_STANDARD', 'Air Standard', 'air', 48, 1.5, '2-day air delivery'),
  ('SURFACE_EXPRESS', 'Surface Express', 'surface', 72, 1.3, '3-day surface delivery'),
  ('SURFACE_STANDARD', 'Surface Standard', 'surface', 120, 1.0, '5-day surface delivery'),
  ('ECONOMY', 'Economy', 'economy', 240, 0.8, '10-day economy delivery')
ON CONFLICT (code) DO NOTHING;

-- Enable Row Level Security (RLS) on new tables
ALTER TABLE manifests ENABLE ROW LEVEL SECURITY;
ALTER TABLE manifest_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_levels ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow authenticated users full access for now)
CREATE POLICY "Allow authenticated users full access to manifests"
  ON manifests FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to manifest_items"
  ON manifest_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to invoices"
  ON invoices FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to invoice_items"
  ON invoice_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all users to read service_levels"
  ON service_levels FOR SELECT
  TO authenticated
  USING (true);

-- Enable Realtime for critical tables
ALTER PUBLICATION supabase_realtime ADD TABLE manifests;
ALTER PUBLICATION supabase_realtime ADD TABLE manifest_items;
ALTER PUBLICATION supabase_realtime ADD TABLE invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE invoice_items;
