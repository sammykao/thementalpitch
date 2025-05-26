import { useState } from "react";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";

export interface JournalEntryContent {
  flowState?: string;
  weakness?: string;
  playOfTheDay?: string;
  rating?: number | string | null;
  notes?: string;
  timeOfDay?: string;
  pregame?: {
    controlFactors?: string;
    distractions?: string;
    mistakeResponse?: string;
    [key: string]: any;
  };
  postgame?: {
    externalFactors?: string[];
    engagement?: string;
    feelingsAboutPlay?: string;
    impactOnDay?: string;
    rating?: number | null;
    [key: string]: any;
  };
  rehabPerformance?: string;
  morningRoutine?: string;
  stretchingTime?: string;
  motivationBefore?: string;
  feelingAfter?: string;
  bodyFeelAfter?: string;
  happyLifted?: string;
  selectedPrompts?: string[];
  answers?: {[key: string]: string};
  customPregameAnswers?: {[key: string]: string};
  customPostgameAnswers?: {[key: string]: string};
  customAnswers?: {[key: string]: string};
  [key: string]: any;
}

interface Question {
  id: string;
  text: string;
  enabled: boolean;
  section?: "pregame" | "postgame" | string;
  isCustom?: boolean;
}

export interface JournalEntry {
  type: string;
  date: string;
  timestamp: string;
  user_id?: string;
  content: JournalEntryContent;
  userEmail?: string;
}

interface JournalEntryPreviewProps {
  entry: JournalEntry;
  isExpanded: boolean;
  onToggleExpand: () => void;
  gameQuestions: Question[];
}

// Format time display - updated to use timeOfDay if available
const formatTimeDisplay = (timestamp: string, timeOfDay?: string) => {
  if (timeOfDay) {
    return timeOfDay;
  }
  
  try {
    const date = parseISO(timestamp);
    return format(date, "h:mm a");
  } catch (error) {
    return "";
  }
};

// Format a key for display
const formatKeyForDisplay = (key: string) => {
  return key
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
};

export const JournalEntryPreview = ({ 
  entry, 
  isExpanded, 
  onToggleExpand,
  gameQuestions
}: JournalEntryPreviewProps) => {
  
  // Function to render a preview of journal entry content
  const renderJournalPreview = () => {
    // Only show rating when collapsed
    if (!isExpanded) {
      // Check for rating first as it's a common display item
      if (entry.content.rating !== undefined && entry.content.rating !== null) {
        return (
          <div className="mb-2">
            <span className="text-xs text-gray-300">Rating:</span>
            <p className="font-bold">{String(entry.content.rating)}/10</p>
          </div>
        );
      } else if (entry.content.postgame?.rating !== undefined && entry.content.postgame?.rating !== null) {
        return (
          <div className="mb-2">
            <span className="text-xs text-gray-300">Rating:</span>
            <p className="font-bold">{String(entry.content.postgame.rating)}/10</p>
          </div>
        );
      } else {
        return (
          <div className="mb-2">
            <span className="text-gray-400">Click "Show more" to see details</span>
          </div>
        );
      }
    }

    // If expanded, show all questions and answers
    switch (entry.type) {
      case "Game":
        return renderGameJournalPreview();
      case "Training":
      case "Rehab":
      case "Lift":
        return renderStandardJournalPreview();
      case "Imagery":
        return renderImageryJournalPreview();
      default:
        return renderDefaultJournalPreview();
    }
  };

  const renderGameJournalPreview = () => {
    return (
      <>
        {/* Display pregame questions and answers */}
        {entry.content.pregame && (
          <div className="mb-3">
            <p className="font-bold mb-1">Pre-Game</p>
            
            {/* Display pregame questions with original text */}
            {(() => {
              const pregameQuestions = gameQuestions.filter(q => 
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
                    <p className="text-sm bg-[#1A1F2C] p-2 rounded">{String(value)}</p>
                  </div>
                );
              });
            })()}
          </div>
        )}
        
        {/* Display postgame questions and answers */}
        {entry.content.postgame && (
          <div className="mb-3">
            <p className="font-bold mb-1">Post-Game</p>
            
            {/* Display rating if it exists */}
            {entry.content.postgame.rating !== undefined && entry.content.postgame.rating !== null && (
              <div className="mb-2">
                <p className="text-xs text-gray-300">Rating:</p>
                <p className="text-sm font-bold">{entry.content.postgame.rating}/10</p>
              </div>
            )}
            
            {/* Display external factors if they exist */}
            {entry.content.postgame.externalFactors && entry.content.postgame.externalFactors.length > 0 && (
              <div className="mb-2">
                <p className="text-xs text-gray-300">What external factors kept me from playing my best?</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {entry.content.postgame.externalFactors.map((factor: string, index: number) => (
                    <span key={index} className="bg-[#3056b7] text-xs px-2 py-1 rounded">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Display postgame questions with original text */}
            {(() => {
              const postgameQuestions = gameQuestions.filter(q => 
                q.section === "postgame" && q.enabled
              );
              
              // Updated map of key names to their index positions in standard questions
              const keyToIndexMap: {[key: string]: number} = {
                "engagement": 0,
                "feelingsAboutPlay": 1,
                "thingsDidWell": 2,
                "workOnNext": 3,
                "impactOnDay": 4,
                "matchupFeelings": 5,
                "systemFeelings": 6,
                "playingTimeFeelings": 7
              };
              
              // Display each postgame question with its answer
              return Object.entries(entry.content.postgame)
                .filter(([key, value]) => 
                  key !== 'externalFactors' && 
                  key !== 'rating' &&
                  value !== undefined && 
                  value !== null && 
                  value !== ""
                )
                .map(([key, value]) => {
                  // Find the original question text
                  let questionText = formatKeyForDisplay(key);
                  
                  // Use the index map to find the correct question text
                  const index = keyToIndexMap[key];
                  if (index !== undefined && postgameQuestions.length > index) {
                    questionText = postgameQuestions[index].text;
                  }
                  
                  return (
                    <div key={key} className="mb-2">
                      <p className="text-xs text-gray-300">{questionText}:</p>
                      <p className="text-sm bg-[#1A1F2C] p-2 rounded">{String(value)}</p>
                    </div>
                  );
                });
            })()}
          </div>
        )}
        
        {/* Display custom pregame questions if any */}
        {entry.content.customPregameAnswers && Object.keys(entry.content.customPregameAnswers).length > 0 && (
          <div className="mb-3">
            <p className="font-bold mb-1">Custom Pre-Game Questions</p>
            {Object.entries(entry.content.customPregameAnswers).map(([question, answer]) => (
              <div key={question} className="mb-2">
                <p className="text-xs text-gray-300">{question}:</p>
                <p className="text-sm bg-[#1A1F2C] p-2 rounded">{String(answer)}</p>
              </div>
            ))}
          </div>
        )}
        
        {/* Display custom postgame questions if any */}
        {entry.content.customPostgameAnswers && Object.keys(entry.content.customPostgameAnswers).length > 0 && (
          <div className="mb-3">
            <p className="font-bold mb-1">Custom Post-Game Questions</p>
            {Object.entries(entry.content.customPostgameAnswers).map(([question, answer]) => (
              <div key={question} className="mb-2">
                <p className="text-xs text-gray-300">{question}:</p>
                <p className="text-sm bg-[#1A1F2C] p-2 rounded">{String(answer)}</p>
              </div>
            ))}
          </div>
        )}
        
        {/* Display notes if they exist */}
        {entry.content.notes && (
          <div>
            <p className="text-xs text-gray-300">Additional notes:</p>
            <p className="text-sm bg-[#1A1F2C] p-2 rounded">{String(entry.content.notes)}</p>
          </div>
        )}
      </>
    );
  };

  const renderStandardJournalPreview = () => {
    // Display answers object if it exists
    if (entry.content.answers && Object.keys(entry.content.answers).length > 0) {
      return (
        <div className="space-y-3">
          {/* Display all answers */}
          {Object.entries(entry.content.answers).map(([questionId, answer]) => {
            if (!answer) return null;
            
            // Format question text from ID
            const questionText = formatKeyForDisplay(questionId);
            
            return (
              <div key={questionId}>
                <p className="text-sm font-medium text-gray-300">{questionText}:</p>
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
          {/* Display rating if exists */}
          {entry.content.rating !== undefined && entry.content.rating !== null && (
            <div>
              <p className="text-sm font-medium text-gray-300">Rating:</p>
              <p className="bg-[#1A1F2C] p-2 rounded font-bold">{String(entry.content.rating)}/10</p>
            </div>
          )}
          
          {/* Display all other content fields */}
          {Object.entries(entry.content || {})
            .filter(([key, value]) => 
              key !== 'rating' && 
              value !== undefined && 
              value !== null && 
              value !== "" &&
              typeof value !== 'object'
            )
            .map(([key, value]) => {
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

  const renderImageryJournalPreview = () => {
    return (
      <div className="space-y-3">
        {/* Display rating if exists */}
        {entry.content.rating !== undefined && entry.content.rating !== null && (
          <div>
            <p className="text-sm font-medium text-gray-300">Rating:</p>
            <p className="bg-[#1A1F2C] p-2 rounded font-bold">{entry.content.rating}/10</p>
          </div>
        )}
        
        {/* Display selected prompts if they exist */}
        {entry.content.selectedPrompts && entry.content.selectedPrompts.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-300">Selected prompts:</p>
            <div className="space-y-2 mt-1">
              {entry.content.selectedPrompts.map((prompt, index) => (
                <p key={index} className="text-sm bg-[#1A1F2C] p-2 rounded">
                  "{prompt}"
                </p>
              ))}
            </div>
          </div>
        )}
        
        {/* Display custom imagery questions if any */}
        {entry.content.customAnswers && Object.keys(entry.content.customAnswers).length > 0 && (
          <div className="mt-2">
            <p className="font-bold mb-1">Custom Questions</p>
            {Object.entries(entry.content.customAnswers).map(([question, answer]) => (
              <div key={question} className="mb-2">
                <p className="text-xs text-gray-300">{question}:</p>
                <p className="text-sm bg-[#1A1F2C] p-2 rounded">{String(answer)}</p>
              </div>
            ))}
          </div>
        )}
        
        {/* Display all other content fields */}
        {Object.entries(entry.content || {})
          .filter(([key, value]) => 
            key !== 'rating' && 
            key !== 'selectedPrompts' && 
            key !== 'customAnswers' &&
            value !== undefined && 
            value !== null && 
            value !== "" &&
            typeof value !== 'object'
          )
          .map(([key, value]) => {
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
  };

  const renderDefaultJournalPreview = () => {
    return (
      <>
        {/* Display rating if exists */}
        {entry.content.rating !== undefined && entry.content.rating !== null && (
          <div>
            <p className="text-sm font-medium text-gray-300">Rating:</p>
            <p className="bg-[#1A1F2C] p-2 rounded font-bold">{String(entry.content.rating)}/10</p>
          </div>
        )}
        
        {/* Display all other content fields */}
        {Object.entries(entry.content || {})
          .filter(([key, value]) => 
            key !== 'rating' && 
            value !== undefined && 
            value !== null && 
            value !== "" &&
            typeof value !== 'object'
          )
          .map(([key, value]) => {
            const formattedKey = formatKeyForDisplay(key);
            
            return (
              <div key={key}>
                <p className="text-sm font-medium text-gray-300">{formattedKey}:</p>
                <p className="bg-[#1A1F2C] p-2 rounded">{String(value)}</p>
              </div>
            );
          })}
      </>
    );
  };

  const timeDisplay = formatTimeDisplay(entry.timestamp, entry.content.timeOfDay);

  return (
    <div className="bg-[#1A1F2C] rounded-lg p-3 mt-2 text-sm">
      <div className="text-gray-300 mb-1 flex items-center justify-between">
        <span>
          {entry.date}
          {timeDisplay && <span className="text-blue-300 ml-1">at {timeDisplay}</span>}
        </span>
        <Button 
          variant="link" 
          className="text-blue-300 p-0 h-auto"
          onClick={onToggleExpand}
        >
          {isExpanded ? "Show less" : "Show more"}
        </Button>
      </div>
      {renderJournalPreview()}
    </div>
  );
};

export default JournalEntryPreview;
