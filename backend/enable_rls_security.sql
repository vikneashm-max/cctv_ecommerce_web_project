-- ==============================================================================
-- Supabase Row Level Security (RLS) & Security Vulnerability Remediation Script
-- ==============================================================================
-- Run this script in your Supabase Dashboard -> SQL Editor
-- This script enables Row Level Security (RLS) on all application tables,
-- satisfying Supabase's security scanner while allowing your Spring Boot
-- backend (connecting via JDBC as postgres/service_role) full access.

-- 1. Enable Row Level Security (RLS) on all tables in public schema
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contact_messages ENABLE ROW LEVEL SECURITY;

-- 2. Create default RLS policies for postgres & service_role
-- (Note: Spring Boot connecting via JDBC automatically bypasses RLS as superuser,
--  these policies ensure clean access and prevent Supabase API warnings).

-- Products table (Allow public read access via API if needed, restrict write)
DROP POLICY IF EXISTS "Public read access for products" ON products;
CREATE POLICY "Public read access for products" ON products 
    FOR SELECT USING (true);

-- Users table (Restrict direct anon API access to sensitive user data)
DROP POLICY IF EXISTS "Service role full access on users" ON users;
CREATE POLICY "Service role full access on users" ON users 
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'postgres');

-- Orders table
DROP POLICY IF EXISTS "Service role full access on orders" ON orders;
CREATE POLICY "Service role full access on orders" ON orders 
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'postgres');

-- Order items table
DROP POLICY IF EXISTS "Service role full access on order_items" ON order_items;
CREATE POLICY "Service role full access on order_items" ON order_items 
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'postgres');

-- Cart items table
DROP POLICY IF EXISTS "Service role full access on cart_items" ON cart_items;
CREATE POLICY "Service role full access on cart_items" ON cart_items 
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'postgres');

-- Service requests table
DROP POLICY IF EXISTS "Service role full access on service_requests" ON service_requests;
CREATE POLICY "Service role full access on service_requests" ON service_requests 
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'postgres');

-- Contact messages table
DROP POLICY IF EXISTS "Service role full access on contact_messages" ON contact_messages;
CREATE POLICY "Service role full access on contact_messages" ON contact_messages 
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'postgres');

-- Verification query: list all tables and their RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
