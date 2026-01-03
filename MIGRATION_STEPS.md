# 🚀 Database Migration - Step by Step Guide

**Time Required:** 5 minutes  
**Difficulty:** Easy (Copy & Paste)

---

## Step 1: Open Supabase SQL Editor

Click this link: **https://supabase.com/dashboard/project/dqthizzubvoxmclkcubc/sql**

Or manually:
1. Go to https://supabase.com/dashboard
2. Select project: `dqthizzubvoxmclkcubc`
3. Click **SQL Editor** in left sidebar

---

## Step 2: Create New Query

1. Click **"+ New query"** button
2. Name it: "Add Exceptions and Payments Tables"

---

## Step 3: Copy and Paste This SQL

```sql
-- ============================================
-- MIGRATION: Add Exceptions and Payments
-- ============================================

-- 1. Create shipment_exceptions table
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

-- 2. Create payments table
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

## Step 4: Run the Query

1. Click **"RUN"** button (or press Ctrl+Enter)
2. Wait for "Success" message
3. Should see: "Success. No rows returned"

---

## Step 5: Verify Tables Created

1. Click **"Table Editor"** in left sidebar
2. You should see new tables:
   - ✅ `shipment_exceptions`
   - ✅ `payments`

---

## Step 6: Restart Dev Server

```bash
# In your terminal:
taskkill /F /IM node.exe
npm run dev
```

---

## Step 7: Verify Endpoints

Open these URLs in browser (should all return 200):

- http://localhost:3000/api/exceptions
- http://localhost:3000/api/payments
- http://localhost:3000/api/scan
- http://localhost:3000/dashboard/exceptions
- http://localhost:3000/dashboard/payments

---

## ✅ Success Indicators

After migration, you should see:
- ✅ No "table not found" errors in console
- ✅ No "infinite recursion" errors
- ✅ All API endpoints return 200
- ✅ Exceptions page loads with data
- ✅ Payments page loads with data

---

## ❌ If Something Goes Wrong

**Error: "relation already exists"**
- This is OK! It means the table was already created
- Continue with the rest of the migration

**Error: "permission denied"**
- Make sure you're logged into the correct Supabase account
- Check you have admin access to the project

**Still seeing 500 errors after migration?**
1. Verify tables exist in Table Editor
2. Check RLS policies are enabled
3. Restart dev server completely
4. Clear browser cache

---

## 🎯 Next Steps After Migration

1. ✅ Test all CRUD operations on exceptions
2. ✅ Test all CRUD operations on payments
3. ✅ Create GitHub PR for CodeRabbit review
4. ✅ Fix any CodeRabbit findings
5. ✅ Deploy to staging

---

**Need Help?** Check `DATABASE_FIXES_REQUIRED.md` for detailed error analysis.
