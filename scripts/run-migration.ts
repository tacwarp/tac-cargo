import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ACCESS_TOKEN!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const migrations = [
  // Add missing columns to shipments
  `ALTER TABLE shipments ADD COLUMN IF NOT EXISTS reference VARCHAR(50)`,
  `ALTER TABLE shipments ADD COLUMN IF NOT EXISTS customer_id UUID`,
  `ALTER TABLE shipments ADD COLUMN IF NOT EXISTS consignee_name VARCHAR(255)`,
  `ALTER TABLE shipments ADD COLUMN IF NOT EXISTS consignee_phone VARCHAR(20)`,
  `ALTER TABLE shipments ADD COLUMN IF NOT EXISTS consignee_email VARCHAR(255)`,
  `ALTER TABLE shipments ADD COLUMN IF NOT EXISTS consignee_address TEXT`,
  `ALTER TABLE shipments ADD COLUMN IF NOT EXISTS consignee_city VARCHAR(100)`,
  `ALTER TABLE shipments ADD COLUMN IF NOT EXISTS consignee_state VARCHAR(100)`,
  `ALTER TABLE shipments ADD COLUMN IF NOT EXISTS consignee_pincode VARCHAR(10)`,
  `ALTER TABLE shipments ADD COLUMN IF NOT EXISTS origin_warehouse_id UUID`,
  `ALTER TABLE shipments ADD COLUMN IF NOT EXISTS destination_warehouse_id UUID`,
  `ALTER TABLE shipments ADD COLUMN IF NOT EXISTS manifest_id UUID`,
  `ALTER TABLE shipments ADD COLUMN IF NOT EXISTS transport_mode VARCHAR(20)`,
  `ALTER TABLE shipments ADD COLUMN IF NOT EXISTS payment_mode VARCHAR(20)`,
  `ALTER TABLE shipments ADD COLUMN IF NOT EXISTS pieces INTEGER DEFAULT 1`,
  `ALTER TABLE shipments ADD COLUMN IF NOT EXISTS weight_kg DECIMAL(10, 2)`,
  `ALTER TABLE shipments ADD COLUMN IF NOT EXISTS notes TEXT`,
  `ALTER TABLE shipments ADD COLUMN IF NOT EXISTS organization_id UUID`,
  
  // Add missing columns to invoices
  `ALTER TABLE invoices ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'label'`,
  `ALTER TABLE invoices ADD COLUMN IF NOT EXISTS shipment_id UUID`,
];

async function runMigrations() {
  console.log('Running migrations...');
  
  for (const sql of migrations) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
      if (error) {
        console.log(`Note: ${sql.substring(0, 50)}... - ${error.message}`);
      } else {
        console.log(`✓ ${sql.substring(0, 50)}...`);
      }
    } catch {
      console.log(`Skip: ${sql.substring(0, 50)}...`);
    }
  }
  
  console.log('Migration complete!');
}

runMigrations();
