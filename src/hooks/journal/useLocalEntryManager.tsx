
import { useCallback } from "react";
import { JournalEntry } from "./types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook that handles journal entries
 * Now interfaces with Supabase directly and has removed localStorage functionality
 */
export function useLocalEntryManager() {
  /**
   * Get all journal entries from Supabase - legacy function maintained for compatibility
   * Returns an empty array as we no longer use localStorage
   */
  const getAllLocalEntries = useCallback(() => {
    console.log(`localStorage functionality has been removed`);
    return [];
  }, []);

  /**
   * Filter local entries for a specific user - legacy function maintained for compatibility
   * Returns empty array as we no longer use localStorage
   */
  const getLocalEntriesForUser = useCallback(() => {
    return [];
  }, []);

  /**
   * Save updated entries - legacy function maintained for compatibility
   * Now a no-op as we no longer use localStorage
   */
  const saveEntriesToLocal = useCallback(() => {
    return true;
  }, []);

  /**
   * Update a single entry in Supabase
   */
  const updateLocalEntry = useCallback(async (updatedEntry: JournalEntry) => {
    // If the entry has an ID and user_id, update it in Supabase
    if (updatedEntry.id && updatedEntry.user_id) {
      try {
        const { error } = await supabase
          .from('journal_entries')
          .update({
            content: updatedEntry.content,
            type: updatedEntry.type,
            date: updatedEntry.date
          })
          .eq('id', updatedEntry.id);
          
        if (error) {
          console.error("Error updating entry in Supabase:", error);
          return false;
        }
        
        return true;
      } catch (error) {
        console.error("Exception updating entry:", error);
        return false;
      }
    }
    
    return false;
  }, []);

  return {
    getAllLocalEntries,
    getLocalEntriesForUser,
    saveEntriesToLocal,
    updateLocalEntry
  };
}
