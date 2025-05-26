
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { JournalEntry } from "./types";
import { supabase } from "@/integrations/supabase/client";

export function useJournalActivities() {
  const [expandedEntries, setExpandedEntries] = useState<{[key: string]: boolean}>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);
  const { user } = useAuth();

  // Toggle expanded state for an entry
  const toggleExpanded = (activityType: string) => {
    setExpandedEntries(prev => ({
      ...prev,
      [activityType]: !prev[activityType]
    }));
  };

  // Function to handle deleting an activity type and all related entries
  const handleDeleteActivity = (activityType: string) => {
    setActivityToDelete(activityType);
    setDeleteDialogOpen(true);
  };

  // Function to confirm and execute deletion - now only from Supabase
  const confirmDelete = async (
    journalEntries: JournalEntry[], 
    setJournalEntries: (entries: JournalEntry[]) => void,
    setActivities: (activities: string[]) => void
  ) => {
    if (!activityToDelete || !user) return;
    
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('type', activityToDelete)
        .eq('user_id', user.id);
        
      if (error) {
        console.error("Error deleting entries from Supabase:", error);
        toast.error("Failed to delete entries");
        return;
      }
      
      // Update local state - filter out deleted activities from the journal entries
      const updatedEntries = journalEntries.filter(entry => entry.type !== activityToDelete);
      setJournalEntries(updatedEntries);
      
      // Update activities list - exclude deleted activity type
      const remainingActivities = updatedEntries.reduce((acc: string[], entry: JournalEntry) => {
        if (!acc.includes(entry.type)) {
          acc.push(entry.type);
        }
        return acc;
      }, []);
      
      setActivities(remainingActivities);
      
      // Reset state and show confirmation
      setActivityToDelete(null);
      setDeleteDialogOpen(false);
      toast.success(`Deleted all ${activityToDelete} journal entries`);
    } catch (error) {
      console.error("Error during deletion:", error);
      toast.error("An error occurred while deleting entries");
    }
  };

  return {
    expandedEntries,
    deleteDialogOpen,
    activityToDelete,
    toggleExpanded,
    handleDeleteActivity,
    confirmDelete,
    setDeleteDialogOpen,
  };
}
