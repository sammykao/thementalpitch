
import React from "react";
import { Question, JournalEntry } from "@/hooks/useJournalData";
import { formatKeyForDisplay, getQuestionTextById } from "./JournalEntryUtils";

interface GameEntryContentProps {
  entry: JournalEntry;
  gameQuestions: Question[];
}

const GameEntryContent: React.FC<GameEntryContentProps> = ({ 
  entry, 
  gameQuestions 
}) => {
  // Function to display pregame content
  const displayPregameContent = () => {
    if (!entry.content.pregame) return null;
    
    return (
      <div className="mb-6">
        <h3 className="font-bold mb-2 text-yellow-400">Pregame</h3>
        {/* Display pregame content */}
        {Object.entries(entry.content.pregame)
          .filter(([key, value]) => 
            value !== undefined && 
            value !== null && 
            value !== "" && 
            typeof value !== 'object' && 
            key !== 'timestamp'
          )
          .map(([key, value]) => {
            // Format the key for display
            const formattedKey = formatKeyForDisplay(key);
            
            return (
              <div key={`pregame-${key}`} className="mb-3">
                <p className="text-sm font-medium text-gray-300">{formattedKey}:</p>
                <p className="bg-[#1A1F2C] p-2 rounded">{String(value)}</p>
              </div>
            );
          })}
          
        {/* Display pregame answers if they exist */}
        {entry.content.pregame.answers && Object.keys(entry.content.pregame.answers).length > 0 && (
          <div className="mt-2">
            {Object.entries(entry.content.pregame.answers).map(([questionId, answer]) => {
              if (!answer) return null;
              
              // Get the original question text
              const questionText = getQuestionTextById(
                questionId, 
                "Game", 
                [], 
                [], 
                [], 
                gameQuestions || []
              );
              
              return (
                <div key={`pregame-answer-${questionId}`} className="mb-3">
                  <p className="text-sm font-medium text-gray-300">{questionText || formatKeyForDisplay(questionId)}:</p>
                  <p className="bg-[#1A1F2C] p-2 rounded">{String(answer)}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };
  
  // Function to display postgame content
  const displayPostgameContent = () => {
    if (!entry.content.postgame) return null;
    
    return (
      <div className="mb-6">
        <h3 className="font-bold mb-2 text-green-400">Postgame</h3>
        {/* Display postgame content */}
        {Object.entries(entry.content.postgame)
          .filter(([key, value]) => 
            value !== undefined && 
            value !== null && 
            value !== "" && 
            typeof value !== 'object' && 
            key !== 'timestamp'
          )
          .map(([key, value]) => {
            // Format the key for display
            const formattedKey = formatKeyForDisplay(key);
            
            return (
              <div key={`postgame-${key}`} className="mb-3">
                <p className="text-sm font-medium text-gray-300">{formattedKey}:</p>
                <p className="bg-[#1A1F2C] p-2 rounded">{String(value)}</p>
              </div>
            );
          })}
          
        {/* Display postgame answers if they exist */}
        {entry.content.postgame.answers && Object.keys(entry.content.postgame.answers).length > 0 && (
          <div className="mt-2">
            {Object.entries(entry.content.postgame.answers).map(([questionId, answer]) => {
              if (!answer) return null;
              
              // Get the original question text
              const questionText = getQuestionTextById(
                questionId, 
                "Game", 
                [], 
                [], 
                [], 
                gameQuestions || []
              );
              
              return (
                <div key={`postgame-answer-${questionId}`} className="mb-3">
                  <p className="text-sm font-medium text-gray-300">{questionText || formatKeyForDisplay(questionId)}:</p>
                  <p className="bg-[#1A1F2C] p-2 rounded">{String(answer)}</p>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Display rating if exists */}
        {entry.content.postgame.rating !== undefined && entry.content.postgame.rating !== null && (
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-300">Performance Rating:</p>
            <p className="bg-[#1A1F2C] p-2 rounded font-bold">{entry.content.postgame.rating}/10</p>
          </div>
        )}
        
        {/* Display notes if exists */}
        {entry.content.postgame.notes && (
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-300">Postgame Notes:</p>
            <p className="bg-[#1A1F2C] p-2 rounded">{entry.content.postgame.notes}</p>
          </div>
        )}
      </div>
    );
  };
  
  // If the entry has pregame/postgame structure
  if (entry.content.pregame || entry.content.postgame) {
    return (
      <div className="space-y-2">
        {/* General game info */}
        <div className="mb-3">
          {entry.content.opposingTeam && (
            <div className="bg-[#1A1F2C] p-2 rounded mb-2">
              <span className="font-bold">Opposing Team:</span> {entry.content.opposingTeam}
            </div>
          )}
        </div>
        
        {/* Pregame and Postgame sections */}
        {displayPregameContent()}
        {displayPostgameContent()}
      </div>
    );
  } else {
    // Regular content structure (not pregame/postgame)
    return (
      <div className="space-y-3">
        {/* Display answers if they exist */}
        {entry.content.answers && Object.keys(entry.content.answers).length > 0 && (
          <div className="space-y-3">
            {Object.entries(entry.content.answers).map(([questionId, answer]) => {
              if (!answer) return null;
              
              // Get the original question text
              const questionText = getQuestionTextById(
                questionId, 
                "Game", 
                [], 
                [], 
                [], 
                gameQuestions || []
              );
              
              return (
                <div key={questionId}>
                  <p className="text-sm font-medium text-gray-300">{questionText || formatKeyForDisplay(questionId)}:</p>
                  <p className="bg-[#1A1F2C] p-2 rounded">{String(answer)}</p>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Display general content for older entries */}
        {Object.entries(entry.content)
          .filter(([key, value]) => 
            value !== undefined && 
            value !== null && 
            value !== "" && 
            typeof value !== 'object' && 
            key !== 'answers'
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

export default GameEntryContent;
