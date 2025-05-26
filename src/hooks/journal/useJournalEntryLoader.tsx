import { useState, useEffect } from "react";
import { parseISO, format, isValid } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { JournalEntry } from "./types";
import { toast } from "sonner";
import { useSupabaseEntryFetcher } from "./useSupabaseEntryFetcher";
import { useJournalEntryData } from "./useJournalEntryData";

export function useJournalEntryLoader(date?: string) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [displayDate, setDisplayDate] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);
  
  const { user } = useAuth();
  const { fetchEntriesForDate, processSupabaseEntries } = useSupabaseEntryFetcher();
  const { formatDisplayDate } = useJournalEntryData();

  // Load entries for the selected date or today
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      setLoadingComplete(true);
      return;
    }
    
    setIsLoading(true);
    console.log("Loading entries for date:", date);
    
    // Parse the date from params or use today's date
    let selectedDate: Date;
    let formattedISODate: string;
    
    try {
      if (date) {
        // If date is in YYYY-MM-DD format (from calendar), use it directly
        if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          selectedDate = new Date(date + 'T12:00:00'); // Add time to avoid timezone issues
          console.log("Parsed calendar date:", selectedDate);
        }
        // Otherwise try other formats
        else if (date.includes('-') && isValid(new Date(date))) {
          selectedDate = new Date(date);
        }
        // Then try to parse as "Month d" format
        else {
          const currentYear = new Date().getFullYear();
          selectedDate = new Date(`${date}, ${currentYear}`);
          
          // If invalid date, default to today
          if (!isValid(selectedDate)) {
            console.warn("Invalid date provided:", date);
            selectedDate = new Date();
          }
        }
      } else {
        selectedDate = new Date();
      }
      
      // Store the selected date in state for passing to the new activity page
      formattedISODate = format(selectedDate, "yyyy-MM-dd");
      setSelectedDate(formattedISODate);
      
      console.log("Final selected date:", selectedDate);
      console.log("Final formatted ISO date:", formattedISODate);
      
      // Set display date
      setDisplayDate(formatDisplayDate(selectedDate));
    } catch (error) {
      console.error("Error parsing date:", error);
      selectedDate = new Date();
      formattedISODate = format(selectedDate, "yyyy-MM-dd");
      setSelectedDate(formattedISODate);
      setDisplayDate(formatDisplayDate(selectedDate));
    }
    
    const loadEntries = async () => {
      try {
        if (!user) {
          setEntries([]);
          setIsLoading(false);
          setLoadingComplete(true);
          return;
        }
        
        // Format date for the query - we need entries for the selected day
        // Use the correct date range for the formatted ISO date
        const startDate = `${formattedISODate}T00:00:00.000Z`;
        const endDate = `${formattedISODate}T23:59:59.999Z`;
        
        console.log(`Fetching entries between ${startDate} and ${endDate}`);
        
        const supabaseEntries = await fetchEntriesForDate(user.id, startDate, endDate);
        
        // Also filter by the formatted date field as a backup
        const formattedDisplayDate = format(selectedDate, "MMMM d");
        const entriesMatchingDate = supabaseEntries.filter(entry => {
          const timestampMatch = entry.timestamp >= startDate && entry.timestamp <= endDate;
          const dateFieldMatch = entry.date === formattedDisplayDate || entry.date === format(selectedDate, "MMMM d, yyyy");
          return timestampMatch || dateFieldMatch;
        });
        
        const processedEntries = processSupabaseEntries(entriesMatchingDate, user.email);
        
        console.log(`Found ${processedEntries.length} entries matching the date`);
        setEntries(processedEntries);
      } catch (error) {
        console.error("Error loading journal entries:", error);
        toast.error("Could not load journal entries for this day.");
      } finally {
        setIsLoading(false);
        setLoadingComplete(true);
      }
    };
    
    loadEntries();
  }, [user, date, fetchEntriesForDate, processSupabaseEntries, formatDisplayDate]);

  return {
    entries,
    setEntries,
    displayDate,
    isLoading,
    loadingComplete,
    selectedDate
  };
}
