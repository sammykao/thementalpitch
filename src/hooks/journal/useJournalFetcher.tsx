
import { useState, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { JournalEntry } from "./types";
import { useSupabaseLoader } from "./useSupabaseLoader";
import { toast } from "sonner";

export function useJournalFetcher() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const { loadFromSupabase, processSupabaseEntries } = useSupabaseLoader();
  const fetchAttemptRef = useRef(0);
  const networkStatusRef = useRef<'online' | 'offline' | 'unknown'>('unknown');
  
  // Check network connection
  const checkNetworkStatus = useCallback(() => {
    const isOnline = navigator.onLine;
    networkStatusRef.current = isOnline ? 'online' : 'offline';
    console.log(`Network status: ${networkStatusRef.current}`);
    return isOnline;
  }, []);
  
  const fetchJournalEntries = useCallback(async () => {
    setIsLoading(true);
    setLoadingError(null);
    
    try {
      console.log("Starting journal entry load process");
      fetchAttemptRef.current += 1;
      const currentAttempt = fetchAttemptRef.current;
      
      // Check network status
      const isOnline = checkNetworkStatus();
      
      // Initialize empty user entries
      let userEntries: JournalEntry[] = [];
      
      // Return local data immediately to display something fast
      const localResult = {
        entries: userEntries,
        source: 'local'
      };
      
      // If user is not authenticated, only use local entries
      if (!isAuthenticated || !user?.id) {
        console.log("User not authenticated or no user ID, using only local entries");
        setIsLoading(false);
        return localResult;
      }
      
      // If offline, only use local data
      if (!isOnline) {
        console.log("Device appears to be offline, using only local entries");
        setIsLoading(false);
        toast.info("You appear to be offline. Using local data only.", {
          id: "offline-toast"
        });
        return localResult;
      }
      
      // Try to load from Supabase with a shorter timeout (8 seconds)
      try {
        // If this isn't the most recent fetch attempt, abort
        if (currentAttempt !== fetchAttemptRef.current) {
          throw new Error("Newer fetch attempt in progress");
        }
        
        console.log(`Fetching data from Supabase for user ${user.id}`);
        const { supabaseEntries, supabaseError, supabaseFetchCompleted } = 
          await loadFromSupabase(user.id, 8000);
        
        if (supabaseFetchCompleted && supabaseEntries && supabaseEntries.length > 0) {
          console.log("Fetched entries from Supabase:", supabaseEntries.length);
          
          // If this isn't the most recent fetch attempt, abort
          if (currentAttempt !== fetchAttemptRef.current) {
            throw new Error("Newer fetch attempt in progress");
          }
          
          // Process Supabase entries - add the user's email as the second parameter
          const formattedEntries = processSupabaseEntries(supabaseEntries, user.email);
          
          setIsLoading(false);
          return {
            entries: formattedEntries,
            source: 'supabase'
          };
        }
      } catch (fetchError: any) {
        console.error("Supabase fetch error:", fetchError.message);
        // Fall back to local data already returned
      }
      
      // If we get here, return empty entries
      setIsLoading(false);
      return localResult;
      
    } catch (error) {
      console.error("Error in fetchJournalEntries:", error);
      setLoadingError("There was a problem loading your journal entries. Please try refreshing the page.");
      
      setIsLoading(false);
      return {
        entries: [],
        source: 'error',
        error
      };
    }
  }, [user, isAuthenticated, loadFromSupabase, processSupabaseEntries, checkNetworkStatus]);

  return {
    fetchJournalEntries,
    isLoading,
    loadingError
  };
}
