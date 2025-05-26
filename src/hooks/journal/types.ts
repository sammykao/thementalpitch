
export interface Question {
  id: string;
  text: string;
  type: string;
  section: string;
  enabled: boolean;
}

export interface JournalEntryContent {
  rating?: number | null;
  notes?: string;
  timeOfDay?: string;
  answers?: {
    [key: string]: string;
  };
  // Game specific properties
  opposingTeam?: string;
  pregame?: any;
  postgame?: any;
  customPregameAnswers?: {
    [question: string]: string;
  };
  customPostgameAnswers?: {
    [question: string]: string;
  };
  // Imagery specific properties
  selectedPrompts?: string[];
  customAnswers?: {
    [question: string]: string;
  };
  // Food journal specific properties
  mealType?: string;
  foodItems?: string;
  feelingNotes?: string;
  [key: string]: any;
}

export interface JournalEntry {
  id?: string;
  user_id?: string;
  userEmail?: string;
  type: string;
  date: string;
  timestamp: string;
  content: JournalEntryContent;
}

export interface InProgressEntry {
  id?: string;
  userEmail?: string;
  type: string;
  content: any;
}
