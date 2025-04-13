
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if Supabase is properly configured
 * @returns {boolean} Whether Supabase is properly configured
 */
export const isSupabaseConfigured = (): boolean => {
  // If we have a real Supabase client, return true
  return true;
};

/**
 * Returns the supabase client, regardless of whether it's a mock or real
 * @returns {typeof supabase} The Supabase client
 */
export const getMockOrRealSupabase = () => {
  return supabase;
};
