
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, Home, Trash, Database, Ban } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface JournalErrorProps {
  error: string;
}

const JournalError = ({ error }: JournalErrorProps) => {
  const { user } = useAuth();
  
  const handleRefresh = () => {
    window.location.reload();
  };
  
  const handleResetData = () => {
    try {
      // Clear local journal data
      localStorage.removeItem("journalEntries");
      localStorage.removeItem("inProgressGameEntry");
      toast.success("Journal data has been reset. Reloading page...");
      setTimeout(() => window.location.reload(), 1000);
    } catch (e) {
      console.error("Error clearing local storage:", e);
      toast.error("Failed to reset data");
      // Try reloading anyway
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleFullReset = () => {
    try {
      // Clear ALL local storage (more aggressive reset)
      localStorage.clear();
      toast.success("All app data has been reset. Reloading page...");
      setTimeout(() => window.location.reload(), 1000);
    } catch (e) {
      console.error("Error clearing local storage:", e);
      // Try reloading anyway
      window.location.reload();
    }
  };
  
  const handleForceReload = () => {
    try {
      // Most aggressive approach - force a full page reload clearing cache
      toast.info("Performing hard reload...");
      setTimeout(() => {
        // Force reload without using cache
        window.location.href = window.location.href + '?t=' + new Date().getTime();
      }, 500);
    } catch (e) {
      window.location.reload();
    }
  };

  return (
    <div className="w-full flex items-center justify-center py-8 flex-col">
      <AlertCircle className="text-red-500 w-10 h-10 mb-4" />
      <p className="text-red-400 mb-4 text-center whitespace-pre-wrap">{error}</p>
      
      <div className="flex flex-col space-y-3 w-full max-w-xs">
        <Button 
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Page
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleResetData}
          className="px-4 py-2 border border-red-500 text-red-400 rounded hover:bg-red-500/10 flex items-center justify-center"
        >
          <Trash className="h-4 w-4 mr-2" />
          Reset Journal Data Only
        </Button>

        <Button 
          variant="outline"
          onClick={handleForceReload}
          className="px-4 py-2 border border-purple-500 text-purple-400 rounded hover:bg-purple-500/10 flex items-center justify-center"
        >
          <Database className="h-4 w-4 mr-2" />
          Force Hard Reload
        </Button>

        <Link to="/" className="w-full">
          <Button 
            variant="outline"
            className="px-4 py-2 w-full border border-blue-500 text-blue-400 rounded hover:bg-blue-500/10 flex items-center justify-center"
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        
        <Button 
          variant="outline"
          onClick={handleFullReset}
          className="px-4 py-2 border border-yellow-500 text-yellow-400 rounded hover:bg-yellow-500/10 mt-4 flex items-center justify-center"
        >
          <Ban className="h-4 w-4 mr-2" />
          Reset All App Data
        </Button>
        
        {user && (
          <p className="text-xs text-gray-400 text-center mt-4">
            Signed in as {user.email}.<br />
            If problems persist, try signing out and back in.
          </p>
        )}
        
        {!user && (
          <p className="text-xs text-gray-400 text-center mt-4">
            You are not signed in. Try signing in to resolve this issue.
          </p>
        )}
      </div>
    </div>
  );
};

export default JournalError;
