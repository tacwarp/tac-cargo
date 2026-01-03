-- ============================================
-- STEP-BY-STEP MIGRATION (Run Each Step Separately)
-- ============================================

-- ============================================
-- STEP 1: Create shipment_exceptions table (WITHOUT FK)
-- ============================================
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

-- ============================================
-- STEP 2: Create payments table (WITHOUT FK)
-- ============================================
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

-- ============================================
-- STEP 3: Add foreign keys (run after tables exist)
-- ============================================
ALTER TABLE shipment_exceptions 
  DROP CONSTRAINT IF EXISTS shipment_exceptions_shipment_id_fkey;

ALTER TABLE shipment_exceptions 
  ADD CONSTRAINT shipment_exceptions_shipment_id_fkey 
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE;

ALTER TABLE payments 
  DROP CONSTRAINT IF EXISTS payments_invoice_id_fkey;

ALTER TABLE payments 
  ADD CONSTRAINT payments_invoice_id_fkey 
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL;

ALTER TABLE payments 
  DROP CONSTRAINT IF EXISTS payments_shipment_id_fkey;

ALTER TABLE payments 
  ADD CONSTRAINT payments_shipment_id_fkey 
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE SET NULL;

-- ============================================
-- STEP 4: Create indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_shipment_exceptions_shipment_id ON shipment_exceptions(shipment_id);
CREATE INDEX IF NOT EXISTS idx_shipment_exceptions_status ON shipment_exceptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_shipment_id ON payments(shipment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- ============================================
-- STEP 5: Enable RLS
-- ============================================
ALTER TABLE shipment_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 6: RLS Policies for shipment_exceptions
-- ============================================
DROP POLICY IF EXISTS "exceptions_select" ON shipment_exceptions;
DROP POLICY IF EXISTS "exceptions_insert" ON shipment_exceptions;
DROP POLICY IF EXISTS "exceptions_update" ON shipment_exceptions;
DROP POLICY IF EXISTS "exceptions_delete" ON shipment_exceptions;

CREATE POLICY "exceptions_select" ON shipment_exceptions FOR SELECT TO authenticated USING (true);
CREATE POLICY "exceptions_insert" ON shipment_exceptions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "exceptions_update" ON shipment_exceptions FOR UPDATE TO authenticated USING (true);
CREATE POLICY "exceptions_delete" ON shipment_exceptions FOR DELETE TO authenticated USING (true);

-- ============================================
-- STEP 7: RLS Policies for payments
-- ============================================
DROP POLICY IF EXISTS "payments_select" ON payments;
DROP POLICY IF EXISTS "payments_insert" ON payments;
DROP POLICY IF EXISTS "payments_update" ON payments;
DROP POLICY IF EXISTS "payments_delete" ON payments;

CREATE POLICY "payments_select" ON payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "payments_insert" ON payments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "payments_update" ON payments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "payments_delete" ON payments FOR DELETE TO authenticated USING (true);

-- ============================================
-- STEP 8: Fix profiles RLS
-- ============================================
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON profiles;

CREATE POLICY "profiles_select_policy" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_policy" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_policy" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_delete_policy" ON profiles FOR DELETE TO authenticated USING (auth.uid() = id);
