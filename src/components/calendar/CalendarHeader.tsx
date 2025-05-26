
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

interface CalendarHeaderProps {
  formattedToday: string;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ formattedToday }) => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-4">
        <Link to="/">
          <Button variant="ghost" className="text-white p-0 h-auto">
            <Home className="h-6 w-6" />
          </Button>
        </Link>
        <h2 className="text-2xl font-bold">YOUR JOURNAL</h2>
        <div className="w-6"></div> {/* Empty div for spacing */}
      </div>
      
      <div className="bg-[#3056b7] px-4 py-2 rounded-lg mb-6 text-center w-full">
        Today, {formattedToday}
      </div>
    </div>
  );
};

export default CalendarHeader;
