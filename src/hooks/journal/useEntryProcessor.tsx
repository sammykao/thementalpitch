import { useCallback } from "react";
import { JournalEntry } from "./types";
import { startOfDay } from "date-fns";

export function useEntryProcessor() {
  // Process entries helper function to avoid code duplication
  const processEntries = useCallback((entries: JournalEntry[], todayDate: Date) => {
    // Filter today's entries
    const todayStart = startOfDay(todayDate).getTime();
    
    const filteredTodayEntries = entries.filter((entry: JournalEntry) => {
      try {
        if (!entry.timestamp) return false;
        const entryDate = new Date(entry.timestamp);
        return startOfDay(entryDate).getTime() === todayStart;
      } catch (error) {
        console.error("Error parsing entry timestamp:", error, entry);
        return false;
      }
    });
    
    // Group by activity type to show one of each type
    const entriesByType = new Map<string, JournalEntry>();
    
    // For each activity type, keep the latest entry
    filteredTodayEntries.forEach(entry => {
      const existingEntry = entriesByType.get(entry.type);
      
      // If we don't have this type yet, or this entry is newer, use it
      if (!existingEntry || new Date(entry.timestamp) > new Date(existingEntry.timestamp)) {
        entriesByType.set(entry.type, entry);
      }
    });
    
    // Convert back to an array
    const uniqueTodayEntries = Array.from(entriesByType.values());
    
    // Get unique activity types
    const uniqueActivities = [...new Set(uniqueTodayEntries
      .filter(entry => entry && entry.type) // Ensure we have valid entries with a type
      .map(entry => entry.type))];
    
    return {
      todayEntries: uniqueTodayEntries,
      activities: uniqueActivities
    };
  }, []);

  return { processEntries };
}
