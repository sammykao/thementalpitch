
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Question } from "@/hooks/journal/types";
import { PregameAnswers } from "./types";
import TimeOfDayField from "@/components/TimeOfDayField";

interface PregameSectionProps {
  enabledPregameQuestions: Question[];
  pregameQuestionIndex: number;
  pregameAnswers: PregameAnswers;
  timeOfDay: string;
  opposingTeam: string;
  setTimeOfDay: (time: string) => void;
  setOpposingTeam: (team: string) => void;
  handleAnswerChange: (id: string, value: string) => void;
  handleBack: () => void;
  handleNext: () => void;
  isSaving: boolean;
}

export const PregameSection: React.FC<PregameSectionProps> = ({
  enabledPregameQuestions,
  pregameQuestionIndex,
  pregameAnswers,
  timeOfDay,
  opposingTeam,
  setTimeOfDay,
  setOpposingTeam,
  handleAnswerChange,
  handleBack,
  handleNext,
  isSaving
}) => {
  if (enabledPregameQuestions.length === 0) {
    return <p className="text-center">No pregame questions are enabled. Please configure questions in settings.</p>;
  }

  const pregameQuestion = enabledPregameQuestions[pregameQuestionIndex];
  
  // First question view with TimeOfDay and Team fields
  if (pregameQuestionIndex === 0) {
    return (
      <div className="w-full space-y-4">
        <TimeOfDayField value={timeOfDay} onChange={setTimeOfDay} required={false} />
        
        <div className="mb-4">
          <label htmlFor="opposing-team" className="block text-sm font-medium mb-2 text-center">
            Which team are you playing against today?
          </label>
          <Input
            id="opposing-team"
            className="w-full bg-[#1A1F2C] border border-[#3056b7] rounded-lg p-2 text-white"
            placeholder="Enter opposing team name"
            value={opposingTeam}
            onChange={(e) => setOpposingTeam(e.target.value)}
            disabled={isSaving}
          />
        </div>
        
        <div className="mb-4">
          <p className="text-sm mb-2 text-center">{pregameQuestion.text}</p>
          <Textarea 
            className="w-full bg-[#1A1F2C] border border-[#3056b7] rounded-lg p-2 min-h-[150px] text-white"
            value={pregameAnswers[pregameQuestion.id] || ""}
            onChange={(e) => handleAnswerChange(pregameQuestion.id, e.target.value)}
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
            Question {pregameQuestionIndex + 1} of {enabledPregameQuestions.length}
          </div>
          
          <Button 
            onClick={handleNext}
            className="bg-green-500 hover:bg-green-600 text-white"
            disabled={isSaving}
          >
            NEXT →
          </Button>
        </div>
      </div>
    );
  }

  // Regular question view for subsequent questions
  return (
    <div className="w-full space-y-4">
      <div className="mb-4">
        <p className="text-sm mb-2 text-center">{pregameQuestion.text}</p>
        <Textarea 
          className="w-full bg-[#1A1F2C] border border-[#3056b7] rounded-lg p-2 min-h-[150px] text-white"
          value={pregameAnswers[pregameQuestion.id] || ""}
          onChange={(e) => handleAnswerChange(pregameQuestion.id, e.target.value)}
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
          Question {pregameQuestionIndex + 1} of {enabledPregameQuestions.length}
        </div>
        
        <Button 
          onClick={handleNext}
          className="bg-green-500 hover:bg-green-600 text-white"
          disabled={isSaving}
        >
          {pregameQuestionIndex === enabledPregameQuestions.length - 1 ? "DONE →" : "NEXT →"}
        </Button>
      </div>
    </div>
  );
};
