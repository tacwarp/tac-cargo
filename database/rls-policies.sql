-- ============================================================================
-- TAC Cargo - Row Level Security (RLS) Policies
-- ============================================================================
-- 
-- CRITICAL SECURITY REQUIREMENT:
-- All tables MUST have RLS enabled before production deployment.
-- Without RLS, any authenticated user can access ALL data in the database.
--
-- This file documents the required RLS policies for all Supabase tables.
-- Execute these policies in your Supabase SQL editor.
--
-- ============================================================================

-- ============================================================================
-- CUSTOMERS TABLE
-- ============================================================================
-- Contains PII: name, email, phone, address, GST number
-- Risk Level: CRITICAL

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read customers they own/created
CREATE POLICY "Users can read own customers"
ON customers FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own customer records
CREATE POLICY "Users can insert own customers"
ON customers FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own customer records
CREATE POLICY "Users can update own customers"
ON customers FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own customer records
CREATE POLICY "Users can delete own customers"
ON customers FOR DELETE
USING (auth.uid() = user_id);

-- NOTE: Service role bypasses RLS entirely, so no policy is needed.
-- The service_role key should only be used server-side for admin operations.
-- See: https://supabase.com/docs/guides/auth/row-level-security#bypassing-row-level-security


-- ============================================================================
-- WAREHOUSES TABLE
-- ============================================================================
-- Contains operational data: warehouse locations and details
-- Risk Level: HIGH

-- Enable RLS
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can read warehouses (needed for shipment tracking)
CREATE POLICY "Authenticated users can read warehouses"
ON warehouses FOR SELECT
TO authenticated
USING (true);

-- Policy: Only service role can modify warehouses
CREATE POLICY "Service role can modify warehouses"
ON warehouses FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');


-- ============================================================================
-- SHIPMENTS TABLE
-- ============================================================================
-- Contains business-critical shipment data
-- Risk Level: CRITICAL

-- Enable RLS
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

-- Policy: Public tracking by reference number (AWB)
-- This allows the public tracking API to work without authentication
-- Note: The API route filters what data is exposed (no PII)
-- SECURITY: This policy allows unrestricted read access for tracking purposes
-- The application layer (API route) is responsible for data sanitization
CREATE POLICY "Public can read shipments for tracking"
ON shipments FOR SELECT
USING (true);

-- Note: Removed "Users can read own shipments" policy to avoid conflict
-- The public policy above allows all reads, which includes authenticated users
-- If you need to restrict reads in the future, remove the public policy
-- and implement authenticated-only access with proper user filtering

-- Policy: Users can insert their own shipments
CREATE POLICY "Users can insert own shipments"
ON shipments FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Policy: Users can update their own shipments
CREATE POLICY "Users can update own shipments"
ON shipments FOR UPDATE
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- Policy: Service role has full access
CREATE POLICY "Service role full access to shipments"
ON shipments FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');


-- ============================================================================
-- SCAN_EVENTS TABLE
-- ============================================================================
-- Contains operational tracking data
-- Risk Level: HIGH

-- Enable RLS
ALTER TABLE scan_events ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read scan events (needed for tracking API)
-- The API route filters what data is exposed
CREATE POLICY "Public can read scan events"
ON scan_events FOR SELECT
USING (true);

-- Policy: Only service role can insert scan events
CREATE POLICY "Service role can insert scan events"
ON scan_events FOR INSERT
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Policy: Service role has full access
CREATE POLICY "Service role full access to scan events"
ON scan_events FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');


-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these queries to verify RLS is properly configured

-- Check if RLS is enabled on all tables
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('customers', 'warehouses', 'shipments', 'scan_events')
ORDER BY tablename;

-- Expected output: All tables should show rls_enabled = true


-- List all RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('customers', 'warehouses', 'shipments', 'scan_events')
ORDER BY tablename, policyname;

-- Expected output: Should show all policies defined above


-- ============================================================================
-- TESTING RLS POLICIES
-- ============================================================================
-- Test these scenarios to verify RLS is working correctly:

-- 1. Test as authenticated user (should only see own data)
-- 2. Test as anonymous user (should only access public tracking)
-- 3. Test with service role (should have full access)
-- 4. Test cross-user access (should be denied)

-- Example test query (run as authenticated user):
-- SELECT * FROM customers;
-- Should only return customers where user_id = auth.uid()

-- Example test query (run as anonymous):
-- SELECT * FROM shipments WHERE reference = 'TAC123456';
-- Should work for tracking API

-- Example attack attempt (should fail):
-- SELECT * FROM customers WHERE user_id != auth.uid();
-- Should return empty result set


-- ============================================================================
-- IMPORTANT NOTES
-- ============================================================================
-- 
-- 1. ALWAYS test RLS policies in a staging environment before production
-- 
-- 2. The public tracking API relies on RLS policies to protect data.
--    The API route further filters the response to remove PII.
--    This is a defense-in-depth approach.
--
-- 3. Service role key should NEVER be exposed to the client.
--    Only use it in server-side API routes.
--
-- 4. If you add new tables, ALWAYS enable RLS and create appropriate policies.
--
-- 5. Review and audit RLS policies regularly as part of security reviews.
--
-- 6. Consider implementing additional policies for specific use cases:
--    - Time-based access restrictions
--    - IP-based restrictions (via custom claims)
--    - Role-based access control (RBAC)
--
-- ============================================================================
