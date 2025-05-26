
import { useState, useEffect } from "react";
import { Question } from "./types";
import { migrateGameQuestions, createVersionedQuestionsData } from "./useGameQuestionsMigration";

export function useQuestionLoader(activityType: string) {
  const [trainingQuestions, setTrainingQuestions] = useState<Question[]>([]);
  const [rehabQuestions, setRehabQuestions] = useState<Question[]>([]);
  const [liftQuestions, setLiftQuestions] = useState<Question[]>([]);
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  
  // Load questions for the activity type or all types
  useEffect(() => {
    try {
      // If "all" is specified, or any specific type, load the appropriate questions
      if (activityType === "all" || activityType === "Training") {
        const savedTrainingQuestions = localStorage.getItem("trainingQuestions");
        if (savedTrainingQuestions) {
          setTrainingQuestions(JSON.parse(savedTrainingQuestions));
        }
      }
      
      if (activityType === "all" || activityType === "Rehab") {
        const savedRehabQuestions = localStorage.getItem("rehabQuestions");
        if (savedRehabQuestions) {
          setRehabQuestions(JSON.parse(savedRehabQuestions));
        }
      }
      
      if (activityType === "all" || activityType === "Lift") {
        const savedLiftQuestions = localStorage.getItem("liftQuestions");
        if (savedLiftQuestions) {
          setLiftQuestions(JSON.parse(savedLiftQuestions));
        }
      }
      
      if (activityType === "all" || activityType === "Game") {
        const savedGameQuestions = localStorage.getItem("gameQuestions");
        if (savedGameQuestions) {
          const parsedData = JSON.parse(savedGameQuestions);
          
          // Run migrations to update questions if needed (same logic as useGameQuestions)
          const migratedQuestions = migrateGameQuestions(parsedData);
          
          // Ensure all questions have valid section values
          const validatedQuestions: Question[] = migratedQuestions.map((q: any) => ({
            ...q,
            section: q.section === "pregame" || q.section === "postgame" ? q.section : "postgame",
            type: q.type || "text"
          }));
          
          setGameQuestions(validatedQuestions);
          
          // Save the migrated questions back to localStorage with version info
          const versionedData = createVersionedQuestionsData(validatedQuestions);
          localStorage.setItem("gameQuestions", JSON.stringify(versionedData));
        }
      }
    } catch (e) {
      console.error("Error loading questions:", e);
    }
  }, [activityType]);

  return {
    trainingQuestions,
    rehabQuestions,
    liftQuestions,
    gameQuestions
  };
}
