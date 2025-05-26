import { format, parseISO } from "date-fns";
import { JournalEntry, Question } from "@/hooks/useJournalData";

// Format time display - only returns timeOfDay if it exists and is not empty
export const formatTimeDisplay = (timestamp: string, timeOfDay?: string) => {
  if (timeOfDay && timeOfDay.trim()) {
    return timeOfDay;
  }
  
  // Return empty string when no timeOfDay is provided
  return "";
};

// Format a key for display
export const formatKeyForDisplay = (key: string) => {
  return key
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
};

// Get question text from ID - Improved to better handle question retrieval
export const getQuestionTextById = (
  questionId: string, 
  type: string, 
  trainingQuestions: Question[],
  rehabQuestions: Question[],
  liftQuestions: Question[],
  gameQuestions: Question[]
): string => {
  let questionText = questionId;
  let questionList: Question[] = [];
  
  // Normalize activity type to lowercase for case-insensitive comparison
  const activityType = type.toLowerCase();
  
  switch (activityType) {
    case "training":
      questionList = trainingQuestions;
      break;
    case "rehab":
      questionList = rehabQuestions;
      break;
    case "lift":
      questionList = liftQuestions;
      break;
    case "game":
      questionList = gameQuestions;
      break;
    default:
      return formatKeyForDisplay(questionId); // Default to formatting the key if type not matched
  }
  
  // First, try to find exact question by ID
  const question = questionList.find(q => q.id === questionId);
  if (question) {
    return question.text;
  }
  
  // If we didn't find by ID, try to match the formatted key name
  // This helps with older entries that might not have used IDs
  const formattedKey = formatKeyForDisplay(questionId);
  
  // Check if any question text looks similar to our formatted key
  const similarQuestion = questionList.find(q => 
    formatKeyForDisplay(q.id).toLowerCase() === formattedKey.toLowerCase()
  );
  
  if (similarQuestion) {
    return similarQuestion.text;
  }
  
  // If all else fails, just return the formatted key
  return formattedKey;
};

// Get the displayed activity title for an entry
export const getActivityTitle = (entry: JournalEntry) => {
  if (entry.type === "Game" && entry.content.opposingTeam) {
    return `GAME vs ${entry.content.opposingTeam}`;
  }
  
  if (entry.type === "Food" && entry.content.mealType) {
    return `FOOD (${entry.content.mealType})`;
  }
  
  return entry.type;
};
