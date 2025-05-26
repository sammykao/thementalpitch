import React from "react";
import { JournalEntry, Question } from "@/hooks/useJournalData";
import TrainingEntryContent from "./TrainingEntryContent";
import GameEntryContent from "./GameEntryContent";
import RehabEntryContent from "./RehabEntryContent";
import LiftEntryContent from "./LiftEntryContent";
import ImageryEntryContent from "./ImageryEntryContent";
import FoodEntryContent from "./FoodEntryContent";
import { formatTimeDisplay } from "./JournalEntryUtils";

interface JournalEntryRendererProps {
  entry: JournalEntry;
  trainingQuestions: Question[];
  rehabQuestions: Question[];
  liftQuestions: Question[];
  gameQuestions: Question[];
}

const JournalEntryRenderer: React.FC<JournalEntryRendererProps> = ({
  entry,
  trainingQuestions,
  rehabQuestions,
  liftQuestions,
  gameQuestions
}) => {
  // Render appropriate content based on journal type
  const renderJournalContent = () => {
    // Log that we're rendering a particular entry type with questions
    console.log(`Rendering ${entry.type} entry with ${entry.type === "Training" ? 
      trainingQuestions.length : entry.type === "Rehab" ? 
      rehabQuestions.length : entry.type === "Lift" ?
      liftQuestions.length : entry.type === "Game" ?
      gameQuestions.length : 0} questions`);
    
    switch (entry.type) {
      case "Training":
        return <TrainingEntryContent entry={entry} trainingQuestions={trainingQuestions} />;
      
      case "Game":
        return <GameEntryContent entry={entry} gameQuestions={gameQuestions} />;
      
      case "Rehab":
        return <RehabEntryContent entry={entry} rehabQuestions={rehabQuestions} />;
      
      case "Lift":
        return <LiftEntryContent entry={entry} liftQuestions={liftQuestions} />;
      
      case "Imagery":
        return <ImageryEntryContent entry={entry} />;
        
      case "Food":
        return <FoodEntryContent entry={entry} />;
      
      default:
        return <p>No content available for {entry.type} type</p>;
    }
  };

  const timeDisplay = formatTimeDisplay(entry.timestamp, entry.content.timeOfDay);

  return (
    <div 
      className="bg-[#193175] border border-[#3056b7] rounded-lg p-4 mb-4"
    >
      <div className="text-md font-bold mb-1">{entry.date}</div>
      {timeDisplay && (
        <div className="text-xs text-blue-300 mb-2">
          Completed at {timeDisplay}
        </div>
      )}
      {renderJournalContent()}
    </div>
  );
};

export default JournalEntryRenderer;
