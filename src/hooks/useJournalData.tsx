
import { useJournalActivities } from "./journal/useJournalActivities";
import { useJournalLoader } from "./journal/useJournalLoader";
import { useJournalLocalStorage } from "./journal/useLocalStorage";
import { JournalEntry } from "./journal/types";

export type { JournalEntry, JournalEntryContent, InProgressEntry, Question } from "./journal/types";

export function useJournalData() {
  const {
    journalEntries,
    todayEntries,
    activities,
    inProgressEntries,
    isLoading,
    loadingError,
    loadCompleted,
    setJournalEntries,
    setActivities,
    setInProgressEntries
  } = useJournalLoader();
  
  const {
    expandedEntries,
    deleteDialogOpen,
    activityToDelete,
    toggleExpanded,
    handleDeleteActivity,
    confirmDelete,
    setDeleteDialogOpen
  } = useJournalActivities();
  
  const {
    trainingQuestions,
    rehabQuestions,
    liftQuestions,
    gameQuestions
  } = useJournalLocalStorage();
  
  // Create a wrapper function that passes the necessary state setters
  const handleConfirmDelete = () => {
    confirmDelete(journalEntries, setJournalEntries, setActivities);
  };
  
  return {
    journalEntries,
    todayEntries,
    activities,
    inProgressEntries,
    expandedEntries,
    deleteDialogOpen,
    activityToDelete,
    isLoading, // Ensure we're exposing the isLoading from useJournalLoader
    loadingError,
    loadCompleted,
    trainingQuestions,
    rehabQuestions,
    liftQuestions,
    gameQuestions,
    toggleExpanded,
    handleDeleteActivity,
    confirmDelete: handleConfirmDelete,
    setDeleteDialogOpen
  };
}
