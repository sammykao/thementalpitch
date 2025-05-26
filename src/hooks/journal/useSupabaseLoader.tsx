import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { JournalEntry } from "./types";
import { toast } from "sonner";

export function useSupabaseLoader() {
  const loadFromSupabase = useCallback(async (userId: string, timeout = 8000) => {
    // Use a shorter timeout for better user experience
    let supabaseFetchCompleted = false;
    let supabaseEntries = null;
    let supabaseError = null;
    
    try {
      console.log(`Starting Supabase fetch with ${timeout}ms timeout for user ${userId}`);
      
      // Create a controller to allow for aborting the fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.log("Supabase fetch timeout reached, aborting request");
      }, timeout);
      
      try {
        // Use a direct approach instead of Promise.race for better error handling
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', userId)
          .order('timestamp', { ascending: false })
          .abortSignal(controller.signal);
        
        // Clear the timeout since we got a response
        clearTimeout(timeoutId);
        
        supabaseFetchCompleted = true;
        supabaseEntries = data;
        supabaseError = error;
        
        if (error) {
          console.error("Error fetching entries from Supabase:", error);
        } else if (data) {
          console.log(`Successfully fetched ${data.length} entries from Supabase`);
        }
      } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          console.error("Supabase fetch aborted due to timeout");
          throw new Error('Supabase fetch timeout');
        }
        throw error;
      }
    } catch (fetchError) {
      console.error("Supabase fetch error:", fetchError);
    }
    
    return { supabaseEntries, supabaseError, supabaseFetchCompleted };
  }, []);

  // Utility to process Supabase entries
  const processSupabaseEntries = useCallback((entries: any[], userEmail: string) => {
    if (!entries || entries.length === 0) return [];
    
    try {
      // Process all entries, keeping duplicates with the same timestamp
      const processedEntries = entries.map((entry: any) => {
        try {
          return {
            ...entry,
            content: typeof entry.content === 'string' ? JSON.parse(entry.content) : entry.content,
            userEmail
          };
        } catch (e) {
          console.error("Error parsing content for entry:", e, entry);
          return null;
        }
      }).filter(Boolean); // Remove any null entries from parsing errors
      
      return processedEntries;
    } catch (error) {
      console.error("Error processing Supabase entries:", error);
      return [];
    }
  }, []);

  return { loadFromSupabase, processSupabaseEntries };
}
