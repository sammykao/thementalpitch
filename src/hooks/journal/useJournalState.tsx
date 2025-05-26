
import { useState } from "react";
import { JournalEntry } from "./types";

export function useJournalState() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [todayEntries, setTodayEntries] = useState<JournalEntry[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [inProgressEntries, setInProgressEntries] = useState<any[]>([]);

  return {
    journalEntries,
    todayEntries,
    activities,
    inProgressEntries,
    setJournalEntries,
    setTodayEntries,
    setActivities,
    setInProgressEntries
  };
}
