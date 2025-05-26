import { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { format, parse, parseISO } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import TimeOfDayField from "../components/TimeOfDayField";
import { supabase } from "@/integrations/supabase/client";
import { Question } from "@/hooks/journal/types";
import { useJournalLocalStorage } from "@/hooks/journal/useLocalStorage";

const RehabJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { date: selectedDateParam } = useParams();
  const { user } = useAuth();
  const { rehabQuestions } = useJournalLocalStorage();
  
  // Get selected date from URL or state, or default to today
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formattedDate, setFormattedDate] = useState(format(new Date(), "MMMM d"));
  
  // Questions from settings
  const [enabledQuestions, setEnabledQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Answers storage
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  
  // Rating state
  const [rating, setRating] = useState<number | null>(null);
  
  // Notes state
  const [notes, setNotes] = useState("");
  
  // Time of day state
  const [timeOfDay, setTimeOfDay] = useState("");
  
  // Page state (0: questions, 1: rating, 2: notes)
  const [page, setPage] = useState(0);

  // Parse the selected date from URL params or location state
  useEffect(() => {
    let dateToUse = new Date(); // Default to today
    
    // First check if we have a date in location state (from the calendar)
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
    // Then check if we have a date in the URL parameter
    else if (selectedDateParam) {
      try {
        dateToUse = parse(selectedDateParam, "yyyy-MM-dd", new Date());
        setFormattedDate(format(dateToUse, "MMMM d"));
      } catch (error) {
        console.error("Error parsing date from URL parameter:", error);
      }
    }
    // If no date was specified anywhere, just use today
    else {
      setFormattedDate(format(dateToUse, "MMMM d"));
    }
    
    setSelectedDate(dateToUse);
  }, [selectedDateParam, location.state]);
  
  // Load questions from rehabQuestions
  useEffect(() => {
    if (rehabQuestions && rehabQuestions.length > 0) {
      const filtered = rehabQuestions.filter((q: Question) => q.enabled);
      setEnabledQuestions(filtered);
    } else {
      // Default questions
      const defaultQuestions: Question[] = [
        { id: "1", text: "How do I feel about my rehab performance today?", enabled: true, type: "text", section: "rehab" },
        { id: "2", text: "What did I do when I first woke up to set a positive tone for my recovery?", enabled: true, type: "text", section: "rehab" },
        { id: "3", text: "Did I get 20 minutes of stretching in today? If not, why?", enabled: true, type: "text", section: "rehab" },
        { id: "4", text: "How motivated was I before rehab today?", enabled: true, type: "text", section: "rehab" },
        { id: "5", text: "After rehab, do I feel better or worse about my recovery process?", enabled: true, type: "text", section: "rehab" },
        { id: "6", text: "What did/am I going to do to stay connected with my teammates today?", enabled: true, type: "text", section: "rehab" },
      ];
      setEnabledQuestions(defaultQuestions.filter(q => q.enabled));
    }
  }, [rehabQuestions]);

  // Handle answer change
  const handleAnswerChange = (id: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("You must be logged in to save journal entries");
      navigate("/signin");
      return;
    }
    
    try {
      // Create consistent timestamp using selectedDate but keeping time consistent
      // This ensures the entry shows up on the correct day regardless of timezone
      const formattedTimestamp = format(selectedDate, "yyyy-MM-dd") + "T12:00:00Z";
      
      // Create the journal entry with the SELECTED DATE's timestamp
      const journalEntry = {
        type: "Rehab",
        date: formattedDate,
        timestamp: formattedTimestamp, // Use timezone-safe timestamp
        user_id: user.id,
        content: {
          answers,
          rating,
          notes,
          timeOfDay
        }
      };
      
      console.log("Journal entry being saved:", journalEntry);
      
      // Save to Supabase
      const { error } = await supabase
        .from('journal_entries')
        .insert(journalEntry);
      
      if (error) {
        console.error("Error saving journal entry to Supabase:", error);
        toast.error("Failed to save your journal entry. Please try again.");
        return;
      }
      
      toast.success("Rehab journal entry saved!");
      
      // Navigate back to the calendar view if we came from there, or to the daily journal for the selected date
      if (selectedDateParam || location.state?.selectedDate) {
        const dateString = selectedDateParam || location.state?.selectedDate || format(selectedDate, "yyyy-MM-dd");
        navigate(`/journal/${dateString}`); // Ensure we're using the /journal/ path
      } else {
        navigate("/journal");
      }
    } catch (error) {
      console.error("Error saving journal entry:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleRatingSelect = (selectedRating: number) => {
    setRating(selectedRating);
  };
  
  const handleNext = () => {
    if (page === 0) {
      if (currentQuestionIndex < enabledQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setPage(1); // Move to rating page
      }
    } else if (page === 1) {
      setPage(2); // Move to notes page
    }
  };
  
  const handleBack = () => {
    if (page === 0) {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      } else {
        navigate("/new-activity");
      }
    } else if (page === 1) {
      setPage(0);
      setCurrentQuestionIndex(enabledQuestions.length - 1);
    } else if (page === 2) {
      setPage(1);
    }
  };

  // Define color classes for the rating buttons
  const getRatingColor = (value: number) => {
    if (value >= 9) return "bg-green-500 hover:bg-green-600";
    if (value >= 7) return "bg-lime-400 hover:bg-lime-500";
    if (value >= 5) return "bg-yellow-500 hover:bg-yellow-600";
    if (value >= 3) return "bg-orange-500 hover:bg-orange-600";
    return "bg-red-500 hover:bg-red-600";
  };

  // Render different content based on current page
  const renderContent = () => {
    if (page === 0) {
      if (enabledQuestions.length === 0) {
        return <p className="text-center">No rehab questions are enabled. Please configure questions in settings.</p>;
      }
      
      const currentQuestion = enabledQuestions[currentQuestionIndex];
      
      // Add TimeOfDay field if this is the first question
      if (currentQuestionIndex === 0) {
        return (
          <>
            <div className="bg-[#3056b7] px-4 py-2 rounded-lg mb-6 text-center w-full">
              <div className="font-bold">REHAB</div>
              <div>{formattedDate}</div> {/* Use formatted selected date */}
            </div>
            
            <div className="w-full space-y-4">
              <TimeOfDayField value={timeOfDay} onChange={setTimeOfDay} />
              
              <div className="mb-4">
                <p className="text-sm mb-2 text-center">{currentQuestion.text}</p>
                <Textarea 
                  className="w-full bg-[#1A1F2C] border border-[#3056b7] rounded-lg p-2 min-h-[150px] text-white"
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full flex justify-between items-center mt-4">
              <Button 
                onClick={handleBack}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                ← BACK
              </Button>
              
              <div className="text-sm text-gray-400">
                Question {currentQuestionIndex + 1} of {enabledQuestions.length}
              </div>
              
              <Button 
                onClick={handleNext}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                NEXT →
              </Button>
            </div>
          </>
        );
      }
      
      // Regular question rendering for non-first questions
      return (
        <>
          <div className="bg-[#3056b7] px-4 py-2 rounded-lg mb-6 text-center w-full">
            <div className="font-bold">REHAB</div>
            <div>{formattedDate}</div> {/* Use formatted selected date */}
          </div>
          
          <div className="w-full space-y-4">
            <div className="mb-4">
              <p className="text-sm mb-2 text-center">{currentQuestion.text}</p>
              <Textarea 
                className="w-full bg-[#1A1F2C] border border-[#3056b7] rounded-lg p-2 min-h-[150px] text-white"
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full flex justify-between items-center mt-4">
            <Button 
              onClick={handleBack}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              ← BACK
            </Button>
            
            <div className="text-sm text-gray-400">
              Question {currentQuestionIndex + 1} of {enabledQuestions.length}
            </div>
            
            <Button 
              onClick={handleNext}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {currentQuestionIndex === enabledQuestions.length - 1 ? "NEXT →" : "NEXT →"}
            </Button>
          </div>
        </>
      );
    } else if (page === 1) {
      return (
        <>
          <div className="bg-[#3056b7] px-4 py-2 rounded-lg mb-6 text-center w-full">
            <div className="font-bold">REHAB</div>
            <div>{formattedDate}</div> {/* Use formatted selected date */}
          </div>
          
          <div className="w-full space-y-4">
            <p className="text-center mb-2">On a scale of 1-10,<br />how'd rehab go?</p>
            
            <div className="grid grid-cols-2 gap-3">
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((value) => (
                <Button 
                  key={value}
                  onClick={() => handleRatingSelect(value)}
                  className={`${getRatingColor(value)} ${rating === value ? 'ring-2 ring-white' : ''}`}
                >
                  {value}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="w-full flex justify-between mt-4">
            <Button 
              onClick={handleBack}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              ← BACK
            </Button>
            <Button 
              onClick={handleNext}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              NEXT →
            </Button>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="bg-[#3056b7] px-4 py-2 rounded-lg mb-6 text-center w-full">
            <div className="font-bold">REHAB</div>
            <div>{formattedDate}</div> {/* Use formatted selected date */}
          </div>
          
          <div className="w-full space-y-4">
            <p className="text-center mb-2 font-bold">OTHER NOTES:</p>
            
            <Textarea 
              className="w-full bg-[#1A1F2C] border border-[#3056b7] rounded-lg p-2 min-h-[250px] text-white"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any additional notes here..."
            />
          </div>
          
          <div className="w-full flex justify-between mt-4">
            <Button 
              onClick={handleBack}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              ← BACK
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              DONE →
            </Button>
          </div>
        </>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#1A1F2C] text-white">
      <div className="w-full max-w-md px-4 py-8 flex flex-col items-center">
        <div className="w-full mb-8">
          <div className="bg-[#193175] rounded-lg p-4 w-full flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-4">
              <Button variant="ghost" className="text-white p-0 h-auto" onClick={handleBack}>
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <h2 className="text-2xl font-bold">REHAB JOURNAL</h2>
              <div className="w-6"></div> {/* Empty div for spacing */}
            </div>
            
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RehabJournal;
