
import React from "react";
import { Button } from "@/components/ui/button";
import { formatKeyForDisplay, getQuestionTextById } from "@/utils/journalDisplay";
import { JournalEntry, Question } from "@/hooks/useJournalData";

interface LiftEntryProps {
  entry: JournalEntry;
  isExpanded: boolean;
  toggleExpanded: () => void;
  liftQuestions: Question[];
}

const LiftEntry: React.FC<LiftEntryProps> = ({ 
  entry, 
  isExpanded, 
  toggleExpanded,
  liftQuestions
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

  // Display answers object if it exists
  if (entry.content.answers && Object.keys(entry.content.answers).length > 0) {
    return (
      <div className="space-y-3">
        {Object.entries(entry.content.answers).map(([questionId, answer]) => {
          if (!answer) return null;
          
          // Try to find the original question text
          const questionText = getQuestionTextById(questionId, "lift", [], [], liftQuestions, []);
          
          return (
            <div key={questionId}>
              <p className="text-sm font-medium text-gray-300">{questionText}:</p>
              <p className="bg-[#1A1F2C] p-2 rounded">{answer}</p>
            </div>
          );
        })}
        
        {/* Display rating if exists */}
        {entry.content.rating !== undefined && entry.content.rating !== null && (
          <div>
            <p className="text-sm font-medium text-gray-300">Rating:</p>
            <p className="bg-[#1A1F2C] p-2 rounded font-bold">{entry.content.rating}/10</p>
          </div>
        )}
        
        {/* Display notes if exists */}
        {entry.content.notes && (
          <div>
            <p className="text-sm font-medium text-gray-300">Notes:</p>
            <p className="bg-[#1A1F2C] p-2 rounded">{entry.content.notes}</p>
          </div>
        )}
        
        <Button 
          variant="link" 
          className="text-blue-300 p-0 h-auto"
          onClick={toggleExpanded}
        >
          Show less
        </Button>
      </div>
    );
  } else {
    // Fall back to the original display method for older entries
    return (
      <div className="space-y-3">
        {Object.entries(entry.content)
          .filter(([key, value]) => value !== undefined && value !== null && value !== "" && typeof value !== 'object')
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
  }
};

export default LiftEntry;
