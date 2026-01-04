-- =====================================================
-- TAC Cargo - Multi-Tenancy & Enhanced Schema
-- Migration 002: Organizations, Profiles, Audit Logs
-- =====================================================

-- =====================================================
-- ORGANIZATIONS (Multi-Tenancy)
-- =====================================================

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  logo_url TEXT,
  
  -- Contact Info
  email VARCHAR(255),
  phone VARCHAR(20),
  website VARCHAR(255),
  
  -- Address
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  country VARCHAR(100) DEFAULT 'India',
  
  -- Business Info
  gstin VARCHAR(15),
  pan VARCHAR(10),
  registration_number VARCHAR(50),
  
  -- Settings
  settings JSONB DEFAULT '{}',
  features JSONB DEFAULT '{"max_users": 10, "max_warehouses": 5}',
  
  -- Subscription
  plan VARCHAR(50) DEFAULT 'free',
  plan_expires_at TIMESTAMPTZ,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- USER PROFILES (Linked to Supabase Auth)
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  
  -- Personal Info
  full_name VARCHAR(255),
  avatar_url TEXT,
  phone VARCHAR(20),
  
  -- Role & Permissions
  role VARCHAR(50) DEFAULT 'user',
  permissions JSONB DEFAULT '[]',
  
  -- Preferences
  preferences JSONB DEFAULT '{"theme": "system", "notifications": true}',
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- AUDIT LOGS
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Action Details
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  
  -- Data
  old_data JSONB,
  new_data JSONB,
  metadata JSONB DEFAULT '{}',
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SERVICE LEVELS
-- =====================================================

CREATE TABLE IF NOT EXISTS service_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) NOT NULL,
  description TEXT,
  
  -- SLA
  min_transit_hours INTEGER,
  max_transit_hours INTEGER,
  
  -- Pricing
  base_rate DECIMAL(10, 2) DEFAULT 0,
  per_kg_rate DECIMAL(10, 2) DEFAULT 0,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(organization_id, code)
);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Content
  title VARCHAR(255) NOT NULL,
  message TEXT,
  type VARCHAR(50) DEFAULT 'info',
  
  -- Linking
  entity_type VARCHAR(100),
  entity_id UUID,
  action_url TEXT,
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATION TEMPLATES
-- =====================================================

CREATE TABLE IF NOT EXISTS notification_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  name VARCHAR(100) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  
  -- Channels
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  whatsapp_enabled BOOLEAN DEFAULT false,
  push_enabled BOOLEAN DEFAULT false,
  
  -- Templates
  email_subject VARCHAR(255),
  email_body TEXT,
  sms_body VARCHAR(500),
  whatsapp_body TEXT,
  push_title VARCHAR(100),
  push_body VARCHAR(255),
  
  -- Variables available in template
  variables JSONB DEFAULT '[]',
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(organization_id, event_type)
);

-- =====================================================
-- WEBHOOKS
-- =====================================================

CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  name VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  secret VARCHAR(255),
  
  -- Events to trigger
  events JSONB DEFAULT '["shipment.created", "shipment.delivered"]',
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  failure_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- WEBHOOK LOGS
-- =====================================================

CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  webhook_id UUID REFERENCES webhooks(id) ON DELETE CASCADE,
  
  event_type VARCHAR(100) NOT NULL,
  payload JSONB,
  
  -- Response
  response_status INTEGER,
  response_body TEXT,
  
  -- Timing
  duration_ms INTEGER,
  
  success BOOLEAN DEFAULT false,
  error_message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- API KEYS
-- =====================================================

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  name VARCHAR(100) NOT NULL,
  key_hash VARCHAR(255) NOT NULL,
  key_prefix VARCHAR(20) NOT NULL,
  
  -- Permissions
  scopes JSONB DEFAULT '["read"]',
  
  -- Rate Limiting
  rate_limit INTEGER DEFAULT 1000,
  
  -- Validity
  expires_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- BARCODES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS barcodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  
  barcode_number VARCHAR(50) UNIQUE NOT NULL,
  barcode_type VARCHAR(20) DEFAULT 'CODE128',
  gs1_data TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SCAN EVENTS (Enhanced)
-- =====================================================

CREATE TABLE IF NOT EXISTS scan_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  warehouse_id UUID REFERENCES warehouses(id),
  
  status VARCHAR(50) NOT NULL,
  location VARCHAR(255),
  notes TEXT,
  
  -- GPS
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Device Info
  device_id VARCHAR(100),
  device_type VARCHAR(50),
  
  scanned_by UUID REFERENCES auth.users(id),
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ADD ORGANIZATION_ID TO EXISTING TABLES
-- =====================================================

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'organization_id') THEN
    ALTER TABLE customers ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'warehouses' AND column_name = 'organization_id') THEN
    ALTER TABLE warehouses ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'organization_id') THEN
    ALTER TABLE invoices ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'shipments' AND column_name = 'organization_id') THEN
    ALTER TABLE shipments ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'manifests' AND column_name = 'organization_id') THEN
    ALTER TABLE manifests ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
  END IF;
END $$;

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_profiles_organization ON profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_organization ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_webhooks_organization ON webhooks(organization_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_organization ON api_keys(organization_id);
CREATE INDEX IF NOT EXISTS idx_barcodes_shipment ON barcodes(shipment_id);
CREATE INDEX IF NOT EXISTS idx_barcodes_number ON barcodes(barcode_number);
CREATE INDEX IF NOT EXISTS idx_scan_events_shipment ON scan_events(shipment_id);
CREATE INDEX IF NOT EXISTS idx_scan_events_warehouse ON scan_events(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_customers_organization ON customers(organization_id);
CREATE INDEX IF NOT EXISTS idx_warehouses_organization ON warehouses(organization_id);
CREATE INDEX IF NOT EXISTS idx_invoices_organization ON invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_shipments_organization ON shipments(organization_id);
CREATE INDEX IF NOT EXISTS idx_manifests_organization ON manifests(organization_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER organizations_updated_at BEFORE UPDATE ON organizations
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER service_levels_updated_at BEFORE UPDATE ON service_levels
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER notification_templates_updated_at BEFORE UPDATE ON notification_templates
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER webhooks_updated_at BEFORE UPDATE ON webhooks
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- FUNCTIONS
-- =====================================================

CREATE OR REPLACE FUNCTION get_user_organization_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT organization_id 
    FROM profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION log_audit_event(
  p_action VARCHAR(100),
  p_entity_type VARCHAR(100),
  p_entity_id UUID,
  p_old_data JSONB DEFAULT NULL,
  p_new_data JSONB DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO audit_logs (
    organization_id,
    user_id,
    action,
    entity_type,
    entity_id,
    old_data,
    new_data,
    metadata
  ) VALUES (
    get_user_organization_id(),
    auth.uid(),
    p_action,
    p_entity_type,
    p_entity_id,
    p_old_data,
    p_new_data,
    p_metadata
  ) RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
