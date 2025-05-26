
import { useState, useEffect } from "react";
import { useJournalEntryRetrieval } from "./useJournalEntryRetrieval";
import { useQuestionLoader } from "./useQuestionLoader";

export function useJournalEntriesLoader(activityType: string) {
  // Use the entry retrieval hook - returns all entries for the activity type
  const { entries, isLoading } = useJournalEntryRetrieval(activityType);
  
  // Use the question loader hook to load questions for ALL activity types
  // This ensures we have questions available no matter what type of entry we're viewing
  const {
    trainingQuestions,
    rehabQuestions,
    liftQuestions,
    gameQuestions
  } = useQuestionLoader("all");
  
  // Log the number of questions loaded for debugging
  useEffect(() => {
    console.log({
      trainingQuestionsCount: trainingQuestions.length,
      rehabQuestionsCount: rehabQuestions.length,
      liftQuestionsCount: liftQuestions.length,
      gameQuestionsCount: gameQuestions.length
    });
  }, [trainingQuestions, rehabQuestions, liftQuestions, gameQuestions]);

  return {
    entries, // All entries for the activity type, not just the most recent one
    trainingQuestions,
    rehabQuestions,
    liftQuestions,
    gameQuestions,
    isLoading
  };
}
