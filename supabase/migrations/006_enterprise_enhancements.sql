-- =====================================================
-- TAC Cargo Enterprise Enhancements Migration
-- Version: 006
-- Description: Add IATA-compliant fields, audit logging, and enterprise features
-- =====================================================

-- =====================================================
-- 1. ENHANCE INVOICES TABLE WITH IATA FIELDS
-- =====================================================

-- Add international trade fields
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS hs_code VARCHAR(12);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS country_of_origin VARCHAR(2);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS incoterms VARCHAR(10);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS export_license_no VARCHAR(50);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS import_license_no VARCHAR(50);

-- Add customs fields
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS customs_value DECIMAL(12,2);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS customs_currency VARCHAR(3) DEFAULT 'INR';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS duty_paid BOOLEAN DEFAULT FALSE;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS tax_exemption_certificate VARCHAR(50);

-- Add cargo details
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS package_type VARCHAR(50);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS gross_weight DECIMAL(10,2);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS net_weight DECIMAL(10,2);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS volumetric_weight DECIMAL(10,2);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS dimensions_length DECIMAL(10,2);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS dimensions_width DECIMAL(10,2);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS dimensions_height DECIMAL(10,2);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS dimensions_unit VARCHAR(10) DEFAULT 'cm';

-- Add insurance fields
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS insurance_provider VARCHAR(100);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS insurance_policy_no VARCHAR(50);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS insurance_amount DECIMAL(12,2);

-- Add banking fields
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS bank_name VARCHAR(100);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS account_number VARCHAR(50);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS swift_code VARCHAR(20);

-- Add compliance fields
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS dangerous_goods BOOLEAN DEFAULT FALSE;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS dg_class VARCHAR(10);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS un_number VARCHAR(10);

-- Add tracking fields
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS master_awb VARCHAR(20);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS house_awb VARCHAR(20);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS flight_number VARCHAR(20);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS vessel_name VARCHAR(100);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS container_number VARCHAR(20);

-- Add PDF storage fields
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS invoice_pdf_url TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS label_pdf_url TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS packing_list_pdf_url TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS pdf_generated_at TIMESTAMPTZ;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS pdf_version INTEGER DEFAULT 1;

-- Add soft delete
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- =====================================================
-- 2. ENHANCE SHIPMENTS TABLE
-- =====================================================

ALTER TABLE shipments ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS hs_code VARCHAR(12);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS dangerous_goods BOOLEAN DEFAULT FALSE;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS dg_class VARCHAR(10);

-- =====================================================
-- 3. ENHANCE MANIFESTS TABLE
-- =====================================================

ALTER TABLE manifests ADD COLUMN IF NOT EXISTS manifest_pdf_url TEXT;
ALTER TABLE manifests ADD COLUMN IF NOT EXISTS pdf_generated_at TIMESTAMPTZ;
ALTER TABLE manifests ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- =====================================================
-- 4. ENHANCE CUSTOMERS TABLE
-- =====================================================

ALTER TABLE customers ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS tax_id VARCHAR(50);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS company_registration_no VARCHAR(50);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS credit_days INTEGER DEFAULT 0;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS credit_used DECIMAL(12,2) DEFAULT 0;

-- =====================================================
-- 5. CREATE AUDIT LOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(20) NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT', 'PRINT', 'DOWNLOAD')),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_organization ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- =====================================================
-- 6. CREATE DOCUMENT VERSIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type VARCHAR(50) NOT NULL,
  document_id UUID NOT NULL,
  version INTEGER NOT NULL,
  data JSONB NOT NULL,
  pdf_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(document_type, document_id, version)
);

-- Create indexes for document versions
CREATE INDEX IF NOT EXISTS idx_document_versions_document ON document_versions(document_type, document_id);
CREATE INDEX IF NOT EXISTS idx_document_versions_created_at ON document_versions(created_at DESC);

-- =====================================================
-- 7. CREATE NOTIFICATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_organization ON notifications(organization_id);

-- =====================================================
-- 8. CREATE WEBHOOKS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL,
  secret TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for webhooks
CREATE INDEX IF NOT EXISTS idx_webhooks_organization ON webhooks(organization_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_active ON webhooks(active);

-- =====================================================
-- 9. CREATE WEBHOOK LOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID REFERENCES webhooks(id) ON DELETE CASCADE,
  event VARCHAR(50) NOT NULL,
  payload JSONB NOT NULL,
  response_status INTEGER,
  response_body TEXT,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for webhook logs
CREATE INDEX IF NOT EXISTS idx_webhook_logs_webhook ON webhook_logs(webhook_id, created_at DESC);

-- =====================================================
-- 10. CREATE API KEYS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  key_prefix VARCHAR(20) NOT NULL,
  key_hash TEXT NOT NULL,
  permissions JSONB,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for API keys
CREATE INDEX IF NOT EXISTS idx_api_keys_organization ON api_keys(organization_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_prefix ON api_keys(key_prefix);

-- =====================================================
-- 11. CREATE EMAIL LOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  to_email VARCHAR(255) NOT NULL,
  from_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  template VARCHAR(100),
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  provider_id TEXT,
  error TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for email logs
CREATE INDEX IF NOT EXISTS idx_email_logs_organization ON email_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status, created_at DESC);

-- =====================================================
-- 12. CREATE SMS LOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS sms_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  to_phone VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'sent', 'failed', 'delivered')),
  provider_id TEXT,
  error TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for SMS logs
CREATE INDEX IF NOT EXISTS idx_sms_logs_organization ON sms_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_sms_logs_status ON sms_logs(status, created_at DESC);

-- =====================================================
-- 13. UPDATE RLS POLICIES FOR NEW TABLES
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_logs ENABLE ROW LEVEL SECURITY;

-- Audit Logs RLS
CREATE POLICY "Users can view audit logs from their organization"
  ON audit_logs FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Document Versions RLS
CREATE POLICY "Users can view document versions from their organization"
  ON document_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM invoices 
      WHERE invoices.id = document_versions.document_id 
      AND invoices.organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- Notifications RLS
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Webhooks RLS
CREATE POLICY "Users can manage webhooks from their organization"
  ON webhooks FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Webhook Logs RLS
CREATE POLICY "Users can view webhook logs from their organization"
  ON webhook_logs FOR SELECT
  USING (
    webhook_id IN (
      SELECT id FROM webhooks WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- API Keys RLS
CREATE POLICY "Users can manage API keys from their organization"
  ON api_keys FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Email Logs RLS
CREATE POLICY "Users can view email logs from their organization"
  ON email_logs FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- SMS Logs RLS
CREATE POLICY "Users can view SMS logs from their organization"
  ON sms_logs FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- =====================================================
-- 14. UPDATE EXISTING RLS POLICIES TO EXCLUDE SOFT DELETES
-- =====================================================

-- Drop and recreate invoice policies to exclude soft deletes
DROP POLICY IF EXISTS "Users can view invoices from their organization" ON invoices;
CREATE POLICY "Users can view invoices from their organization"
  ON invoices FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- Drop and recreate shipment policies to exclude soft deletes
DROP POLICY IF EXISTS "Users can view shipments from their organization" ON shipments;
CREATE POLICY "Users can view shipments from their organization"
  ON shipments FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- Drop and recreate manifest policies to exclude soft deletes
DROP POLICY IF EXISTS "Users can view manifests from their organization" ON manifests;
CREATE POLICY "Users can view manifests from their organization"
  ON manifests FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- Drop and recreate customer policies to exclude soft deletes
DROP POLICY IF EXISTS "Users can view customers from their organization" ON customers;
CREATE POLICY "Users can view customers from their organization"
  ON customers FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- =====================================================
-- 15. CREATE FUNCTIONS FOR AUDIT LOGGING
-- =====================================================

CREATE OR REPLACE FUNCTION log_audit_event(
  p_action VARCHAR,
  p_entity_type VARCHAR,
  p_entity_id UUID,
  p_changes JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_audit_id UUID;
  v_organization_id UUID;
BEGIN
  -- Get organization_id from current user
  SELECT organization_id INTO v_organization_id
  FROM profiles WHERE id = auth.uid();
  
  -- Insert audit log
  INSERT INTO audit_logs (
    organization_id,
    user_id,
    action,
    entity_type,
    entity_id,
    changes,
    ip_address,
    user_agent
  ) VALUES (
    v_organization_id,
    auth.uid(),
    p_action,
    p_entity_type,
    p_entity_id,
    p_changes,
    p_ip_address,
    p_user_agent
  ) RETURNING id INTO v_audit_id;
  
  RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 16. CREATE TRIGGERS FOR AUTOMATIC AUDIT LOGGING
-- =====================================================

-- Function to automatically log invoice changes
CREATE OR REPLACE FUNCTION audit_invoice_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_audit_event('CREATE', 'invoice', NEW.id);
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_audit_event('UPDATE', 'invoice', NEW.id, 
      jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)));
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_audit_event('DELETE', 'invoice', OLD.id);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for invoices
DROP TRIGGER IF EXISTS audit_invoice_trigger ON invoices;
CREATE TRIGGER audit_invoice_trigger
  AFTER INSERT OR UPDATE OR DELETE ON invoices
  FOR EACH ROW EXECUTE FUNCTION audit_invoice_changes();

-- =====================================================
-- 17. ADD COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE audit_logs IS 'Audit trail for all entity changes in the system';
COMMENT ON TABLE document_versions IS 'Version history for invoices and other documents';
COMMENT ON TABLE notifications IS 'In-app notifications for users';
COMMENT ON TABLE webhooks IS 'Webhook configurations for external integrations';
COMMENT ON TABLE api_keys IS 'API keys for programmatic access';
COMMENT ON TABLE email_logs IS 'Email delivery logs';
COMMENT ON TABLE sms_logs IS 'SMS delivery logs';

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
