
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { JournalEntry } from "./types";
import { useJournalFetcher } from "./useJournalFetcher";
import { useJournalState } from "./useJournalState";
import { useJournalProcessor } from "./useJournalProcessor";
import { useLoadingTimeout } from "./useLoadingTimeout";
import { toast } from "sonner";

export function useJournalLoader() {
  const {
    journalEntries, setJournalEntries,
    todayEntries, setTodayEntries,
    activities, setActivities,
    inProgressEntries, setInProgressEntries
  } = useJournalState();
  
  const { fetchJournalEntries, isLoading: isFetching, loadingError } = useJournalFetcher();
  const { processJournalData } = useJournalProcessor();
  const { setupLoadingTimeout } = useLoadingTimeout();
  const { user } = useAuth();
  const todayDate = new Date();
  
  // Add loading lock to prevent multiple simultaneous loads
  const loadingLock = useRef(false);
  const loadAttemptedRef = useRef(false);
  const mountedRef = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadCompleted, setLoadCompleted] = useState(false);
  
  // Set up mounted ref for cleanup
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  // Load journal entries - always load local data first and quickly
  useEffect(() => {
    let isMounted = true;
    
    // If we've already attempted to load and the component is remounting,
    // let's use a shorter timeout for better user experience
    const loadTimeout = loadAttemptedRef.current ? 3000 : 6000;
    
    const loadEntries = async () => {
      // Check if loading is already in progress
      if (loadingLock.current) {
        console.log("Loading already in progress, skipping duplicate load");
        return;
      }
      
      // Mark that we've attempted to load at least once
      loadAttemptedRef.current = true;
      
      // Set loading lock
      loadingLock.current = true;
      console.log("Setting loading lock, starting data fetch");
      setIsLoading(true);
      
      try {
        // Use a timeout for better user experience
        const loadingTimeout = setupLoadingTimeout(() => {
          if (isMounted && mountedRef.current && loadingLock.current) {
            console.log("Loading timeout reached, releasing lock");
            loadingLock.current = false;
            setIsLoading(false);
            setLoadCompleted(true);
          }
        }, loadTimeout);
        
        const result = await fetchJournalEntries();
        
        // Clear the timeout since we got a response
        clearTimeout(loadingTimeout);
        
        if (!isMounted || !mountedRef.current) {
          console.log("Component unmounted during fetch, discarding results");
          return;
        }
        
        if (result.entries && result.entries.length > 0) {
          console.log(`Processing ${result.entries.length} entries`);
          const processed = processJournalData(result.entries, todayDate);
          
          setJournalEntries(result.entries);
          setTodayEntries(processed.todayEntries);
          setActivities(processed.activities);
          setInProgressEntries(processed.inProgressEntries);
        } else {
          console.log("No journal entries found");
        }
        
        // Always set loading to false and loadCompleted to true when done
        if (isMounted && mountedRef.current) {
          setIsLoading(false);
          setLoadCompleted(true);
        }
      } catch (error) {
        console.error("Error in loadEntries:", error);
        if (isMounted && mountedRef.current) {
          toast.error("Error loading journal data");
          setIsLoading(false);  // Make sure to set loading to false even on error
          setLoadCompleted(true);
        }
      } finally {
        // Release loading lock and mark loading as complete
        if (isMounted && mountedRef.current) {
          console.log("Releasing loading lock");
          loadingLock.current = false;
          setIsLoading(false);
          setLoadCompleted(true);
        }
      }
    };
    
    // Start loading immediately
    loadEntries();
    
    // Clean up
    return () => {
      isMounted = false;
    };
  }, [
    user, fetchJournalEntries, processJournalData, 
    setJournalEntries, setTodayEntries, 
    setActivities, setInProgressEntries,
    setupLoadingTimeout, todayDate
  ]);

  return {
    journalEntries,
    todayEntries,
    activities,
    inProgressEntries,
    isLoading,  // Ensure we're returning the loading state
    loadingError,
    loadCompleted,
    setJournalEntries,
    setActivities,
    setInProgressEntries
  };
}
