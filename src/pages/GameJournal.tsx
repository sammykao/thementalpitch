
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

// Types
import { JournalMode, GamePhase, PregameAnswers, PostgameAnswers, ExternalFactor } from "@/components/journal/game/types";

// Components
import { GameJournalHeader } from "@/components/journal/game/GameJournalHeader";
import { GameModeSelection } from "@/components/journal/game/GameModeSelection";
import { PregameSection } from "@/components/journal/game/PregameSection";
import { PostgameFactorsSection } from "@/components/journal/game/PostgameFactorsSection";
import { PostgameReflectionSection } from "@/components/journal/game/PostgameReflectionSection";
import { PostgameRatingSection } from "@/components/journal/game/PostgameRatingSection";
import { PostgameNotesSection } from "@/components/journal/game/PostgameNotesSection";

// Hooks
import { useGameQuestions } from "@/hooks/journal/useGameQuestions";
import { useGameJournalOperations } from "@/hooks/journal/useGameJournalOperations";
import { supabase } from "@/integrations/supabase/client";

const GameJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const today = format(new Date(), "MMMM d");
  const { user } = useAuth();
  
  // Parse the selected date from location state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formattedDate, setFormattedDate] = useState(today);
  
  // State management
  const [mode, setMode] = useState<JournalMode>("selection");
  
  // Answers storage
  const [pregameAnswers, setPregameAnswers] = useState<PregameAnswers>({});
  const [postgameAnswers, setPostgameAnswers] = useState<PostgameAnswers>({});
  
  // Rating state
  const [rating, setRating] = useState<number | null>(null);
  
  // Notes state
  const [notes, setNotes] = useState("");
  
  // Team state - add this for the opposing team
  const [opposingTeam, setOpposingTeam] = useState("");
  
  // Time of day state
  const [timeOfDay, setTimeOfDay] = useState("");
  
  // State to track if we're completing an in-progress entry
  const [isCompleting, setIsCompleting] = useState(false);
  // Store the entry date when completing an existing entry
  const [entryDate, setEntryDate] = useState<string | undefined>(undefined);
  
  // Pagination for questions
  const [pregameQuestionIndex, setPregameQuestionIndex] = useState(0);
  const [postgameQuestionIndex, setPostgameQuestionIndex] = useState(0);
  
  // External factors that might affect performance
  const [externalFactors, setExternalFactors] = useState<ExternalFactor[]>([
    { name: "Confidence", selected: false },
    { name: "Referee", selected: false },
    { name: "Coach yelling", selected: false },
    { name: "Teammates", selected: false },
    { name: "Opponent", selected: false },
  ]);

  // Load questions using our custom hook
  const { 
    enabledPregameQuestions, 
    enabledPostgameQuestions 
  } = useGameQuestions();
  
  // Journal operations using our custom hook
  const { 
    isSaving, 
    checkForInProgressEntry,
    savePregameEntry,
    saveCompleteGameEntry 
  } = useGameJournalOperations();

  // Parse the selected date from location state
  useEffect(() => {
    let dateToUse = new Date(); // Default to today
    
    // Get the date from location state if available
    if (location.state?.selectedDate) {
      try {
        dateToUse = parseISO(location.state.selectedDate);
        
        // If location.state also has a display date, use it directly
        if (location.state.displayDate) {
          setFormattedDate(location.state.displayDate);
        } else {
          setFormattedDate(format(dateToUse, "MMMM d"));
        }
      } catch (error) {
        console.error("Error parsing date from location state:", error);
      }
    }
    
    setSelectedDate(dateToUse);
  }, [location.state]);
  
  // Check for completing an in-progress entry
  useEffect(() => {
    if (location.state?.completingEntry && location.state?.phase === "postgame") {
      setIsCompleting(true);
      
      if (location.state.entryDate) {
        setFormattedDate(location.state.entryDate);
        setEntryDate(location.state.entryDate); // Store the entry date for later use
      }
      
      // Load the existing pregame data for this entry
      const loadExistingPregameData = async () => {
        if (!user) return;
        
        try {
          const { data, error } = await supabase
            .from('journal_entries')
            .select('*')
            .eq('user_id', user.id)
            .eq('type', 'Game')
            .eq('date', location.state.entryDate)
            .order('timestamp', { ascending: false })
            .limit(1);
            
          if (error) {
            console.error("Error loading pregame data:", error);
            toast.error("Failed to load your previous entry data");
            return;
          }
          
          if (data && data.length > 0) {
            const content = data[0].content;
            
            // Type guard to ensure content is an object, not an array
            if (content && typeof content === 'object' && !Array.isArray(content)) {
              // Set opposing team if available
              if ('opposingTeam' in content) {
                const team = content.opposingTeam;
                if (typeof team === 'string') {
                  setOpposingTeam(team);
                }
              }
              
              // Set time of day if available
              if ('timeOfDay' in content) {
                const time = content.timeOfDay;
                if (typeof time === 'string') {
                  setTimeOfDay(time);
                }
              }
              
              // Set pregame answers if available
              if ('pregame' in content && content.pregame) {
                const pregameData = content.pregame;
                
                if (typeof pregameData === 'object' && !Array.isArray(pregameData)) {
                  // Map the pregame data to our pregame answers format
                  const answers: PregameAnswers = {};
                  
                  if ('controlFactors' in pregameData && typeof pregameData.controlFactors === 'string') {
                    answers["1"] = pregameData.controlFactors;
                  }
                  
                  if ('distractions' in pregameData && typeof pregameData.distractions === 'string') {
                    answers["2"] = pregameData.distractions;
                  }
                  
                  if ('mistakeResponse' in pregameData && typeof pregameData.mistakeResponse === 'string') {
                    answers["3"] = pregameData.mistakeResponse;
                  }
                  
                  setPregameAnswers(answers);
                }
              }
            }
            
            // Automatically go to postgame section
            setMode("postgame-factors");
          }
        } catch (err) {
          console.error("Error loading pregame data:", err);
          toast.error("Failed to load your previous entry data");
        }
      };
      
      loadExistingPregameData();
    }
  }, [location.state, user]);
  
  // Check for in-progress entry when component mounts
  useEffect(() => {
    // Skip this check if we're completing an in-progress entry
    if (isCompleting) return;
    
    const loadInProgressEntry = async () => {
      const inProgressEntry = await checkForInProgressEntry();
      if (inProgressEntry) {
        // Restore the pregame answers
        setPregameAnswers(inProgressEntry.answers);
        setOpposingTeam(inProgressEntry.opposingTeam || "");
        setTimeOfDay(inProgressEntry.timeOfDay || "");
      }
    };
    
    loadInProgressEntry();
  }, [isCompleting]);
  
  // Handle answer change
  const handleAnswerChange = (id: string, value: string) => {
    if (mode === "pregame") {
      setPregameAnswers(prev => ({ ...prev, [id]: value }));
    } else {
      setPostgameAnswers(prev => ({ ...prev, [id]: value }));
    }
  };
  
  // Handle phase selection
  const handlePhaseSelect = async (phase: GamePhase) => {
    if (phase === "pregame") {
      setMode("pregame");
      setPregameQuestionIndex(0);
    } else {
      // Check if there's an in-progress entry
      if (!user) {
        toast.error("You must be logged in to continue");
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', user.id)
          .eq('type', 'Game')
          .eq('date', formattedDate)
          .order('timestamp', { ascending: false })
          .limit(1);
          
        if (error) {
          console.error("Error checking for in-progress game entry:", error);
          toast.error("Failed to check for pre-game entry. Please try again.");
          return;
        }
        
        // Check if we have a pregame entry
        const hasPreGame = data && data.length > 0 && data[0].content && 
                         typeof data[0].content === 'object' &&
                         'pregame' in data[0].content;
        
        if (hasPreGame) {
          setMode("postgame-factors");
          setPostgameQuestionIndex(0);
          
          // Set the opposing team and time of day from the pregame entry if available
          const content = data[0].content as any;
          
          if (content.opposingTeam) {
            setOpposingTeam(content.opposingTeam);
          }
          
          if (content.timeOfDay) {
            setTimeOfDay(content.timeOfDay);
          }
        } else {
          toast.error("Please complete pre-game questions first");
        }
      } catch (err) {
        console.error("Error checking for in-progress entry:", err);
        toast.error("Failed to check for pre-game entry. Please try again.");
      }
    }
  };
  
  // Handle saving pregame entry
  const handleSavePregame = async () => {
    await savePregameEntry(pregameAnswers, timeOfDay, opposingTeam);
  };
  
  // Handle saving complete game entry
  const handleSaveComplete = async () => {
    await saveCompleteGameEntry(
      pregameAnswers, 
      postgameAnswers, 
      externalFactors, 
      rating, 
      notes, 
      timeOfDay, 
      opposingTeam,
      entryDate // Pass the entry date when completing an existing entry
    );
  };

  // Toggle external factor selection
  const toggleFactor = (index: number) => {
    const updatedFactors = [...externalFactors];
    updatedFactors[index].selected = !updatedFactors[index].selected;
    setExternalFactors(updatedFactors);
  };
  
  // Navigation handlers
  const handleNext = () => {
    if (mode === "pregame") {
      if (pregameQuestionIndex < enabledPregameQuestions.length - 1) {
        setPregameQuestionIndex(pregameQuestionIndex + 1);
      } else {
        handleSavePregame();
      }
    } else if (mode === "postgame-factors") {
      setMode("postgame-reflection");
    } else if (mode === "postgame-reflection") {
      if (postgameQuestionIndex < enabledPostgameQuestions.length - 1) {
        setPostgameQuestionIndex(postgameQuestionIndex + 1);
      } else {
        setMode("postgame-rating");
      }
    } else if (mode === "postgame-rating") {
      setMode("postgame-notes");
    }
  };
  
  const handleBack = () => {
    if (mode === "pregame") {
      if (pregameQuestionIndex > 0) {
        setPregameQuestionIndex(pregameQuestionIndex - 1);
      } else {
        navigate("/new-activity", { 
          state: { 
            selectedDate: format(selectedDate, "yyyy-MM-dd"), 
            displayDate: formattedDate 
          } 
        });
      }
    } else if (mode === "postgame-factors" || mode === "selection") {
      navigate("/new-activity", { 
        state: { 
          selectedDate: format(selectedDate, "yyyy-MM-dd"), 
          displayDate: formattedDate 
        }
      });
    } else if (mode === "postgame-reflection") {
      if (postgameQuestionIndex > 0) {
        setPostgameQuestionIndex(postgameQuestionIndex - 1);
      } else {
        setMode("postgame-factors");
      }
    } else if (mode === "postgame-rating") {
      setMode("postgame-reflection");
      setPostgameQuestionIndex(enabledPostgameQuestions.length - 1);
    } else if (mode === "postgame-notes") {
      setMode("postgame-rating");
    }
  };

  // Render content based on the current mode
  const renderContent = () => {
    switch (mode) {
      case "selection":
        return (
          <GameModeSelection 
            handlePhaseSelect={handlePhaseSelect}
            navigateToJournal={() => navigate("/journal")}
            isSaving={isSaving}
          />
        );
        
      case "pregame":
        return (
          <PregameSection 
            enabledPregameQuestions={enabledPregameQuestions}
            pregameQuestionIndex={pregameQuestionIndex}
            pregameAnswers={pregameAnswers}
            timeOfDay={timeOfDay}
            opposingTeam={opposingTeam}
            setTimeOfDay={setTimeOfDay}
            setOpposingTeam={setOpposingTeam}
            handleAnswerChange={handleAnswerChange}
            handleBack={handleBack}
            handleNext={handleNext}
            isSaving={isSaving}
          />
        );
        
      case "postgame-factors":
        return (
          <PostgameFactorsSection 
            externalFactors={externalFactors}
            toggleFactor={toggleFactor}
            handleBack={handleBack}
            handleNext={handleNext}
            isSaving={isSaving}
          />
        );
        
      case "postgame-reflection":
        return (
          <PostgameReflectionSection 
            enabledPostgameQuestions={enabledPostgameQuestions}
            postgameQuestionIndex={postgameQuestionIndex}
            postgameAnswers={postgameAnswers}
            handleAnswerChange={handleAnswerChange}
            handleBack={handleBack}
            handleNext={handleNext}
            isSaving={isSaving}
          />
        );
        
      case "postgame-rating":
        return (
          <PostgameRatingSection 
            rating={rating}
            handleRatingSelect={setRating}
            handleBack={handleBack}
            handleNext={handleNext}
            isSaving={isSaving}
          />
        );
        
      case "postgame-notes":
        return (
          <PostgameNotesSection 
            notes={notes}
            setNotes={setNotes}
            handleBack={handleBack}
            handleSaveComplete={handleSaveComplete}
            isSaving={isSaving}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#1A1F2C] text-white">
      <div className="w-full max-w-md px-4 py-8 flex flex-col items-center">
        <div className="w-full mb-8">
          <div className="bg-[#193175] rounded-lg p-4 w-full flex flex-col items-center">
            <GameJournalHeader 
              mode={mode}
              formattedDate={formattedDate}
              handleBack={handleBack}
              isSaving={isSaving}
              isCompleting={isCompleting}
            />
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameJournal;
