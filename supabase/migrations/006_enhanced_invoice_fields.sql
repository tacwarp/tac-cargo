-- Migration: Enhanced Invoice Fields for IATA Compliance
-- Description: Add international trade and IATA-compliant fields to invoices table

-- Add new columns to invoices table
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS hs_code TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS country_of_origin TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS incoterms TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS export_license_no TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS import_license_no TEXT;

-- Customs fields
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS customs_value DECIMAL(12,2);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS customs_currency TEXT DEFAULT 'INR';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS duty_paid BOOLEAN DEFAULT FALSE;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS tax_exemption_certificate TEXT;

-- Cargo details
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS package_type TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS gross_weight DECIMAL(10,2);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS net_weight DECIMAL(10,2);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS volumetric_weight DECIMAL(10,2);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS dimensions_length DECIMAL(10,2);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS dimensions_width DECIMAL(10,2);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS dimensions_height DECIMAL(10,2);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS dimensions_unit TEXT DEFAULT 'cm';

-- Insurance
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS insurance_provider TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS insurance_policy_no TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS insurance_amount DECIMAL(12,2);

-- Banking
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS bank_name TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS account_number TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS swift_code TEXT;

-- Compliance
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS dangerous_goods BOOLEAN DEFAULT FALSE;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS dg_class TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS un_number TEXT;

-- Tracking
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS master_awb TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS house_awb TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS flight_number TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS vessel_name TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS container_number TEXT;

-- PDF tracking
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS invoice_pdf_url TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS label_pdf_url TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS packing_list_pdf_url TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS pdf_generated_at TIMESTAMPTZ;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS pdf_version INTEGER DEFAULT 1;

-- Soft delete
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_invoices_hs_code ON invoices(hs_code);
CREATE INDEX IF NOT EXISTS idx_invoices_master_awb ON invoices(master_awb);
CREATE INDEX IF NOT EXISTS idx_invoices_house_awb ON invoices(house_awb);
CREATE INDEX IF NOT EXISTS idx_invoices_deleted_at ON invoices(deleted_at);

-- Update RLS policies to exclude soft-deleted records
DROP POLICY IF EXISTS "Users can view invoices in their organization" ON invoices;
CREATE POLICY "Users can view invoices in their organization"
  ON invoices FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- Comment on new fields
COMMENT ON COLUMN invoices.hs_code IS 'Harmonized System Code for international trade';
COMMENT ON COLUMN invoices.incoterms IS 'International Commercial Terms (EXW, FOB, CIF, etc.)';
COMMENT ON COLUMN invoices.master_awb IS 'Master Air Waybill for consolidation';
COMMENT ON COLUMN invoices.house_awb IS 'House Air Waybill for freight forwarders';
COMMENT ON COLUMN invoices.dangerous_goods IS 'Whether shipment contains dangerous goods';
COMMENT ON COLUMN invoices.pdf_version IS 'Version number for document versioning';
