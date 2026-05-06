import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Initialize Supabase client
// For now, we only use the anonymous client for public read access and inserting registrations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
