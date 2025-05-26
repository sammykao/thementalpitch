
import { useState, useEffect } from "react";
import { Question } from "./types";
import { migrateGameQuestions, createVersionedQuestionsData, CURRENT_QUESTIONS_VERSION } from "./useGameQuestionsMigration";

export function useGameQuestions() {
  // Questions from settings
  const [questions, setQuestions] = useState<Question[]>([]);
  const [enabledPregameQuestions, setEnabledPregameQuestions] = useState<Question[]>([]);
  const [enabledPostgameQuestions, setEnabledPostgameQuestions] = useState<Question[]>([]);
  
  // Load questions on mount
  useEffect(() => {
    // Load saved questions from localStorage
    const savedQuestions = localStorage.getItem("gameQuestions");
    if (savedQuestions) {
      try {
        const parsedData = JSON.parse(savedQuestions);
        
        // Run migrations to update questions if needed
        const migratedQuestions = migrateGameQuestions(parsedData);
        
        // Ensure all questions have valid section values
        const validatedQuestions: Question[] = migratedQuestions.map((q: any) => ({
          ...q,
          section: q.section === "pregame" || q.section === "postgame" ? q.section : "postgame",
          type: q.type || "text" // Ensure type property exists
        }));
        
        setQuestions(validatedQuestions);
        
        // Filter enabled questions by section
        setEnabledPregameQuestions(validatedQuestions.filter((q: Question) => q.section === "pregame" && q.enabled));
        setEnabledPostgameQuestions(validatedQuestions.filter((q: Question) => q.section === "postgame" && q.enabled));
        
        // Save the migrated questions back to localStorage with version info
        const versionedData = createVersionedQuestionsData(validatedQuestions);
        localStorage.setItem("gameQuestions", JSON.stringify(versionedData));
        
        console.log("Loaded and migrated questions:", validatedQuestions);
        console.log("Enabled postgame questions:", validatedQuestions.filter((q: Question) => q.section === "postgame" && q.enabled));
      } catch (error) {
        console.error("Error parsing saved questions:", error);
        setDefaultQuestions();
      }
    } else {
      setDefaultQuestions();
    }
  }, []);
  
  // Set default questions function
  const setDefaultQuestions = () => {
    const defaultQuestions: Question[] = [
      { id: "1", text: "What are three things I can control today that will help me perform my best?", enabled: true, section: "pregame", type: "text" },
      { id: "2", text: "What external factors could distract me from playing my best?", enabled: true, section: "pregame", type: "text" },
      { id: "3", text: "How will I respond to mistakes in a way that keeps me focused?", enabled: true, section: "pregame", type: "text" },
      { id: "4", text: "Was I fully engaged in the game? YES or NO", enabled: true, section: "postgame", type: "text" },
      { id: "5", text: "Right now, how do I feel I played?", enabled: true, section: "postgame", type: "text" },
      { id: "6", text: "What are three things I did well?", enabled: true, section: "postgame", type: "text" },
      { id: "7", text: "What's one thing I want to work on based on today's game?", enabled: true, section: "postgame", type: "text" },
      { id: "8", text: "Do I think how I played will affect the rest of my day? What if I played the opposite of how I played?", enabled: true, section: "postgame", type: "text" },
      { id: "9", text: "How did I feel playing against the player I was matched up against?", enabled: true, section: "postgame", type: "text" },
      { id: "10", text: "How'd I feel in my team's system against the system we were up against?", enabled: true, section: "postgame", type: "text" },
      { id: "11", text: "How do I feel about my playing time today? If I don't feel great about it, how can I work with my coaches to change it, without disrespecting their decision?", enabled: true, section: "postgame", type: "text" },
    ];
    
    setQuestions(defaultQuestions);
    setEnabledPregameQuestions(defaultQuestions.filter((q) => q.section === "pregame" && q.enabled));
    setEnabledPostgameQuestions(defaultQuestions.filter((q) => q.section === "postgame" && q.enabled));
    
    // Save default questions to localStorage with version info
    const versionedData = createVersionedQuestionsData(defaultQuestions);
    localStorage.setItem("gameQuestions", JSON.stringify(versionedData));
  };

  return {
    questions,
    enabledPregameQuestions,
    enabledPostgameQuestions,
    setDefaultQuestions
  };
}
