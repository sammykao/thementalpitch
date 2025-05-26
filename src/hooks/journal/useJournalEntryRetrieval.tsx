
import { useState, useEffect } from "react";
import { JournalEntry } from "./types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useJournalEntryRetrieval(activityType: string) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!activityType) {
      navigate("/journal");
      return;
    }
    
    const loadEntries = async () => {
      setIsLoading(true);
      
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        console.log(`Loading entries for activity type: ${activityType}`);
        
        // Get entries from Supabase
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('type', activityType)
          .eq('user_id', user.id)
          .order('timestamp', { ascending: false });
        
        if (error) {
          console.error("Error fetching entries from Supabase:", error);
          toast.error("Error loading journal entries");
          setIsLoading(false);
          return;
        }
        
        if (!data || data.length === 0) {
          console.log("No entries found for activity type, redirecting to journal");
          navigate("/journal");
          return;
        }
        
        // Process the entries
        const processedEntries = data.map(entry => ({
          ...entry,
          content: typeof entry.content === 'string' ? JSON.parse(entry.content) : entry.content,
          userEmail: user.email
        }));
        
        console.log(`Found ${processedEntries.length} entries for ${activityType}`);
        setEntries(processedEntries);
      } catch (error) {
        console.error("Error loading entries:", error);
        toast.error("Error loading journal entries");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEntries();
  }, [activityType, user, navigate]);

  return { entries, isLoading };
}
