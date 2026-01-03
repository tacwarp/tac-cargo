# Database Migration Instructions

**Critical:** The following tables are missing and causing API errors:
1. `shipment_exceptions`
2. `payments`
3. Profiles RLS policy has infinite recursion

---

## Option 1: Via Supabase Dashboard (RECOMMENDED)

1. Go to https://supabase.com/dashboard/project/dqthizzubvoxmclkcubc
2. Navigate to **SQL Editor**
3. Run the following SQL:

```sql
-- Create shipment_exceptions table
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

CREATE INDEX IF NOT EXISTS idx_shipment_exceptions_shipment_id ON shipment_exceptions(shipment_id);
CREATE INDEX IF NOT EXISTS idx_shipment_exceptions_status ON shipment_exceptions(status);

ALTER TABLE shipment_exceptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view exceptions"
  ON shipment_exceptions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to create exceptions"
  ON shipment_exceptions FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update exceptions"
  ON shipment_exceptions FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete exceptions"
  ON shipment_exceptions FOR DELETE TO authenticated USING (true);

-- Create payments table
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

CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_shipment_id ON payments(shipment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view payments"
  ON payments FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to create payments"
  ON payments FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update payments"
  ON payments FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete payments"
  ON payments FOR DELETE TO authenticated USING (true);

-- Fix profiles RLS infinite recursion
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;

CREATE POLICY "profiles_select_policy"
  ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "profiles_insert_policy"
  ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy"
  ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_delete_policy"
  ON profiles FOR DELETE TO authenticated USING (auth.uid() = id);
```

---

## Option 2: Via API Route

Navigate to: http://localhost:3000/api/migrate

This will run the migrations automatically.

---

## After Migration

Restart the dev server and verify:
- ✅ No "table not found" errors
- ✅ No infinite recursion errors
- ✅ `/api/exceptions` returns 200
- ✅ `/api/payments` returns 200
- ✅ `/api/scan` returns 200
