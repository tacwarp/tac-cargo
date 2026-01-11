-- Migration 008: Fix Audit Log Triggers
-- Fix triggers to use correct column names (old_data/new_data instead of changes)

-- Drop existing problematic triggers
DROP TRIGGER IF EXISTS audit_invoice_trigger ON invoices;
DROP FUNCTION IF EXISTS audit_invoice_changes();

-- Recreate function with correct column names
CREATE OR REPLACE FUNCTION audit_invoice_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (
      organization_id,
      user_id,
      action,
      entity_type,
      entity_id,
      new_data,
      metadata
    ) VALUES (
      NEW.organization_id,
      auth.uid(),
      'CREATE',
      'invoice',
      NEW.id,
      to_jsonb(NEW),
      jsonb_build_object('operation', 'INSERT')
    );
  ELSIF TG_OP = 'UPDATE' THEN
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
      NEW.organization_id,
      auth.uid(),
      'UPDATE',
      'invoice',
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW),
      jsonb_build_object('operation', 'UPDATE')
    );
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (
      organization_id,
      user_id,
      action,
      entity_type,
      entity_id,
      old_data,
      metadata
    ) VALUES (
      OLD.organization_id,
      auth.uid(),
      'DELETE',
      'invoice',
      OLD.id,
      to_jsonb(OLD),
      jsonb_build_object('operation', 'DELETE')
    );
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER audit_invoice_trigger
  AFTER INSERT OR UPDATE OR DELETE ON invoices
  FOR EACH ROW EXECUTE FUNCTION audit_invoice_changes();

-- Fix other entity triggers if they exist
-- Shipments
DROP TRIGGER IF EXISTS audit_shipments ON shipments;
CREATE TRIGGER audit_shipments
  AFTER INSERT OR UPDATE OR DELETE ON shipments
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- Manifests  
DROP TRIGGER IF EXISTS audit_manifests ON manifests;
CREATE TRIGGER audit_manifests
  AFTER INSERT OR UPDATE OR DELETE ON manifests
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- Customers
DROP TRIGGER IF EXISTS audit_customers ON customers;
CREATE TRIGGER audit_customers
  AFTER INSERT OR UPDATE OR DELETE ON customers
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- Payments
DROP TRIGGER IF EXISTS audit_payments ON payments;
CREATE TRIGGER audit_payments
  AFTER INSERT OR UPDATE OR DELETE ON payments
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- Generic function for other entities (uses correct columns)
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (
      organization_id,
      user_id,
      action,
      entity_type,
      entity_id,
      new_data
    ) VALUES (
      COALESCE(NEW.organization_id, NULL),
      auth.uid(),
      'CREATE',
      TG_TABLE_NAME,
      NEW.id,
      to_jsonb(NEW)
    );
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (
      organization_id,
      user_id,
      action,
      entity_type,
      entity_id,
      old_data,
      new_data
    ) VALUES (
      COALESCE(NEW.organization_id, OLD.organization_id),
      auth.uid(),
      'UPDATE',
      TG_TABLE_NAME,
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (
      organization_id,
      user_id,
      action,
      entity_type,
      entity_id,
      old_data
    ) VALUES (
      OLD.organization_id,
      auth.uid(),
      'DELETE',
      TG_TABLE_NAME,
      OLD.id,
      to_jsonb(OLD)
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION create_audit_log() IS 'Generic audit logging function using old_data/new_data columns';
COMMENT ON FUNCTION audit_invoice_changes() IS 'Invoice-specific audit logging with metadata';
