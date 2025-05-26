
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { formatTimeDisplay, getActivityTitle } from "@/utils/journalDisplay";
import JournalContent from "./JournalContent";
import { JournalEntry, Question } from "@/hooks/useJournalData";

interface EntryCardProps {
  entry: JournalEntry;
  index: number;
  expandedEntries: {[key: string]: boolean};
  toggleExpanded: (index: number) => void;
  handleDeleteEntry: (index: number) => void;
  trainingQuestions: Question[];
  rehabQuestions: Question[];
  liftQuestions: Question[];
  gameQuestions: Question[];
}

const EntryCard: React.FC<EntryCardProps> = ({
  entry,
  index,
  expandedEntries,
  toggleExpanded,
  handleDeleteEntry,
  trainingQuestions,
  rehabQuestions,
  liftQuestions,
  gameQuestions
}) => {
  // Create unique identifier label for debugging and identification
  const uniqueId = entry.id ? 
    (`ID: ${entry.id.substring(0, 6)}...`) : 
    (`TS: ${new Date(entry.timestamp).toLocaleTimeString()}`);
    
  // Check if this is a Game entry that only has pregame data (no postgame data)
  const isPartialGameEntry = 
    entry.type === "Game" && 
    entry.content?.pregame && 
    (!entry.content.postgame || Object.keys(entry.content.postgame).length === 0);

  return (
    <div className="bg-[#193175] border border-[#3056b7] rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-md font-bold mb-1">{getActivityTitle(entry)}</div>
          <div className="text-xs text-blue-300 mb-1">
            Completed at {formatTimeDisplay(entry.timestamp, entry.content.timeOfDay)}
          </div>
          <div className="text-xs text-gray-400 mb-2">
            {uniqueId}
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
          onClick={() => handleDeleteEntry(index)}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Add "Finish Journal" button for partial game entries */}
      {isPartialGameEntry && (
        <div className="mb-3 flex justify-end">
          <Link 
            to="/game-journal"
            state={{
              completingEntry: true,
              phase: "postgame",
              entryDate: entry.content.date || entry.date,
              opposingTeam: entry.content.opposingTeam
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg flex items-center"
          >
            Finish Journal →
          </Link>
        </div>
      )}
      
      <JournalContent
        entry={entry}
        index={index}
        expandedEntries={expandedEntries}
        toggleExpanded={toggleExpanded}
        trainingQuestions={trainingQuestions}
        rehabQuestions={rehabQuestions}
        liftQuestions={liftQuestions}
        gameQuestions={gameQuestions}
      />
    </div>
  );
};

export default EntryCard;
