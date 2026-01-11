-- =====================================================
-- TAC Cargo - Payment Links Table
-- Migration 005: Razorpay Payment Links
-- =====================================================

-- Payment Links Table
CREATE TABLE IF NOT EXISTS payment_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Razorpay Details
  razorpay_link_id VARCHAR(100) UNIQUE NOT NULL,
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  
  -- Link Details
  short_url TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  
  -- Status
  status VARCHAR(50) DEFAULT 'created',
  -- created, sent, partially_paid, paid, cancelled, expired
  
  -- Tracking
  sent_via VARCHAR(50), -- 'whatsapp', 'sms', 'email'
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  
  -- Expiry
  expires_at TIMESTAMPTZ,
  
  -- Metadata
  notes JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payment_links_invoice ON payment_links(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payment_links_razorpay ON payment_links(razorpay_link_id);
CREATE INDEX IF NOT EXISTS idx_payment_links_status ON payment_links(status);
CREATE INDEX IF NOT EXISTS idx_payment_links_organization ON payment_links(organization_id);

-- Trigger for updated_at
CREATE TRIGGER payment_links_updated_at BEFORE UPDATE ON payment_links
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE payment_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view payment links in their organization" ON payment_links;
CREATE POLICY "Users can view payment links in their organization" ON payment_links
  FOR SELECT TO authenticated
  USING (
    invoice_id IN (
      SELECT id FROM invoices 
      WHERE organization_id = get_user_organization_id() OR organization_id IS NULL
    )
  );

DROP POLICY IF EXISTS "Users can create payment links" ON payment_links;
CREATE POLICY "Users can create payment links" ON payment_links
  FOR INSERT TO authenticated
  WITH CHECK (
    invoice_id IN (
      SELECT id FROM invoices 
      WHERE organization_id = get_user_organization_id() OR organization_id IS NULL
    )
  );

DROP POLICY IF EXISTS "Users can update payment links" ON payment_links;
CREATE POLICY "Users can update payment links" ON payment_links
  FOR UPDATE TO authenticated
  USING (
    invoice_id IN (
      SELECT id FROM invoices 
      WHERE organization_id = get_user_organization_id() OR organization_id IS NULL
    )
  );
