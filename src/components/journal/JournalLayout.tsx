
import { ReactNode } from "react";
import NavigationBar from "@/components/ui/navigation-bar";
import JournalHeader from "@/components/journal/JournalHeader";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface JournalLayoutProps {
  children: ReactNode;
  title?: string;
  today: string;
  isLoading?: boolean;
}

const JournalLayout = ({ children, title, today, isLoading }: JournalLayoutProps) => {
  const handleRefresh = () => {
    toast.info("Refreshing journal...");
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#1A1F2C] text-white">
      <div className="w-full max-w-md px-4 py-8 flex flex-col items-center">
        <div className="w-full mb-8">
          <div className="bg-[#193175] rounded-lg p-4 w-full flex flex-col items-center">
            <JournalHeader today={today} userName={title} />
            
            {children}
            
            <div className="mt-6 w-full flex justify-center gap-2">
              <Link to="/">
                <Button 
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-blue-500 text-blue-300 hover:bg-blue-900/50"
                >
                  <Home className="h-4 w-4 mr-2" /> Home
                </Button>
              </Link>
              
              <Button 
                variant="outline"
                size="sm"
                className="bg-transparent border-blue-500 text-blue-300 hover:bg-blue-900/50"
                onClick={handleRefresh}
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh
              </Button>
            </div>
            
            {/* Navigation Bar */}
            <div className="w-full mt-6">
              <NavigationBar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalLayout;
