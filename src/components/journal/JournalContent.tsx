
import React from "react";
import TrainingEntry from "./entry/TrainingEntry";
import GameEntry from "./entry/GameEntry";
import RehabEntry from "./entry/RehabEntry";
import LiftEntry from "./entry/LiftEntry";
import ImageryEntry from "./entry/ImageryEntry";
import FoodEntry from "./entry/FoodEntry";
import { JournalEntry, Question } from "@/hooks/useJournalData";

interface JournalContentProps {
  entry: JournalEntry;
  index: number;
  expandedEntries: {[key: string]: boolean};
  toggleExpanded: (index: number) => void;
  trainingQuestions: Question[];
  rehabQuestions: Question[];
  liftQuestions: Question[];
  gameQuestions: Question[];
}

const JournalContent: React.FC<JournalContentProps> = ({
  entry,
  index,
  expandedEntries,
  toggleExpanded,
  trainingQuestions,
  rehabQuestions,
  liftQuestions,
  gameQuestions
}) => {
  const isExpanded = expandedEntries[index] || false;
  const handleToggle = () => toggleExpanded(index);

  switch (entry.type) {
    case "Training":
      return (
        <TrainingEntry 
          entry={entry} 
          isExpanded={isExpanded} 
          toggleExpanded={handleToggle} 
          trainingQuestions={trainingQuestions}
        />
      );
    
    case "Game":
      return (
        <GameEntry 
          entry={entry} 
          isExpanded={isExpanded} 
          toggleExpanded={handleToggle} 
          gameQuestions={gameQuestions}
        />
      );
    
    case "Rehab":
      return (
        <RehabEntry 
          entry={entry} 
          isExpanded={isExpanded} 
          toggleExpanded={handleToggle} 
          rehabQuestions={rehabQuestions}
        />
      );
    
    case "Lift":
      return (
        <LiftEntry 
          entry={entry} 
          isExpanded={isExpanded} 
          toggleExpanded={handleToggle} 
          liftQuestions={liftQuestions}
        />
      );
    
    case "Imagery":
      return (
        <ImageryEntry 
          entry={entry} 
          isExpanded={isExpanded} 
          toggleExpanded={handleToggle}
        />
      );
    
    case "Food":
      return (
        <FoodEntry
          entry={entry}
          isExpanded={isExpanded}
          toggleExpanded={handleToggle}
        />
      );
    
    default:
      return <div>No content available for this entry type.</div>;
  }
};

export default JournalContent;
