/**
 * Supabase client configuration
 * 
 * BEFORE USING: Create a Supabase project at https://supabase.com
 * Then replace the placeholder values below with your actual project URL and anon key
 * You can find these in your Supabase project settings > API
 */

import { createClient } from '@supabase/supabase-js';
import { AuthUser, AuthSession } from '../types/index';

// TODO: Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'https://fkoqfcufyeqojltfaveu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_9ZRu1wWJ4CKj4UfTUU1wEg_LDwPOKa9';

// Create and export the Supabase client
// This client is used for all database operations and authentication
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper function to get the current user
// Returns the authenticated user or null if not logged in
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user as AuthUser | null;
};

// Helper function to get the current session
// Returns the current session with access token or null
export const getCurrentSession = async (): Promise<AuthSession | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  return session as AuthSession | null;
};
