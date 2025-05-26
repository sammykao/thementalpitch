
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Question } from "@/hooks/journal/types";
import { PostgameAnswers } from "./types";

interface PostgameReflectionSectionProps {
  enabledPostgameQuestions: Question[];
  postgameQuestionIndex: number;
  postgameAnswers: PostgameAnswers;
  handleAnswerChange: (id: string, value: string) => void;
  handleBack: () => void;
  handleNext: () => void;
  isSaving: boolean;
}

export const PostgameReflectionSection: React.FC<PostgameReflectionSectionProps> = ({
  enabledPostgameQuestions,
  postgameQuestionIndex,
  postgameAnswers,
  handleAnswerChange,
  handleBack,
  handleNext,
  isSaving
}) => {
  if (enabledPostgameQuestions.length === 0) {
    return <p className="text-center">No postgame questions are enabled. Please configure questions in settings.</p>;
  }
  
  // Make sure the index is within bounds
  const safePostgameIndex = Math.min(postgameQuestionIndex, enabledPostgameQuestions.length - 1);
  const postgameQuestion = enabledPostgameQuestions[safePostgameIndex];
  
  if (!postgameQuestion) {
    console.error("No postgame question found at index:", safePostgameIndex);
    return <p className="text-center">Error loading question. Please try again.</p>;
  }
  
  return (
    <div className="w-full space-y-4">
      <div className="mb-4">
        <p className="text-sm mb-2 text-center">{postgameQuestion.text}</p>
        <Textarea 
          className="w-full bg-[#1A1F2C] border border-[#3056b7] rounded-lg p-2 min-h-[150px] text-white"
          value={postgameAnswers[postgameQuestion.id] || ""}
          onChange={(e) => handleAnswerChange(postgameQuestion.id, e.target.value)}
          disabled={isSaving}
        />
      </div>
      
      <div className="w-full flex justify-between items-center mt-6">
        <Button 
          onClick={handleBack}
          className="bg-red-500 hover:bg-red-600 text-white"
          disabled={isSaving}
        >
          ← BACK
        </Button>
        
        <div className="text-sm text-gray-400">
          Question {safePostgameIndex + 1} of {enabledPostgameQuestions.length}
        </div>
        
        <Button 
          onClick={handleNext}
          className="bg-green-500 hover:bg-green-600 text-white"
          disabled={isSaving}
        >
          {safePostgameIndex >= enabledPostgameQuestions.length - 1 ? "NEXT →" : "NEXT →"}
        </Button>
      </div>
    </div>
  );
};
