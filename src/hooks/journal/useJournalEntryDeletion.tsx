
import { useCallback } from "react";
import { JournalEntry } from "./types";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export function useJournalEntryDeletion() {
  const { toast } = useToast();

  // Delete journal entry - Now only from Supabase
  const handleDeleteEntry = useCallback(async (entries: JournalEntry[], entryIndex: number, setEntries: (entries: JournalEntry[]) => void) => {
    const entryToDelete = entries[entryIndex];
    
    try {
      // Delete from Supabase if entry has an ID
      if (entryToDelete.user_id && entryToDelete.id) {
        const { error } = await supabase
          .from('journal_entries')
          .delete()
          .eq('id', entryToDelete.id);
          
        if (error) {
          console.error("Error deleting entry from Supabase:", error);
          toast({
            title: "Error",
            description: "Failed to delete the entry from cloud storage.",
            variant: "destructive"
          });
          return;
        }
      } else {
        toast({
          title: "Error",
          description: "This entry cannot be deleted because it doesn't have a valid ID.",
          variant: "destructive"
        });
        return;
      }
      
      // Update the state to remove the deleted entry
      setEntries(entries.filter((_, index) => index !== entryIndex));
      
      // Show a toast notification
      toast({
        title: `${entryToDelete.type} activity deleted`,
        description: "The journal entry has been removed",
        duration: 3000
      });
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast({
        title: "Error",
        description: "Failed to delete the entry",
        variant: "destructive"
      });
    }
  }, [toast]);

  return { handleDeleteEntry };
}
