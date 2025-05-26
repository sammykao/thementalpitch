
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface JournalHeaderProps {
  today: string;
  userName?: string;
}

export const JournalHeader = ({ today, userName }: JournalHeaderProps) => {
  // Return "Your" as the default display name
  const displayName = "Your";
  
  return (
    <>
      <div className="w-full flex items-center justify-between mb-4">
        <Link to="/">
          <Button variant="ghost" className="text-white p-0 h-auto">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h2 className="text-2xl font-bold">{displayName} Journal</h2>
        <div className="w-6"></div> {/* Empty div for spacing */}
      </div>
      
      <div className="bg-[#3056b7] px-4 py-2 rounded-lg mb-6 text-center w-full">
        Today, {today}
      </div>
    </>
  );
};

export default JournalHeader;
