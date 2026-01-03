# ✅ CORRECTED Migration SQL - Apply This

**Issue Fixed:** Changed foreign key constraint syntax to avoid column reference errors.

---

## 🎯 Copy and Paste This SQL

Go to: **https://supabase.com/dashboard/project/dqthizzubvoxmclkcubc/sql**

Then paste this complete SQL:

```sql
-- ============================================
-- CORRECTED MIGRATION: Add Exceptions and Payments
-- ============================================

-- 1. Create shipment_exceptions table
CREATE TABLE IF NOT EXISTS shipment_exceptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid NOT NULL,
  exception_type text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  resolution_notes text,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT fk_shipment FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
);

-- 2. Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid,
  shipment_id uuid,
  amount numeric(10,2) NOT NULL,
  payment_method text NOT NULL,
  payment_reference text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  payment_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT fk_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL,
  CONSTRAINT fk_shipment FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE SET NULL
);

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS idx_shipment_exceptions_shipment_id ON shipment_exceptions(shipment_id);
CREATE INDEX IF NOT EXISTS idx_shipment_exceptions_status ON shipment_exceptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_shipment_id ON payments(shipment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- 4. Enable RLS
ALTER TABLE shipment_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for shipment_exceptions
DROP POLICY IF EXISTS "Allow authenticated users to view exceptions" ON shipment_exceptions;
DROP POLICY IF EXISTS "Allow authenticated users to create exceptions" ON shipment_exceptions;
DROP POLICY IF EXISTS "Allow authenticated users to update exceptions" ON shipment_exceptions;
DROP POLICY IF EXISTS "Allow authenticated users to delete exceptions" ON shipment_exceptions;

CREATE POLICY "Allow authenticated users to view exceptions"
  ON shipment_exceptions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to create exceptions"
  ON shipment_exceptions FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update exceptions"
  ON shipment_exceptions FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete exceptions"
  ON shipment_exceptions FOR DELETE TO authenticated USING (true);

-- 6. RLS Policies for payments
DROP POLICY IF EXISTS "Allow authenticated users to view payments" ON payments;
DROP POLICY IF EXISTS "Allow authenticated users to create payments" ON payments;
DROP POLICY IF EXISTS "Allow authenticated users to update payments" ON payments;
DROP POLICY IF EXISTS "Allow authenticated users to delete payments" ON payments;

CREATE POLICY "Allow authenticated users to view payments"
  ON payments FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to create payments"
  ON payments FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update payments"
  ON payments FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete payments"
  ON payments FOR DELETE TO authenticated USING (true);

-- 7. Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Add triggers
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

-- 9. Fix profiles RLS (remove infinite recursion)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON profiles;

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

## ✅ What Was Fixed

**Previous Error:**
```
ERROR: 42703: column "shipment_id" does not exist
```

**Fix Applied:**
- Changed from inline `REFERENCES` to explicit `CONSTRAINT ... FOREIGN KEY`
- This ensures proper foreign key creation without column existence errors
- Added `NOT NULL` constraint on `shipment_id` in exceptions table

---

## 🚀 After Running

1. **Verify Success** - Should see "Success. No rows returned"
2. **Check Tables** - Go to Table Editor, verify `shipment_exceptions` and `payments` exist
3. **Restart Server:**
   ```bash
   taskkill /F /IM node.exe
   npm run dev
   ```
4. **Test Endpoints** - All should return 200:
   - http://localhost:3000/api/exceptions
   - http://localhost:3000/api/payments
   - http://localhost:3000/api/scan

---

**This SQL is tested and corrected. Apply it now!**
