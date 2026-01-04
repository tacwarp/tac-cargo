-- Add missing tables for exceptions and payments
-- Migration 002: Exceptions and Payments tables

-- Shipment Exceptions table
CREATE TABLE IF NOT EXISTS shipment_exceptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid REFERENCES shipments(id) ON DELETE CASCADE,
  exception_type text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  resolution_notes text,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE SET NULL,
  shipment_id uuid REFERENCES shipments(id) ON DELETE SET NULL,
  amount numeric(10,2) NOT NULL,
  payment_method text NOT NULL,
  payment_reference text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  payment_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_shipment_exceptions_shipment_id ON shipment_exceptions(shipment_id);
CREATE INDEX IF NOT EXISTS idx_shipment_exceptions_status ON shipment_exceptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_shipment_id ON payments(shipment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Enable RLS
ALTER TABLE shipment_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shipment_exceptions
CREATE POLICY "Allow authenticated users to view exceptions"
  ON shipment_exceptions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to create exceptions"
  ON shipment_exceptions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update exceptions"
  ON shipment_exceptions FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete exceptions"
  ON shipment_exceptions FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for payments
CREATE POLICY "Allow authenticated users to view payments"
  ON payments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to create payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete payments"
  ON payments FOR DELETE
  TO authenticated
  USING (true);

-- Add updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at (drop first for idempotency)
DROP TRIGGER IF EXISTS update_shipment_exceptions_updated_at ON shipment_exceptions;
CREATE TRIGGER update_shipment_exceptions_updated_at
  BEFORE UPDATE ON shipment_exceptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
