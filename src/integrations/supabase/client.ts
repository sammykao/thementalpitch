
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = "https://ztzlarsaoqbzophivmoc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0emxhcnNhb3Fiem9waGl2bW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMzAyNTUsImV4cCI6MjA1ODYwNjI1NX0.VCuPfLvYohlUrQCS_833pSQ8ESC_GuWtK0aYXwQ07Nc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storageKey: 'mental-pitch-auth-token', // Use the same storage key
    storage: AsyncStorage
  }
});
