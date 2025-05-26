
import { useCallback } from "react";
import { JournalEntry } from "./types";
import { useEntryProcessor } from "./useEntryProcessor";

export function useJournalProcessor() {
  const { processEntries } = useEntryProcessor();
  
  const processJournalData = useCallback((
    entries: JournalEntry[], 
    todayDate: Date
  ) => {
    // Process entries to get todayEntries and activities
    const { todayEntries, activities } = processEntries(entries, todayDate);
    
    // Find in-progress entries
    // Game entries with pregame but no postgame data
    const inProgressEntries = entries
      .filter(entry => {
        // Filter for today's entries of type Game
        const entryDate = new Date(entry.timestamp);
        const isTodayEntry = entryDate.toDateString() === todayDate.toDateString();
        
        if (entry.type === "Game" && isTodayEntry) {
          // Check if it has pregame data but no postgame data
          const content = entry.content;
          return content && 
                 typeof content === 'object' && 
                 'pregame' in content && 
                 !('postgame' in content);
        }
        return false;
      })
      .map(entry => ({
        phase: "pregame",
        date: entry.date,
        timestamp: entry.timestamp,
        type: entry.type,
        userEmail: entry.userEmail,
        opposingTeam: entry.content?.opposingTeam || ""
      }));
    
    console.log("Found in-progress entries:", inProgressEntries);
    
    return {
      todayEntries,
      activities,
      inProgressEntries
    };
  }, [processEntries]);

  return { processJournalData };
}
