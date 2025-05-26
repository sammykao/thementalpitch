
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const JournalLoading = () => {
  const [loadingTime, setLoadingTime] = useState(0);
  const [longLoadWarningShown, setLongLoadWarningShown] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setLoadingTime(elapsed);
      
      // After just 3 seconds suggest refresh, but only once
      if (elapsed >= 3 && !longLoadWarningShown) {
        toast.info("Taking longer than expected. Using local data only.", {
          id: "long-loading-warning"
        });
        setLongLoadWarningShown(true);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [longLoadWarningShown]);

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-center items-center mb-4">
        {isOnline ? (
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        ) : (
          <WifiOff className="h-8 w-8 text-amber-400" />
        )}
      </div>
      
      <p className="text-center text-blue-300 text-sm mb-1">
        {isOnline ? "Loading your journal data..." : "You appear to be offline. Loading local data..."}
      </p>
      
      <Skeleton className="h-12 w-full bg-gray-700/20" />
      <Skeleton className="h-36 w-full bg-gray-700/20" />
      <Skeleton className="h-36 w-full bg-gray-700/20" />
      
      {loadingTime >= 4 && (
        <div className="mt-6 flex justify-center">
          <Link to="/">
            <Button variant="outline" size="sm" className="mr-2">
              Return Home
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            size="sm"
            className="bg-blue-900/20 border-blue-500 hover:bg-blue-800/30"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </div>
      )}
      
      {!isOnline && (
        <p className="text-center text-amber-300 text-xs mt-2">
          No internet connection detected. Journal will load from local storage only.
        </p>
      )}
    </div>
  );
};

export default JournalLoading;
