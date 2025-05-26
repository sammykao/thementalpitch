
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { format } from "date-fns";
import { useToast } from "./use-toast";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useJournalForm = (journalType: string, initialValues = {}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const currentDate = new Date();
  
  // Form state
  const [formValues, setFormValues] = useState({
    ...initialValues,
    timeOfDay: "", // Add timeOfDay field but don't require it
  });
  
  // Loading state
  const [isSaving, setIsSaving] = useState(false);
  
  // Handle changes to form fields
  const handleChange = (field: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  // Save the journal entry
  const saveJournal = async (additionalData = {}) => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "You need to be logged in to save journal entries.",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Create the entry object with proper user_id field
      const entry = {
        type: journalType,
        date: format(currentDate, "MMMM d, yyyy"),
        timestamp: new Date().toISOString(),
        user_id: user.id,
        content: {
          ...formValues,
          timeOfDay: formValues.timeOfDay?.trim() || undefined, // Only include if not empty
          ...additionalData,
        },
      };
      
      console.log("Saving journal entry:", entry);
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('journal_entries')
        .insert([entry])
        .select(); // Add select() to get the returned data with the generated ID
        
      if (error) {
        console.error("Error saving journal entry to Supabase:", error);
        toast({
          title: "Error saving journal",
          description: "There was a problem saving your journal entry to the cloud.",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }
      
      // Show success message
      toast({
        title: "Journal saved",
        description: `Your ${journalType} journal entry has been saved.`,
      });
      
      // Navigate back to the journal page
      navigate("/journal");
    } catch (error) {
      console.error("Error saving journal:", error);
      toast({
        title: "Error saving journal",
        description: "There was a problem saving your journal entry.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return {
    formValues,
    handleChange,
    saveJournal,
    isSaving,
  };
};
