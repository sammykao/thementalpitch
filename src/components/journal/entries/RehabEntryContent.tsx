
import React from "react";
import { Question, JournalEntry } from "@/hooks/useJournalData";
import { formatKeyForDisplay, getQuestionTextById } from "./JournalEntryUtils";

interface RehabEntryContentProps {
  entry: JournalEntry;
  rehabQuestions: Question[];
}

const RehabEntryContent: React.FC<RehabEntryContentProps> = ({ 
  entry, 
  rehabQuestions 
}) => {
  // Display answers object if it exists
  if (entry.content.answers && Object.keys(entry.content.answers).length > 0) {
    return (
      <div className="space-y-3">
        {Object.entries(entry.content.answers).map(([questionId, answer]) => {
          if (!answer) return null;
          
          // Get the original question text
          const questionText = getQuestionTextById(
            questionId, 
            "Rehab", 
            [], 
            rehabQuestions || [], 
            [], 
            []
          );
          
          return (
            <div key={questionId} className="mb-3">
              <p className="text-sm font-medium text-gray-300">{questionText || formatKeyForDisplay(questionId)}:</p>
              <p className="bg-[#1A1F2C] p-2 rounded">{String(answer)}</p>
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
      </div>
    );
  } else {
    // Fall back to the original display method for older entries
    return (
      <div className="space-y-3">
        {Object.entries(entry.content)
          .filter(([key, value]) => 
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
                <p className="bg-[#1A1F2C] p-2 rounded">{String(value)}</p>
              </div>
            );
          })}
      </div>
    );
  }
};

export default RehabEntryContent;
