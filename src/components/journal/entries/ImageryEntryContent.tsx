
import React from "react";
import { JournalEntry } from "@/hooks/journal/types";
import { formatKeyForDisplay } from "@/utils/journalDisplay";

interface ImageryEntryContentProps {
  entry: JournalEntry;
}

const ImageryEntryContent: React.FC<ImageryEntryContentProps> = ({ entry }) => {
  const { content } = entry;

  return (
    <div className="space-y-3">
      {content.selectedPrompts && content.selectedPrompts.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-300">Selected prompts:</p>
          <div className="space-y-2 mt-1">
            {content.selectedPrompts.map((prompt: string, index: number) => (
              <p key={index} className="bg-[#1A1F2C] p-2 rounded text-sm">
                "{prompt}"
              </p>
            ))}
          </div>
        </div>
      )}
      
      {Object.entries(content)
        .filter(([key, value]) => 
          key !== 'selectedPrompts' && 
          key !== 'customAnswers' && 
          key !== 'timeOfDay' && // Exclude timeOfDay from content display
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
    </div>
  );
};

export default ImageryEntryContent;
