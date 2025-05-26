
import { Question } from "@/hooks/journal/types";

export type JournalMode = "selection" | "pregame" | "postgame-factors" | "postgame-reflection" | "postgame-rating" | "postgame-notes";
export type GamePhase = "pregame" | "postgame";

export interface ExternalFactor {
  name: string;
  selected: boolean;
}

export interface PregameAnswers {
  [key: string]: string;
}

export interface PostgameAnswers {
  [key: string]: string;
}

export interface InProgressEntry {
  phase: string;
  answers: PregameAnswers;
  opposingTeam?: string;
  timeOfDay?: string;
}

export interface PregameContent {
  controlFactors: string;
  distractions: string;
  mistakeResponse: string;
  [key: string]: string;
}

export interface PostgameContent {
  externalFactors?: string[];
  engagement?: string;
  feelingsAboutPlay?: string;
  thingsDidWell?: string;
  workOnNext?: string;
  impactOnDay?: string;
  matchupFeelings?: string;
  systemFeelings?: string;
  playingTimeFeelings?: string;
  rating?: number | null;
  [key: string]: any;
}

export interface GameJournalContent {
  pregame?: PregameContent;
  postgame?: PostgameContent;
  notes?: string;
  timeOfDay?: string;
  opposingTeam?: string;
  [key: string]: any;
}
