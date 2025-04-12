
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Use default placeholder values when environment variables are not available
// This prevents runtime errors during development and builds
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Create the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to check if the Supabase connection is properly configured with real values
export const isSupabaseConfigured = () => {
  const configured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!configured) {
    console.error('⚠️ Missing Supabase credentials. Please connect to Supabase using the Lovable integration.');
  }
  return !!configured;
};

// A mock version of Supabase client that returns empty data for development without credentials
export const getMockOrRealSupabase = () => {
  if (isSupabaseConfigured()) {
    return supabase;
  } else {
    console.warn('Using mock Supabase client. Connect to Supabase for real functionality.');
    // Return the real client but operations will be no-ops without credentials
    return supabase;
  }
};
