
import React from "react";
import { Button } from "@/components/ui/button";
import EntryCard from "@/components/journal/EntryCard";
import { Question, JournalEntry } from "@/hooks/journal/types";

interface EntryListProps {
  entries: JournalEntry[];
  isLoading: boolean;
  expandedEntries: { [key: string]: boolean };
  toggleExpanded: (index: number) => void;
  handleDeleteEntry: (index: number) => void;
  handleAddEntry: () => void;
  trainingQuestions: Question[];
  rehabQuestions: Question[];
  liftQuestions: Question[];
  gameQuestions: Question[];
}

const EntryList: React.FC<EntryListProps> = ({
  entries,
  isLoading,
  expandedEntries,
  toggleExpanded,
  handleDeleteEntry,
  handleAddEntry,
  trainingQuestions,
  rehabQuestions,
  liftQuestions,
  gameQuestions
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-400">Loading entries...</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-400 mb-4">No journal entries for this day</p>
        <Button 
          className="bg-[#3056b7] hover:bg-[#2a4da3]"
          onClick={handleAddEntry}
        >
          Add Entry
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      {entries.map((entry, index) => (
        <div key={`${entry.id || entry.timestamp}-${index}`}>
          <EntryCard
            entry={entry}
            index={index}
            expandedEntries={expandedEntries}
            toggleExpanded={toggleExpanded}
            handleDeleteEntry={handleDeleteEntry}
            trainingQuestions={trainingQuestions}
            rehabQuestions={rehabQuestions}
            liftQuestions={liftQuestions}
            gameQuestions={gameQuestions}
          />
          
          {/* Add a small divider if this entry has the same type as the next entry */}
          {index < entries.length - 1 && entries[index].type === entries[index + 1].type && (
            <div className="border-b border-[#3056b7]/30 mx-8 my-1"></div>
          )}
        </div>
      ))}
      
      {/* Add a button to add more entries when entries already exist */}
      <div className="text-center py-4">
        <Button 
          className="bg-[#3056b7] hover:bg-[#2a4da3]"
          onClick={handleAddEntry}
        >
          Add Another Entry
        </Button>
      </div>
    </div>
  );
};

export default EntryList;
