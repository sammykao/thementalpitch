
import { useCallback, useRef } from "react";
import { toast } from "sonner";

export function useLoadingTimeout() {
  // Keep track of whether a toast has been shown
  const toastShownRef = useRef(false);
  
  // Setup safety loading timeout with a shorter default (8 seconds)
  const setupLoadingTimeout = useCallback((
    callback: () => void, 
    timeoutMs = 8000
  ) => {
    // Create a timeout ID that we can clear later
    const timeoutId = setTimeout(() => {
      console.log("Loading timeout reached, showing entries without waiting for Supabase");
      callback();
      
      // Only show toast if it hasn't been shown yet in this session
      if (!toastShownRef.current) {
        toast.warning("Loading took longer than expected. Using local data.", {
          id: "loading-timeout-toast", // Use consistent ID to prevent duplicates
          duration: 4000
        });
        toastShownRef.current = true;
      }
    }, timeoutMs);
    
    return timeoutId;
  }, []);

  // Reset the toast shown flag (use when navigating between pages)
  const resetToastFlag = useCallback(() => {
    toastShownRef.current = false;
  }, []);

  return { setupLoadingTimeout, resetToastFlag };
}
