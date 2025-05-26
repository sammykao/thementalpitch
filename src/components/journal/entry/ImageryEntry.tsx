
import React from "react";
import { Button } from "@/components/ui/button";
import { formatKeyForDisplay } from "@/utils/journalDisplay";
import { JournalEntry } from "@/hooks/useJournalData";

interface ImageryEntryProps {
  entry: JournalEntry;
  isExpanded: boolean;
  toggleExpanded: () => void;
}

const ImageryEntry: React.FC<ImageryEntryProps> = ({ 
  entry, 
  isExpanded, 
  toggleExpanded
}) => {
  // If collapsed, only show rating
  if (!isExpanded) {
    if (entry.content.rating !== undefined && entry.content.rating !== null) {
      return (
        <>
          <div>
            <p className="text-sm font-medium text-gray-300">Rating:</p>
            <p className="bg-[#1A1F2C] p-2 rounded font-bold">{entry.content.rating}/10</p>
          </div>
          <Button 
            variant="link" 
            className="text-blue-300 p-0 h-auto"
            onClick={toggleExpanded}
          >
            Show more
          </Button>
        </>
      );
    } else {
      return (
        <Button 
          variant="link" 
          className="text-blue-300 p-0 h-auto"
          onClick={toggleExpanded}
        >
          Show more
        </Button>
      );
    }
  }

  return (
    <div className="space-y-3">
      {entry.content.selectedPrompts && entry.content.selectedPrompts.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-300">Selected prompts:</p>
          <div className="space-y-2 mt-1">
            {entry.content.selectedPrompts.map((prompt, index) => (
              <p key={index} className="bg-[#1A1F2C] p-2 rounded text-sm">
                "{prompt}"
              </p>
            ))}
          </div>
        </div>
      )}
      
      {/* Display custom imagery questions if any */}
      {entry.content.customAnswers && Object.keys(entry.content.customAnswers).length > 0 && (
        <div className="mt-4">
          <p className="font-bold mb-2">Custom Questions</p>
          {Object.entries(entry.content.customAnswers).map(([question, answer]) => (
            <div key={question} className="mb-3">
              <p className="text-sm font-medium text-gray-300">{question}:</p>
              <p className="bg-[#1A1F2C] p-2 rounded">{String(answer)}</p>
            </div>
          ))}
        </div>
      )}
      
      {Object.entries(entry.content)
        .filter(([key, value]) => 
          key !== 'selectedPrompts' && 
          key !== 'customAnswers' && 
          value !== undefined && 
          value !== null && 
          value !== "" && 
          typeof value !== 'object'
        )
        .map(([key, value]) => {
          // Format the key for display
          const formattedKey = formatKeyForDisplay(key);
          
          return (
            <div key={key}>
              <p className="text-sm font-medium text-gray-300">{formattedKey}:</p>
              {key === 'rating' ? (
                <p className="bg-[#1A1F2C] p-2 rounded font-bold">{value}/10</p>
              ) : (
                <p className="bg-[#1A1F2C] p-2 rounded">{String(value)}</p>
              )}
            </div>
          );
        })}
        
      <Button 
        variant="link" 
        className="text-blue-300 p-0 h-auto"
        onClick={toggleExpanded}
      >
        Show less
      </Button>
    </div>
  );
};

export default ImageryEntry;
