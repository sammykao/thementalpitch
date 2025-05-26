
import { createClient } from '@supabase/supabase-js';

// Use direct values instead of environment variables to ensure proper connection
const supabaseUrl = "https://ztzlarsaoqbzophivmoc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0emxhcnNhb3Fiem9waGl2bW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMzAyNTUsImV4cCI6MjA1ODYwNjI1NX0.VCuPfLvYohlUrQCS_833pSQ8ESC_GuWtK0aYXwQ07Nc";

// Create the Supabase client with direct values and explicit auth configuration
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      storageKey: 'mental-pitch-auth-token', // Custom storage key for persisting sessions
      storage: localStorage
    }
  }
);

// Helper to get user profile from Supabase
export async function getUserProfile() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}
