
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { JournalEntry } from "./types";
import { toast } from "sonner";

/**
 * Hook that handles fetching journal entries from Supabase
 */
export function useSupabaseEntryFetcher() {
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  /**
   * Fetch entries from Supabase for a specific date
   */
  const fetchEntriesForDate = useCallback(async (
    userId: string,
    startDate: string,
    endDate: string
  ) => {
    try {
      console.log(`Fetching from Supabase between ${startDate} and ${endDate}`);
    
      const { data: supabaseEntries, error } = await supabase
        .from('journal_entries')
        .select('*')
        .gte('timestamp', startDate)
        .lte('timestamp', endDate)
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });
      
      if (error) {
        console.error("Error fetching entries from Supabase:", error);
        setFetchError(error.message);
        return [];
      } 
      
      if (supabaseEntries) {
        console.log(`Found ${supabaseEntries.length} entries in Supabase`);
        return supabaseEntries;
      }
      
      return [];
    } catch (error) {
      console.error("Error in fetchEntriesForDate:", error);
      setFetchError("Failed to fetch entries from Supabase");
      return [];
    }
  }, []);

  /**
   * Format Supabase entries to the correct structure
   */
  const processSupabaseEntries = useCallback((
    entries: any[],
    userEmail?: string | null
  ): JournalEntry[] => {
    return entries.map((entry: any) => ({
      ...entry,
      content: typeof entry.content === 'string' ? JSON.parse(entry.content) : entry.content,
      userEmail: userEmail || entry.userEmail
    }));
  }, []);

  return {
    fetchEntriesForDate,
    processSupabaseEntries,
    fetchError
  };
}
