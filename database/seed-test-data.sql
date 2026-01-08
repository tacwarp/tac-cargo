-- Test Data Seeding Script for TAC Cargo
-- Run this script to populate the database with test data for development and testing

-- ============================================
-- 1. WAREHOUSES
-- ============================================

INSERT INTO warehouses (code, name, address, city, state, pincode, country, latitude, longitude, capacity_sqm, is_active)
VALUES
  ('IMF-HQ', 'Imphal Hub', 'Khurai Industrial Area, Imphal East', 'Imphal', 'Manipur', '795010', 'India', 24.8170, 93.9368, 5000, true),
  ('DEL-01', 'Delhi Distribution Center', 'Sector 63, Noida', 'New Delhi', 'Delhi', '110001', 'India', 28.6139, 77.2090, 10000, true),
  ('MUM-01', 'Mumbai Logistics Hub', 'Bhiwandi Industrial Estate', 'Mumbai', 'Maharashtra', '400001', 'India', 19.0760, 72.8777, 8000, true),
  ('BLR-01', 'Bangalore Tech Park Warehouse', 'Whitefield Industrial Area', 'Bangalore', 'Karnataka', '560001', 'India', 12.9716, 77.5946, 6000, true),
  ('KOL-01', 'Kolkata Port Facility', 'Haldia Port Complex', 'Kolkata', 'West Bengal', '700001', 'India', 22.5726, 88.3639, 7000, true),
  ('CHN-01', 'Chennai Coastal Hub', 'Ennore Port Area', 'Chennai', 'Tamil Nadu', '600001', 'India', 13.0827, 80.2707, 5500, true),
  ('HYD-01', 'Hyderabad Central Depot', 'Shamshabad Cargo Complex', 'Hyderabad', 'Telangana', '500001', 'India', 17.3850, 78.4867, 6500, true),
  ('PUN-01', 'Pune Industrial Warehouse', 'Chakan MIDC', 'Pune', 'Maharashtra', '411001', 'India', 18.5204, 73.8567, 4500, true),
  ('AMD-01', 'Ahmedabad Freight Center', 'Sanand Industrial Area', 'Ahmedabad', 'Gujarat', '380001', 'India', 23.0225, 72.5714, 5000, true),
  ('CCU-02', 'Kolkata Secondary Hub', 'Salt Lake Sector V', 'Kolkata', 'West Bengal', '700091', 'India', 22.5726, 88.4639, 3000, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- 2. CUSTOMERS
-- ============================================

INSERT INTO customers (name, gst_number, contact_person, contact_email, contact_phone, billing_address, city, state, pincode, credit_limit)
VALUES
  ('ABC Corporation', '27AABCU9603R1ZM', 'Rajesh Kumar', 'finance@abc-corp.com', '+919876543210', '123 Business Park, Andheri East', 'Mumbai', 'Maharashtra', '400069', 500000),
  ('XYZ Logistics Pvt Ltd', '09AADCX1234M1Z5', 'Priya Sharma', 'ops@xyz-logistics.com', '+919876543211', '456 Industrial Area, Sector 62', 'New Delhi', 'Delhi', '110062', 750000),
  ('Metro Express Services', '19AAFCM5123K1ZP', 'Amit Patel', 'billing@metro-express.in', '+919876543212', '789 Transport Nagar, Whitefield', 'Bangalore', 'Karnataka', '560066', 600000),
  ('Quick Ship Co', '33AAGCQ7890L1Z3', 'Sneha Reddy', 'accounts@quickship.com', '+919876543213', '321 Logistics Hub, Banjara Hills', 'Hyderabad', 'Telangana', '500034', 450000),
  ('Prime Cargo Solutions', '29AAHCP4567N1Z8', 'Vikram Singh', 'contact@primecargo.in', '+919876543214', '654 Freight Complex, Kharadi', 'Pune', 'Maharashtra', '411014', 550000),
  ('Fast Freight India', '24AAIFC3456P1Z2', 'Anjali Desai', 'info@fastfreight.co.in', '+919876543215', '987 Cargo Terminal, Sanand', 'Ahmedabad', 'Gujarat', '382110', 400000),
  ('Swift Movers Ltd', '07AAJCS2345Q1Z7', 'Rahul Verma', 'support@swiftmovers.com', '+919876543216', '147 Transport Hub, Noida', 'New Delhi', 'Delhi', '201301', 650000),
  ('Rapid Transit Corp', '36AAKRC1234R1Z4', 'Deepa Iyer', 'admin@rapidtransit.in', '+919876543217', '258 Industrial Estate, Guindy', 'Chennai', 'Tamil Nadu', '600032', 500000),
  ('Global Freight Partners', '19AALFG5678S1Z9', 'Suresh Nair', 'hello@globalfreight.com', '+919876543218', '369 Logistics Park, Electronic City', 'Bangalore', 'Karnataka', '560100', 800000),
  ('Express Cargo Hub', '27AAMEC4321T1Z1', 'Kavita Joshi', 'care@expresscargo.in', '+919876543219', '741 Freight Zone, Andheri West', 'Mumbai', 'Maharashtra', '400053', 550000)
ON CONFLICT (contact_email) DO NOTHING;

-- ============================================
-- 3. SERVICE LEVELS
-- ============================================

INSERT INTO service_levels (name, code, transport_mode, estimated_days, price_per_kg, is_active)
VALUES
  ('Express Air', 'EXP-AIR', 'air', 1, 25.00, true),
  ('Standard Air', 'STD-AIR', 'air', 2, 18.00, true),
  ('Express Surface', 'EXP-SRF', 'surface', 3, 12.00, true),
  ('Standard Surface', 'STD-SRF', 'surface', 5, 8.00, true),
  ('Economy Surface', 'ECO-SRF', 'economy', 7, 5.00, true),
  ('Premium Express', 'PRM-EXP', 'express', 1, 35.00, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- 4. SHIPMENTS (Test Data)
-- ============================================

-- Get warehouse and customer IDs for reference
DO $$
DECLARE
  imf_id UUID;
  del_id UUID;
  mum_id UUID;
  blr_id UUID;
  kol_id UUID;
  chn_id UUID;
  
  abc_id UUID;
  xyz_id UUID;
  metro_id UUID;
  quick_id UUID;
  prime_id UUID;
  
  exp_air_id UUID;
  std_srf_id UUID;
  eco_srf_id UUID;
BEGIN
  -- Get warehouse IDs
  SELECT id INTO imf_id FROM warehouses WHERE code = 'IMF-HQ';
  SELECT id INTO del_id FROM warehouses WHERE code = 'DEL-01';
  SELECT id INTO mum_id FROM warehouses WHERE code = 'MUM-01';
  SELECT id INTO blr_id FROM warehouses WHERE code = 'BLR-01';
  SELECT id INTO kol_id FROM warehouses WHERE code = 'KOL-01';
  SELECT id INTO chn_id FROM warehouses WHERE code = 'CHN-01';
  
  -- Get customer IDs
  SELECT id INTO abc_id FROM customers WHERE contact_email = 'finance@abc-corp.com';
  SELECT id INTO xyz_id FROM customers WHERE contact_email = 'ops@xyz-logistics.com';
  SELECT id INTO metro_id FROM customers WHERE contact_email = 'billing@metro-express.in';
  SELECT id INTO quick_id FROM customers WHERE contact_email = 'accounts@quickship.com';
  SELECT id INTO prime_id FROM customers WHERE contact_email = 'contact@primecargo.in';
  
  -- Get service level IDs
  SELECT id INTO exp_air_id FROM service_levels WHERE code = 'EXP-AIR';
  SELECT id INTO std_srf_id FROM service_levels WHERE code = 'STD-SRF';
  SELECT id INTO eco_srf_id FROM service_levels WHERE code = 'ECO-SRF';
  
  -- Insert test shipments
  INSERT INTO shipments (
    reference, customer_id, origin_warehouse_id, destination_warehouse_id,
    transport_mode, service_level_id, status, weight_kg, pieces,
    consignee_name, consignee_phone, consignee_email, consignee_address,
    consignee_city, consignee_state, consignee_pincode, declared_value,
    notes, created_at
  ) VALUES
    -- Active shipments
    ('SHP-IMF-2601-0001', abc_id, imf_id, del_id, 'air', exp_air_id, 'in_transit', 25.5, 2, 'Rajesh Kumar', '+919876543210', 'rajesh@abc-corp.com', '123 Business Park, Andheri East', 'Mumbai', 'Maharashtra', '400069', 50000, 'Fragile - Handle with care', NOW() - INTERVAL '2 days'),
    ('SHP-IMF-2601-0002', xyz_id, imf_id, mum_id, 'surface', std_srf_id, 'pending', 15.2, 1, 'Priya Sharma', '+919876543211', 'priya@xyz.com', '456 Industrial Area', 'New Delhi', 'Delhi', '110062', 35000, 'Standard delivery', NOW() - INTERVAL '1 day'),
    ('SHP-IMF-2601-0003', metro_id, imf_id, kol_id, 'surface', std_srf_id, 'delivered', 8.7, 1, 'Amit Patel', '+919876543212', 'amit@metro.in', '789 Transport Nagar', 'Bangalore', 'Karnataka', '560066', 28000, NULL, NOW() - INTERVAL '5 days'),
    ('SHP-IMF-2601-0004', quick_id, imf_id, chn_id, 'surface', std_srf_id, 'in_transit', 32.1, 3, 'Sneha Reddy', '+919876543213', 'sneha@quick.com', '321 Logistics Hub', 'Hyderabad', 'Telangana', '500034', 65000, 'Urgent delivery required', NOW() - INTERVAL '3 days'),
    ('SHP-IMF-2601-0005', prime_id, imf_id, blr_id, 'economy', eco_srf_id, 'pending', 12.4, 1, 'Vikram Singh', '+919876543214', 'vikram@prime.in', '654 Freight Complex', 'Pune', 'Maharashtra', '411014', 22000, NULL, NOW() - INTERVAL '1 day'),
    
    -- Test AWB for tracking
    ('TAC-88291', abc_id, imf_id, del_id, 'air', exp_air_id, 'in_transit', 18.5, 2, 'Test Consignee', '+919876543220', 'test@example.com', 'Test Address 123', 'Mumbai', 'Maharashtra', '400001', 45000, 'Test shipment for tracking', NOW() - INTERVAL '1 day')
  ON CONFLICT (reference) DO NOTHING;
  
  -- Insert tracking events for TAC-88291
  INSERT INTO tracking_events (shipment_id, status, location, warehouse_id, scanned_at, notes)
  SELECT 
    s.id,
    'picked_up',
    'Imphal Hub',
    imf_id,
    NOW() - INTERVAL '1 day',
    'Package picked up from origin'
  FROM shipments s WHERE s.reference = 'TAC-88291'
  ON CONFLICT DO NOTHING;
  
  INSERT INTO tracking_events (shipment_id, status, location, warehouse_id, scanned_at, notes)
  SELECT 
    s.id,
    'in_transit',
    'Delhi Distribution Center',
    del_id,
    NOW() - INTERVAL '12 hours',
    'In transit to destination'
  FROM shipments s WHERE s.reference = 'TAC-88291'
  ON CONFLICT DO NOTHING;
  
  INSERT INTO tracking_events (shipment_id, status, location, warehouse_id, scanned_at, notes)
  SELECT 
    s.id,
    'at_hub',
    'Delhi Distribution Center',
    del_id,
    NOW() - INTERVAL '6 hours',
    'Arrived at destination hub'
  FROM shipments s WHERE s.reference = 'TAC-88291'
  ON CONFLICT DO NOTHING;
  
  INSERT INTO tracking_events (shipment_id, status, location, warehouse_id, scanned_at, notes)
  SELECT 
    s.id,
    'out_for_delivery',
    'Delhi Distribution Center',
    del_id,
    NOW() - INTERVAL '2 hours',
    'Out for delivery'
  FROM shipments s WHERE s.reference = 'TAC-88291'
  ON CONFLICT DO NOTHING;
  
END $$;

-- ============================================
-- 5. VERIFICATION QUERIES
-- ============================================

-- Verify data insertion
SELECT 'Warehouses' as table_name, COUNT(*) as count FROM warehouses
UNION ALL
SELECT 'Customers', COUNT(*) FROM customers
UNION ALL
SELECT 'Service Levels', COUNT(*) FROM service_levels
UNION ALL
SELECT 'Shipments', COUNT(*) FROM shipments
UNION ALL
SELECT 'Tracking Events', COUNT(*) FROM tracking_events;

-- Display test shipment for tracking
SELECT 
  s.reference,
  s.status,
  c.name as customer,
  o.name as origin,
  d.name as destination,
  COUNT(te.id) as tracking_events
FROM shipments s
JOIN customers c ON s.customer_id = c.id
JOIN warehouses o ON s.origin_warehouse_id = o.id
JOIN warehouses d ON s.destination_warehouse_id = d.id
LEFT JOIN tracking_events te ON s.id = te.shipment_id
WHERE s.reference = 'TAC-88291'
GROUP BY s.reference, s.status, c.name, o.name, d.name;
