import { useCallback } from "react";
import { Question } from "./types";

export function useJournalLocalStorage() {
  // Keep question storage in localStorage for now - this only loads UI configuration
  const trainingQuestions = (() => {
    try {
      const savedQuestions = localStorage.getItem("trainingQuestions");
      return savedQuestions ? JSON.parse(savedQuestions) as Question[] : [];
    } catch (e) {
      console.error("Error loading training questions:", e);
      return [];
    }
  })();
  
  const rehabQuestions = (() => {
    try {
      const savedQuestions = localStorage.getItem("rehabQuestions");
      return savedQuestions ? JSON.parse(savedQuestions) as Question[] : [];
    } catch (e) {
      console.error("Error loading rehab questions:", e);
      return [];
    }
  })();
  
  const liftQuestions = (() => {
    try {
      const savedQuestions = localStorage.getItem("liftQuestions");
      return savedQuestions ? JSON.parse(savedQuestions) as Question[] : [];
    } catch (e) {
      console.error("Error loading lift questions:", e);
      return [];
    }
  })();
  
  const gameQuestions = (() => {
    try {
      const savedQuestions = localStorage.getItem("gameQuestions");
      return savedQuestions ? JSON.parse(savedQuestions) as Question[] : [];
    } catch (e) {
      console.error("Error loading game questions:", e);
      return [];
    }
  })();

  return {
    trainingQuestions,
    rehabQuestions,
    liftQuestions,
    gameQuestions
  };
}
