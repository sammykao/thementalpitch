
import React from "react";
import { Button } from "@/components/ui/button";
import { JournalEntry, Question } from "@/hooks/useJournalData";
import { formatKeyForDisplay } from "@/utils/journalDisplay";

interface GameEntryProps {
  entry: JournalEntry;
  isExpanded: boolean;
  toggleExpanded: () => void;
  gameQuestions: Question[];
}

const GameEntry: React.FC<GameEntryProps> = ({ 
  entry, 
  isExpanded, 
  toggleExpanded,
  gameQuestions
}) => {
  // Defensive programming: ensure gameQuestions is always an array
  const safeGameQuestions = Array.isArray(gameQuestions) ? gameQuestions : [];
  
  // Add console logging for debugging
  if (!Array.isArray(gameQuestions)) {
    console.warn("GameEntry: gameQuestions is not an array:", gameQuestions);
  }
  
  // If collapsed, only show rating
  if (!isExpanded) {
    if (entry.content.postgame?.rating !== undefined && entry.content.postgame?.rating !== null) {
      return (
        <>
          <div>
            <p className="text-sm font-medium text-gray-300">Rating:</p>
            <p className="bg-[#1A1F2C] p-2 rounded font-bold">{entry.content.postgame.rating}/10</p>
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
      {entry.content.pregame && (
        <>
          <div className="bg-[#1A1F2C] p-3 rounded mb-3">
            <p className="font-bold mb-2">Pre-Game</p>
            
            {/* Display pregame questions with original text */}
            {(() => {
              const pregameQuestions = safeGameQuestions.filter(q => 
                q.section === "pregame" && q.enabled
              );
              
              // Display each pregame question with its answer
              return Object.entries(entry.content.pregame).filter(
                ([key, value]) => value !== undefined && value !== null && value !== ""
              ).map(([key, value]) => {
                // Find the original question text
                let questionText = formatKeyForDisplay(key);
                
                // Match key to pregame questions by index for default questions
                if (key === "controlFactors" && pregameQuestions.length > 0) {
                  questionText = pregameQuestions[0].text;
                } else if (key === "distractions" && pregameQuestions.length > 1) {
                  questionText = pregameQuestions[1].text;
                } else if (key === "mistakeResponse" && pregameQuestions.length > 2) {
                  questionText = pregameQuestions[2].text;
                }
                
                return (
                  <div key={key} className="mb-2">
                    <p className="text-xs text-gray-300">{questionText}:</p>
                    <p className="text-sm">{String(value)}</p>
                  </div>
                );
              });
            })()}
          </div>
          
          {entry.content.postgame && (
            <div className="bg-[#1A1F2C] p-3 rounded mb-3">
              <p className="font-bold mb-2">Post-Game</p>
              
              {/* Display rating if exists */}
              {entry.content.postgame.rating !== undefined && entry.content.postgame.rating !== null && (
                <div className="mb-2">
                  <p className="text-xs text-gray-300">Rating:</p>
                  <p className="text-sm font-bold">{entry.content.postgame.rating}/10</p>
                </div>
              )}
              
              {/* Display external factors */}
              {entry.content.postgame.externalFactors && entry.content.postgame.externalFactors.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs text-gray-300">What external factors kept me from playing my best?</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {entry.content.postgame.externalFactors.map((factor, index) => (
                      <span key={index} className="bg-[#3056b7] text-xs px-2 py-1 rounded">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Display postgame questions with original text - IMPROVED MAPPING */}
              {(() => {
                // Get all enabled postgame questions
                const postgameQuestions = safeGameQuestions.filter(q => 
                  q.section === "postgame" && q.enabled
                );
                
                // Explicitly display all postgame fields
                const postgameFields = [
                  "engagement",
                  "feelingsAboutPlay",
                  "thingsDidWell",
                  "workOnNext",
                  "impactOnDay",
                  "matchupFeelings",
                  "systemFeelings",
                  "playingTimeFeelings"
                ];
                
                return postgameFields.map((field, index) => {
                  if (
                    entry.content.postgame[field] === undefined || 
                    entry.content.postgame[field] === null || 
                    entry.content.postgame[field] === ""
                  ) {
                    return null;
                  }
                  
                  // Get question text from the question list if available
                  let questionText = formatKeyForDisplay(field);
                  if (postgameQuestions.length > index) {
                    questionText = postgameQuestions[index].text;
                  }
                  
                  return (
                    <div key={field} className="mb-2">
                      <p className="text-xs text-gray-300">{questionText}:</p>
                      <p className="text-sm">{String(entry.content.postgame[field])}</p>
                    </div>
                  );
                }).filter(Boolean);
              })()}
            </div>
          )}
          
          {/* Custom questions and notes */}
          {entry.content.customPregameAnswers && Object.keys(entry.content.customPregameAnswers).length > 0 && (
            <div className="bg-[#1A1F2C] p-3 rounded mb-3">
              <p className="font-bold mb-2">Custom Pre-Game Questions</p>
              {Object.entries(entry.content.customPregameAnswers).map(([question, answer]) => (
                <div key={question} className="mb-2">
                  <p className="text-xs text-gray-300">{question}:</p>
                  <p className="text-sm">{String(answer)}</p>
                </div>
              ))}
            </div>
          )}
          
          {entry.content.customPostgameAnswers && Object.keys(entry.content.customPostgameAnswers).length > 0 && (
            <div className="bg-[#1A1F2C] p-3 rounded mb-3">
              <p className="font-bold mb-2">Custom Post-Game Questions</p>
              {Object.entries(entry.content.customPostgameAnswers).map(([question, answer]) => (
                <div key={question} className="mb-2">
                  <p className="text-xs text-gray-300">{question}:</p>
                  <p className="text-sm">{String(answer)}</p>
                </div>
              ))}
            </div>
          )}
          
          {entry.content.notes && (
            <div className="mt-2">
              <p className="text-xs text-gray-300">Additional notes:</p>
              <p className="text-sm bg-[#1A1F2C] p-2 rounded">{entry.content.notes}</p>
            </div>
          )}
          
          <Button 
            variant="link" 
            className="text-blue-300 p-0 h-auto"
            onClick={toggleExpanded}
          >
            Show less
          </Button>
        </>
      )}
    </div>
  );
};

export default GameEntry;
