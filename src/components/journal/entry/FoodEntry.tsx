
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatTimeDisplay } from "@/utils/journalDisplay";
import { JournalEntry } from "@/hooks/journal/types";
import FoodEntryContent from "../entries/FoodEntryContent";

interface FoodEntryProps {
  entry: JournalEntry;
  isExpanded: boolean;
  toggleExpanded: () => void;
}

const FoodEntry: React.FC<FoodEntryProps> = ({
  entry,
  isExpanded,
  toggleExpanded
}) => {
  const { content } = entry;
  
  return (
    <div className="border border-[#3056b7] rounded-lg p-4 mb-4">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-400">
            {formatTimeDisplay(entry.timestamp, content.timeOfDay)}
          </p>
        </div>
        <Button
          variant="ghost"
          className="p-2 h-auto"
          onClick={toggleExpanded}
        >
          {isExpanded ? (
            <ChevronUp className="h-6 w-6 text-gray-400" />
          ) : (
            <ChevronDown className="h-6 w-6 text-gray-400" />
          )}
        </Button>
      </div>
      
      {isExpanded && <FoodEntryContent entry={entry} />}
    </div>
  );
};

export default FoodEntry;
