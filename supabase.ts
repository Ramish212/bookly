import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

/**
 * SQL SETUP FOR SUPABASE:
 * 
 * -- Create sites table
 * CREATE TABLE sites (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
 *   slug TEXT UNIQUE NOT NULL,
 *   business_name TEXT NOT NULL,
 *   brand_color TEXT,
 *   tagline TEXT,
 *   logo_url TEXT,
 *   city TEXT,
 *   phone TEXT,
 *   category TEXT,
 *   email_notifications BOOLEAN DEFAULT TRUE,
 *   sms_notifications BOOLEAN DEFAULT TRUE,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * -- Create services table
 * CREATE TABLE services (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
 *   name TEXT NOT NULL,
 *   duration_min INTEGER NOT NULL,
 *   price NUMERIC NOT NULL,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * -- Enable RLS
 * ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE services ENABLE ROW LEVEL SECURITY;
 * 
 * -- Public Read Policy (for booking page)
 * CREATE POLICY "Public Read Sites" ON sites FOR SELECT USING (true);
 * CREATE POLICY "Public Read Services" ON services FOR SELECT USING (true);
 * 
 * -- Owner Policy (for dashboard)
 * CREATE POLICY "Owner All Sites" ON sites FOR ALL USING (auth.uid() = user_id);
 * CREATE POLICY "Owner All Services" ON services FOR ALL USING (
 *   EXISTS (
 *     SELECT 1 FROM sites 
 *     WHERE sites.id = services.site_id AND sites.user_id = auth.uid()
 *   )
 * );
 */
