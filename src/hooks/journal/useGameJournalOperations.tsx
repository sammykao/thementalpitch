import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PregameAnswers, PostgameAnswers, ExternalFactor, InProgressEntry, GameJournalContent, PregameContent } from "@/components/journal/game/types";

export function useGameJournalOperations() {
  const navigate = useNavigate();
  const today = format(new Date(), "MMMM d");
  const { user } = useAuth();
  
  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  
  // Check for in-progress entry
  const checkForInProgressEntry = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'Game')
        .eq('date', today)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();
        
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        console.error("Error checking for in-progress game entry:", error);
        return null;
      }
      
      // If we found a game entry for today that has pregame data but no postgame data
      if (data && data.content && 
          typeof data.content === 'object' && 
          'pregame' in data.content && 
          !('postgame' in data.content)) {
        // This is an in-progress entry (pregame completed, postgame not yet done)
        const content = data.content as GameJournalContent;
        const inProgressData: InProgressEntry = {
          phase: "pregame",
          answers: {
            "1": content.pregame?.controlFactors || "",
            "2": content.pregame?.distractions || "",
            "3": content.pregame?.mistakeResponse || ""
          },
          opposingTeam: content.opposingTeam || "",
          timeOfDay: content.timeOfDay || ""
        };
        
        return inProgressData;
      }
      
      return null;
    } catch (err) {
      console.error("Error checking for in-progress entry:", err);
      return null;
    }
  };
  
  // Save pregame entry function
  const savePregameEntry = async (
    pregameAnswers: PregameAnswers,
    timeOfDay: string,
    opposingTeam: string
  ) => {
    if (!user) {
      toast.error("You must be logged in to save entries");
      return false;
    }
    
    // Remove the timeOfDay validation - it's now optional
    
    setIsSaving(true);
    
    try {
      // Format the pregame data
      const pregameContent: PregameContent = {
        controlFactors: pregameAnswers["1"] || "",
        distractions: pregameAnswers["2"] || "",
        mistakeResponse: pregameAnswers["3"] || ""
      };
      
      // Create consistent timestamp with noon UTC time 
      // to ensure it's on the correct day regardless of timezone
      const todayFormatted = format(new Date(), "yyyy-MM-dd") + "T12:00:00Z";
      
      const journalEntry = {
        type: "Game",
        date: today,
        timestamp: todayFormatted,
        user_id: user.id,
        content: {
          pregame: pregameContent,
          timeOfDay: timeOfDay?.trim() || undefined, // Only include if not empty
          opposingTeam: opposingTeam
        }
      };
      
      // Save to Supabase
      const { error } = await supabase
        .from('journal_entries')
        .insert(journalEntry);
      
      if (error) {
        console.error("Error saving pregame entry to Supabase:", error);
        toast.error("Failed to save entry. Please try again.");
        return false;
      }
      
      toast.success("Pregame journal entry saved!");
      navigate("/journal");
      return true;
    } catch (err) {
      console.error("Error saving pregame journal:", err);
      toast.error("An unexpected error occurred. Please try again.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  // Save complete game entry
  const saveCompleteGameEntry = async (
    pregameAnswers: PregameAnswers,
    postgameAnswers: PostgameAnswers,
    externalFactors: ExternalFactor[],
    rating: number | null,
    notes: string,
    timeOfDay: string,
    opposingTeam: string,
    entryDate?: string // New parameter to support completing existing entries
  ) => {
    if (!user) {
      toast.error("You must be logged in to save entries");
      return false;
    }
    
    setIsSaving(true);
    
    try {
      // Use the provided entryDate or default to today
      const dateToUse = entryDate || today;
      
      // First, check if there's an existing pregame entry for the given date
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'Game')
        .eq('date', dateToUse)
        .order('timestamp', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error("Error fetching pregame entry:", error);
        toast.error("Failed to fetch pregame data. Please try again.");
        return false;
      }
      
      let pregameContent: PregameContent = {
        controlFactors: "",
        distractions: "",
        mistakeResponse: ""
      };
      
      let existingTimeOfDay = "";
      let existingOpposingTeam = "";
      let existingEntryId: string | null = null;
      
      // If we found a pregame entry, use its data
      if (data && data.length > 0 && data[0].content && 
          typeof data[0].content === 'object' && 
          'pregame' in data[0].content) {
        existingEntryId = data[0].id;
        const content = data[0].content as GameJournalContent;
        if (content.pregame) {
          pregameContent = {
            controlFactors: content.pregame.controlFactors || "",
            distractions: content.pregame.distractions || "",
            mistakeResponse: content.pregame.mistakeResponse || ""
          };
        }
        existingTimeOfDay = content.timeOfDay || "";
        existingOpposingTeam = content.opposingTeam || "";
      }
      
      // Create consistent timestamp with noon UTC time
      const todayFormatted = format(new Date(), "yyyy-MM-dd") + "T12:00:00Z";
      
      // Format the postgame content separately first to handle the rating
      const postgameContent = {
        externalFactors: externalFactors.filter(factor => factor.selected).map(factor => factor.name),
        engagement: postgameAnswers["4"] || "",
        feelingsAboutPlay: postgameAnswers["5"] || "",
        thingsDidWell: postgameAnswers["6"] || "",
        workOnNext: postgameAnswers["7"] || "",
        impactOnDay: postgameAnswers["8"] || "",
        matchupFeelings: postgameAnswers["9"] || "",
        systemFeelings: postgameAnswers["10"] || "",
        playingTimeFeelings: postgameAnswers["11"] || "",
        rating: rating  // Fix: Add rating directly to postgameContent
      };
      
      // Format the complete game entry
      const gameJournalContent = {
        pregame: pregameContent,
        postgame: postgameContent,
        notes: notes,
        timeOfDay: (timeOfDay?.trim() || existingTimeOfDay?.trim()) || undefined, // Only include if not empty
        opposingTeam: opposingTeam || existingOpposingTeam,
        date: dateToUse // Store the date to make it easier to retrieve later
      };
      
      let saveError;
      
      // If we have an existing entry, update it rather than creating a new one
      if (existingEntryId) {
        console.log("Updating existing entry:", existingEntryId);
        const { error: updateError } = await supabase
          .from('journal_entries')
          .update({ content: gameJournalContent })
          .eq('id', existingEntryId);
        
        saveError = updateError;
      } else {
        // If we don't have an existing entry, create a new one
        console.log("Creating new complete entry");
        const gameJournalEntry = {
          type: "Game",
          date: dateToUse,
          timestamp: todayFormatted,
          user_id: user.id,
          content: gameJournalContent
        };
        
        const { error: insertError } = await supabase
          .from('journal_entries')
          .insert(gameJournalEntry)
          .select(); // Add select() to get the returned data with the generated ID
        
        saveError = insertError;
      }
      
      if (saveError) {
        console.error("Error saving game journal entry to Supabase:", saveError);
        toast.error("Failed to save entry. Please try again.");
        return false;
      }
      
      toast.success("Game journal entry saved!");
      navigate("/journal");
      return true;
    } catch (err) {
      console.error("Error saving game journal:", err);
      toast.error("An unexpected error occurred. Please try again.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    checkForInProgressEntry,
    savePregameEntry,
    saveCompleteGameEntry
  };
}
