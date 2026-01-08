-- =====================================================
-- TAC Cargo - Row Level Security Policies
-- Migration 003: Complete RLS for Multi-Tenancy
-- =====================================================

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE barcodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE manifest_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- ORGANIZATIONS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Users can view their organization" ON organizations;
CREATE POLICY "Users can view their organization" ON organizations
  FOR SELECT TO authenticated
  USING (id = get_user_organization_id());

DROP POLICY IF EXISTS "Admins can update their organization" ON organizations;
CREATE POLICY "Admins can update their organization" ON organizations
  FOR UPDATE TO authenticated
  USING (id = get_user_organization_id())
  WITH CHECK (id = get_user_organization_id());

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Users can view profiles in their organization" ON profiles;
CREATE POLICY "Users can view profiles in their organization" ON profiles
  FOR SELECT TO authenticated
  USING (organization_id = get_user_organization_id() OR id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "New users can insert their profile" ON profiles;
CREATE POLICY "New users can insert their profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

-- =====================================================
-- CUSTOMERS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON customers;
DROP POLICY IF EXISTS "Users can view customers in their organization" ON customers;
CREATE POLICY "Users can view customers in their organization" ON customers
  FOR SELECT TO authenticated
  USING (organization_id = get_user_organization_id() OR organization_id IS NULL);

DROP POLICY IF EXISTS "Users can manage customers in their organization" ON customers;
CREATE POLICY "Users can manage customers in their organization" ON customers
  FOR ALL TO authenticated
  USING (organization_id = get_user_organization_id() OR organization_id IS NULL)
  WITH CHECK (organization_id = get_user_organization_id() OR organization_id IS NULL);

-- =====================================================
-- WAREHOUSES POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Users can view warehouses in their organization" ON warehouses;
CREATE POLICY "Users can view warehouses in their organization" ON warehouses
  FOR SELECT TO authenticated
  USING (organization_id = get_user_organization_id() OR organization_id IS NULL);

DROP POLICY IF EXISTS "Admins can manage warehouses" ON warehouses;
CREATE POLICY "Admins can manage warehouses" ON warehouses
  FOR ALL TO authenticated
  USING (organization_id = get_user_organization_id() OR organization_id IS NULL)
  WITH CHECK (organization_id = get_user_organization_id() OR organization_id IS NULL);

-- =====================================================
-- INVOICES POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Enable all access for authenticated users" ON invoices;
DROP POLICY IF EXISTS "Users can view invoices in their organization" ON invoices;
CREATE POLICY "Users can view invoices in their organization" ON invoices
  FOR SELECT TO authenticated
  USING (organization_id = get_user_organization_id() OR organization_id IS NULL);

DROP POLICY IF EXISTS "Users can manage invoices in their organization" ON invoices;
CREATE POLICY "Users can manage invoices in their organization" ON invoices
  FOR ALL TO authenticated
  USING (organization_id = get_user_organization_id() OR organization_id IS NULL)
  WITH CHECK (organization_id = get_user_organization_id() OR organization_id IS NULL);

-- =====================================================
-- SHIPMENTS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Enable all access for authenticated users" ON shipments;
DROP POLICY IF EXISTS "Users can view shipments in their organization" ON shipments;
CREATE POLICY "Users can view shipments in their organization" ON shipments
  FOR SELECT TO authenticated
  USING (organization_id = get_user_organization_id() OR organization_id IS NULL);

DROP POLICY IF EXISTS "Users can manage shipments in their organization" ON shipments;
CREATE POLICY "Users can manage shipments in their organization" ON shipments
  FOR ALL TO authenticated
  USING (organization_id = get_user_organization_id() OR organization_id IS NULL)
  WITH CHECK (organization_id = get_user_organization_id() OR organization_id IS NULL);

-- Public tracking access
DROP POLICY IF EXISTS "Public can view shipment for tracking" ON shipments;
CREATE POLICY "Public can view shipment for tracking" ON shipments
  FOR SELECT TO anon
  USING (true);

-- =====================================================
-- MANIFESTS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Enable all access for authenticated users" ON manifests;
DROP POLICY IF EXISTS "Users can view manifests in their organization" ON manifests;
CREATE POLICY "Users can view manifests in their organization" ON manifests
  FOR SELECT TO authenticated
  USING (organization_id = get_user_organization_id() OR organization_id IS NULL);

DROP POLICY IF EXISTS "Users can manage manifests in their organization" ON manifests;
CREATE POLICY "Users can manage manifests in their organization" ON manifests
  FOR ALL TO authenticated
  USING (organization_id = get_user_organization_id() OR organization_id IS NULL)
  WITH CHECK (organization_id = get_user_organization_id() OR organization_id IS NULL);

-- =====================================================
-- PAYMENTS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Enable all access for authenticated users" ON payments;
DROP POLICY IF EXISTS "Users can view payments in their organization" ON payments;
CREATE POLICY "Users can view payments in their organization" ON payments
  FOR SELECT TO authenticated
  USING (
    invoice_id IN (
      SELECT id FROM invoices 
      WHERE organization_id = get_user_organization_id() OR organization_id IS NULL
    )
  );

DROP POLICY IF EXISTS "Users can manage payments" ON payments;
CREATE POLICY "Users can manage payments" ON payments
  FOR ALL TO authenticated
  USING (
    invoice_id IN (
      SELECT id FROM invoices 
      WHERE organization_id = get_user_organization_id() OR organization_id IS NULL
    )
  );

-- =====================================================
-- AUDIT LOGS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Users can view audit logs in their organization" ON audit_logs;
CREATE POLICY "Users can view audit logs in their organization" ON audit_logs
  FOR SELECT TO authenticated
  USING (organization_id = get_user_organization_id());

-- =====================================================
-- NOTIFICATIONS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Users can view their notifications" ON notifications;
CREATE POLICY "Users can view their notifications" ON notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their notifications" ON notifications;
CREATE POLICY "Users can update their notifications" ON notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- =====================================================
-- SERVICE LEVELS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Users can view service levels" ON service_levels;
CREATE POLICY "Users can view service levels" ON service_levels
  FOR SELECT TO authenticated
  USING (organization_id = get_user_organization_id() OR organization_id IS NULL);

-- =====================================================
-- WEBHOOKS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Admins can manage webhooks" ON webhooks;
CREATE POLICY "Admins can manage webhooks" ON webhooks
  FOR ALL TO authenticated
  USING (organization_id = get_user_organization_id())
  WITH CHECK (organization_id = get_user_organization_id());

-- =====================================================
-- API KEYS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Admins can manage API keys" ON api_keys;
CREATE POLICY "Admins can manage API keys" ON api_keys
  FOR ALL TO authenticated
  USING (organization_id = get_user_organization_id())
  WITH CHECK (organization_id = get_user_organization_id());

-- =====================================================
-- BARCODES POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Users can view barcodes" ON barcodes;
CREATE POLICY "Users can view barcodes" ON barcodes
  FOR SELECT TO authenticated
  USING (
    shipment_id IN (
      SELECT id FROM shipments 
      WHERE organization_id = get_user_organization_id() OR organization_id IS NULL
    )
  );

DROP POLICY IF EXISTS "Public can view barcodes for tracking" ON barcodes;
CREATE POLICY "Public can view barcodes for tracking" ON barcodes
  FOR SELECT TO anon
  USING (true);

-- =====================================================
-- SCAN EVENTS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Users can view scan events" ON scan_events;
CREATE POLICY "Users can view scan events" ON scan_events
  FOR SELECT TO authenticated
  USING (
    shipment_id IN (
      SELECT id FROM shipments 
      WHERE organization_id = get_user_organization_id() OR organization_id IS NULL
    )
  );

DROP POLICY IF EXISTS "Users can create scan events" ON scan_events;
CREATE POLICY "Users can create scan events" ON scan_events
  FOR INSERT TO authenticated
  WITH CHECK (
    shipment_id IN (
      SELECT id FROM shipments 
      WHERE organization_id = get_user_organization_id() OR organization_id IS NULL
    )
  );

DROP POLICY IF EXISTS "Public can view scan events for tracking" ON scan_events;
CREATE POLICY "Public can view scan events for tracking" ON scan_events
  FOR SELECT TO anon
  USING (true);

-- =====================================================
-- SHIPMENT EVENTS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Users can view shipment events" ON shipment_events;
CREATE POLICY "Users can view shipment events" ON shipment_events
  FOR SELECT TO authenticated
  USING (
    shipment_id IN (
      SELECT id FROM shipments 
      WHERE organization_id = get_user_organization_id() OR organization_id IS NULL
    )
  );

DROP POLICY IF EXISTS "Public can view shipment events for tracking" ON shipment_events;
CREATE POLICY "Public can view shipment events for tracking" ON shipment_events
  FOR SELECT TO anon
  USING (true);

-- =====================================================
-- ADDRESSES POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Users can manage addresses" ON addresses;
CREATE POLICY "Users can manage addresses" ON addresses
  FOR ALL TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers 
      WHERE organization_id = get_user_organization_id() OR organization_id IS NULL
    )
  );

-- =====================================================
-- PACKAGES POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Users can manage packages" ON packages;
CREATE POLICY "Users can manage packages" ON packages
  FOR ALL TO authenticated
  USING (
    invoice_id IN (
      SELECT id FROM invoices 
      WHERE organization_id = get_user_organization_id() OR organization_id IS NULL
    )
  );

-- =====================================================
-- RATE CARDS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Users can view rate cards" ON rate_cards;
CREATE POLICY "Users can view rate cards" ON rate_cards
  FOR SELECT TO authenticated
  USING (true);

-- =====================================================
-- INVENTORY POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Users can manage inventory" ON inventory;
CREATE POLICY "Users can manage inventory" ON inventory
  FOR ALL TO authenticated
  USING (
    shipment_id IN (
      SELECT id FROM shipments 
      WHERE organization_id = get_user_organization_id() OR organization_id IS NULL
    )
  );

-- =====================================================
-- EXCEPTIONS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Users can manage exceptions" ON exceptions;
CREATE POLICY "Users can manage exceptions" ON exceptions
  FOR ALL TO authenticated
  USING (
    shipment_id IN (
      SELECT id FROM shipments 
      WHERE organization_id = get_user_organization_id() OR organization_id IS NULL
    )
  );

-- =====================================================
-- MANIFEST SHIPMENTS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Users can manage manifest shipments" ON manifest_shipments;
CREATE POLICY "Users can manage manifest shipments" ON manifest_shipments
  FOR ALL TO authenticated
  USING (
    manifest_id IN (
      SELECT id FROM manifests 
      WHERE organization_id = get_user_organization_id() OR organization_id IS NULL
    )
  );
