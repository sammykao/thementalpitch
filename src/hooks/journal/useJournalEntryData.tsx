
import { useCallback } from "react";
import { JournalEntry } from "./types";
import { parseISO, startOfDay, format } from "date-fns";

/**
 * Hook that provides utility functions for processing journal entries
 */
export function useJournalEntryData() {
  /**
   * Filter entries for a specific date
   */
  const filterEntriesForDate = useCallback((
    entries: JournalEntry[], 
    date: Date,
    userEmail?: string | null
  ) => {
    const selectedDateStart = startOfDay(date).getTime();
    
    return entries.filter((entry: JournalEntry) => {
      try {
        // Parse the timestamp to get the entry date
        const entryTimestamp = parseISO(entry.timestamp);
        const entryStartOfDay = startOfDay(entryTimestamp).getTime();
        
        // Check if entry belongs to selected day and current user
        const isSameDay = entryStartOfDay === selectedDateStart;
        const isCurrentUser = !userEmail || entry.userEmail === userEmail;
        
        return isSameDay && isCurrentUser;
      } catch (error) {
        console.error("Error parsing entry timestamp:", error, entry);
        return false;
      }
    });
  }, []);

  /**
   * Sort entries by type and timestamp
   */
  const sortEntries = useCallback((entries: JournalEntry[]) => {
    return [...entries].sort((a: JournalEntry, b: JournalEntry) => {
      // First sort by type
      const typeComparison = a.type.localeCompare(b.type);
      if (typeComparison !== 0) return typeComparison;
      
      // If types are the same, sort by timestamp (latest first)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, []);

  /**
   * Format a date for display
   */
  const formatDisplayDate = useCallback((date: Date) => {
    return format(date, "MMMM d, yyyy");
  }, []);

  return {
    filterEntriesForDate,
    sortEntries,
    formatDisplayDate
  };
}
