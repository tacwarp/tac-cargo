-- SIMPLE MIGRATION - Copy this entire block and run in Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/dqthizzubvoxmclkcubc/sql

-- Step 1: Create shipment_exceptions table
CREATE TABLE IF NOT EXISTS shipment_exceptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid,
  exception_type text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  priority text NOT NULL DEFAULT 'medium',
  resolution_notes text,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 2: Create payments table  
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid,
  shipment_id uuid,
  amount numeric(10,2) NOT NULL,
  payment_method text NOT NULL,
  payment_reference text,
  status text NOT NULL DEFAULT 'pending',
  payment_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 3: Enable RLS
ALTER TABLE shipment_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies for shipment_exceptions
CREATE POLICY "exceptions_select" ON shipment_exceptions FOR SELECT TO authenticated USING (true);
CREATE POLICY "exceptions_insert" ON shipment_exceptions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "exceptions_update" ON shipment_exceptions FOR UPDATE TO authenticated USING (true);
CREATE POLICY "exceptions_delete" ON shipment_exceptions FOR DELETE TO authenticated USING (true);

-- Step 5: Create RLS policies for payments
CREATE POLICY "payments_select" ON payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "payments_insert" ON payments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "payments_update" ON payments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "payments_delete" ON payments FOR DELETE TO authenticated USING (true);
