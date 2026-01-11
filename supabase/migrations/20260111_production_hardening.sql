-- Production Hardening Migration
-- Adds database-level constraints, indexes, and triggers for data integrity

-- ============================================================================
-- INVOICE CONSTRAINTS
-- ============================================================================

-- Add check constraint for valid invoice status transitions
ALTER TABLE invoices
ADD CONSTRAINT valid_invoice_status 
CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled'));

-- Ensure paid invoices have payment timestamp
CREATE OR REPLACE FUNCTION check_invoice_paid_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'paid' AND NEW.paid_at IS NULL THEN
    NEW.paid_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_invoice_paid_timestamp
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  WHEN (NEW.status = 'paid' AND OLD.status != 'paid')
  EXECUTE FUNCTION check_invoice_paid_timestamp();

-- Index for invoice lookups by status and date
CREATE INDEX IF NOT EXISTS idx_invoices_status_date 
ON invoices(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_invoices_customer 
ON invoices(customer_id, status);

-- ============================================================================
-- MANIFEST CONSTRAINTS
-- ============================================================================

-- Add check constraint for valid manifest status
ALTER TABLE manifests
ADD CONSTRAINT valid_manifest_status 
CHECK (status IN ('open', 'locked', 'dispatched', 'completed', 'cancelled'));

-- Prevent modifications to locked/dispatched manifests
CREATE OR REPLACE FUNCTION prevent_locked_manifest_modifications()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Check if manifest is locked
    IF EXISTS (
      SELECT 1 FROM manifests 
      WHERE id = NEW.manifest_id 
      AND status IN ('locked', 'dispatched', 'completed')
    ) THEN
      RAISE EXCEPTION 'Cannot add items to locked/dispatched manifest';
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    -- Check if manifest is locked
    IF EXISTS (
      SELECT 1 FROM manifests 
      WHERE id = OLD.manifest_id 
      AND status IN ('locked', 'dispatched', 'completed')
    ) THEN
      RAISE EXCEPTION 'Cannot remove items from locked/dispatched manifest';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_manifest_lock
  BEFORE INSERT OR DELETE ON manifest_items
  FOR EACH ROW
  EXECUTE FUNCTION prevent_locked_manifest_modifications();

-- Update manifest item count automatically
CREATE OR REPLACE FUNCTION update_manifest_item_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE manifests 
    SET item_count = (
      SELECT COUNT(*) FROM manifest_items WHERE manifest_id = NEW.manifest_id
    ),
    updated_at = NOW()
    WHERE id = NEW.manifest_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE manifests 
    SET item_count = (
      SELECT COUNT(*) FROM manifest_items WHERE manifest_id = OLD.manifest_id
    ),
    updated_at = NOW()
    WHERE id = OLD.manifest_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER maintain_manifest_item_count
  AFTER INSERT OR DELETE ON manifest_items
  FOR EACH ROW
  EXECUTE FUNCTION update_manifest_item_count();

-- Unique constraint: one shipment cannot be in multiple open manifests
CREATE UNIQUE INDEX IF NOT EXISTS idx_manifest_items_unique_shipment_open
ON manifest_items(shipment_id)
WHERE (SELECT status FROM manifests WHERE id = manifest_items.manifest_id) = 'open';

-- Index for manifest queries
CREATE INDEX IF NOT EXISTS idx_manifests_status_date 
ON manifests(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_manifest_items_manifest 
ON manifest_items(manifest_id);

CREATE INDEX IF NOT EXISTS idx_manifest_items_shipment 
ON manifest_items(shipment_id);

-- ============================================================================
-- SHIPMENT CONSTRAINTS
-- ============================================================================

-- Add check constraint for valid shipment status
ALTER TABLE shipments
ADD CONSTRAINT valid_shipment_status 
CHECK (status IN (
  'pending', 'picked_up', 'in_transit', 'at_hub', 
  'out_for_delivery', 'delivered', 'failed', 
  'returned', 'cancelled', 'exception'
));

-- Prevent delivered/cancelled shipments from being modified
CREATE OR REPLACE FUNCTION prevent_terminal_shipment_modifications()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IN ('delivered', 'cancelled', 'returned') 
     AND NEW.status != OLD.status THEN
    RAISE EXCEPTION 'Cannot modify shipment in terminal status: %', OLD.status;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_terminal_shipment_status
  BEFORE UPDATE ON shipments
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION prevent_terminal_shipment_modifications();

-- Index for shipment lookups
CREATE INDEX IF NOT EXISTS idx_shipments_status_date 
ON shipments(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_shipments_reference 
ON shipments(reference);

CREATE INDEX IF NOT EXISTS idx_shipments_customer 
ON shipments(customer_id, status);

CREATE INDEX IF NOT EXISTS idx_shipments_manifest 
ON shipments(manifest_id) WHERE manifest_id IS NOT NULL;

-- ============================================================================
-- INVENTORY CONSTRAINTS
-- ============================================================================

-- Prevent negative inventory
ALTER TABLE inventory
ADD CONSTRAINT positive_inventory_quantity 
CHECK (quantity >= 0);

-- Add check constraint for reorder point
ALTER TABLE inventory
ADD CONSTRAINT valid_reorder_point 
CHECK (reorder_point IS NULL OR reorder_point >= 0);

-- Index for inventory queries
CREATE INDEX IF NOT EXISTS idx_inventory_warehouse_sku 
ON inventory(warehouse_id, item_sku);

CREATE INDEX IF NOT EXISTS idx_inventory_low_stock 
ON inventory(warehouse_id, quantity) 
WHERE quantity <= reorder_point;

-- ============================================================================
-- TRACKING EVENTS
-- ============================================================================

-- Add check constraint for valid tracking status
ALTER TABLE tracking_events
ADD CONSTRAINT valid_tracking_status 
CHECK (status IN (
  'pending', 'picked_up', 'in_transit', 'at_hub', 
  'out_for_delivery', 'delivered', 'failed', 
  'returned', 'cancelled', 'exception'
));

-- Index for tracking timeline queries
CREATE INDEX IF NOT EXISTS idx_tracking_events_shipment_date 
ON tracking_events(shipment_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tracking_events_warehouse 
ON tracking_events(warehouse_id, created_at DESC);

-- ============================================================================
-- AUDIT LOGS
-- ============================================================================

-- Index for audit log queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_date 
ON audit_logs(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity 
ON audit_logs(entity_type, entity_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_org_date 
ON audit_logs(organization_id, created_at DESC);

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_shipments_customer_status_date 
ON shipments(customer_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_invoices_org_status_date 
ON invoices(organization_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_manifests_origin_status 
ON manifests(origin_warehouse_id, status);

CREATE INDEX IF NOT EXISTS idx_manifests_destination_status 
ON manifests(destination_warehouse_id, status);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables (if not already enabled)
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE manifests ENABLE ROW LEVEL SECURITY;
ALTER TABLE manifest_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for organization isolation
-- Users can only access data from their own organization

-- Invoices
DROP POLICY IF EXISTS invoices_org_isolation ON invoices;
CREATE POLICY invoices_org_isolation ON invoices
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Manifests
DROP POLICY IF EXISTS manifests_org_isolation ON manifests;
CREATE POLICY manifests_org_isolation ON manifests
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Manifest Items
DROP POLICY IF EXISTS manifest_items_org_isolation ON manifest_items;
CREATE POLICY manifest_items_org_isolation ON manifest_items
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Shipments
DROP POLICY IF EXISTS shipments_org_isolation ON shipments;
CREATE POLICY shipments_org_isolation ON shipments
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Inventory
DROP POLICY IF EXISTS inventory_org_isolation ON inventory;
CREATE POLICY inventory_org_isolation ON inventory
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Tracking Events
DROP POLICY IF EXISTS tracking_events_org_isolation ON tracking_events;
CREATE POLICY tracking_events_org_isolation ON tracking_events
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Audit Logs
DROP POLICY IF EXISTS audit_logs_org_isolation ON audit_logs;
CREATE POLICY audit_logs_org_isolation ON audit_logs
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- ============================================================================
-- ANALYTICS FUNCTIONS
-- ============================================================================

-- Function to get dashboard KPI metrics
CREATE OR REPLACE FUNCTION get_dashboard_kpis(org_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'active_shipments', (
      SELECT COUNT(*) FROM shipments 
      WHERE organization_id = org_id 
      AND status IN ('pending', 'picked_up', 'in_transit', 'out_for_delivery')
    ),
    'pending_invoices', (
      SELECT COUNT(*) FROM invoices 
      WHERE organization_id = org_id 
      AND status IN ('draft', 'sent', 'overdue')
    ),
    'total_revenue', (
      SELECT COALESCE(SUM(total_amount), 0) FROM invoices 
      WHERE organization_id = org_id 
      AND status = 'paid'
    ),
    'delivery_rate', (
      SELECT ROUND(
        (COUNT(*) FILTER (WHERE status = 'delivered')::DECIMAL / 
         NULLIF(COUNT(*), 0) * 100), 2
      )
      FROM shipments 
      WHERE organization_id = org_id
      AND created_at >= NOW() - INTERVAL '30 days'
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON CONSTRAINT valid_invoice_status ON invoices IS 
  'Enforces valid invoice status values matching the application state machine';

COMMENT ON CONSTRAINT valid_manifest_status ON manifests IS 
  'Enforces valid manifest status values matching the application state machine';

COMMENT ON CONSTRAINT valid_shipment_status ON shipments IS 
  'Enforces valid shipment status values matching the application state machine';

COMMENT ON CONSTRAINT positive_inventory_quantity ON inventory IS 
  'Prevents negative inventory quantities which indicate data corruption';

COMMENT ON FUNCTION prevent_locked_manifest_modifications() IS 
  'Enforces business rule: locked/dispatched manifests cannot be modified';

COMMENT ON FUNCTION update_manifest_item_count() IS 
  'Automatically maintains accurate item_count on manifest records';

COMMENT ON FUNCTION get_dashboard_kpis(UUID) IS 
  'Efficiently calculates KPI metrics for dashboard display';

