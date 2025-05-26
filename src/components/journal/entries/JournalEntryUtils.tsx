import { format, parseISO } from "date-fns";

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

// Get question text from ID - Improved to handle all question types better
export const getQuestionTextById = (
  questionId: string, 
  type: string, 
  trainingQuestions: any[],
  rehabQuestions: any[],
  liftQuestions: any[],
  gameQuestions: any[]
): string => {
  // Normalize questionId and activity type to lowercase for case-insensitive comparison
  const normalizedQuestionId = questionId.toLowerCase();
  const normalizedType = type.toLowerCase();
  
  // Select the appropriate question list based on type
  let questionList: any[] = [];
  
  switch (normalizedType) {
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
      console.log(`Unknown entry type: ${type}`);
      return formatKeyForDisplay(questionId);
  }
  
  // First, try to find exact question by ID
  const exactMatch = questionList.find(q => 
    q.id && q.id.toLowerCase() === normalizedQuestionId
  );
  
  if (exactMatch) {
    return exactMatch.text;
  }
  
  // Try to match by text
  const textMatch = questionList.find(q => 
    q.text && q.text.toLowerCase() === normalizedQuestionId
  );
  
  if (textMatch) {
    return textMatch.text;
  }
  
  // If no exact match found, try to find question with similar ID
  // This helps with older entries that might have used different ID formats
  const similarQuestion = questionList.find(q => 
    q.id && (
      normalizedQuestionId.includes(q.id.toLowerCase()) ||
      q.id.toLowerCase().includes(normalizedQuestionId)
    )
  );
  
  if (similarQuestion) {
    return similarQuestion.text;
  }
  
  // If still no match, check if the question ID itself looks like a question
  if (questionId.includes('?')) {
    return questionId; // It's likely already a question text
  }
  
  // As a final fallback, return the formatted key
  return formatKeyForDisplay(questionId);
};
