
import { format, parseISO } from "date-fns";

// Format time display - only returns timeOfDay if it exists and is not empty
export const formatTimeDisplay = (timestamp: string, timeOfDay?: string) => {
  if (timeOfDay && timeOfDay.trim()) {
    return timeOfDay;
  }
  
  // Return empty string instead of formatted timestamp when no timeOfDay
  return "";
};

// This function would check existing journal entries and patch them if needed
export const ensureTimeOfDayInEntries = () => {
  try {
    // Get existing entries
    const existingEntries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
    
    // Check if any entries don't have timeOfDay
    const needsUpdate = existingEntries.some(
      (entry: any) => !entry.content.timeOfDay
    );
    
    // If no update needed, return
    if (!needsUpdate) return;
    
    // Update entries without timeOfDay to have empty timeOfDay
    const updatedEntries = existingEntries.map((entry: any) => {
      if (!entry.content.timeOfDay) {
        return {
          ...entry,
          content: {
            ...entry.content,
            timeOfDay: ""
          }
        };
      }
      return entry;
    });
    
    // Save updated entries
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
  } catch (error) {
    console.error("Error updating journal entries with timeOfDay:", error);
  }
};
