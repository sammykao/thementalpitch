import { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { format, parse, parseISO } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import TimeOfDayField from "../components/TimeOfDayField";
import { supabase } from "@/integrations/supabase/client";
import { Question } from "@/hooks/journal/types";
import { useJournalLocalStorage } from "@/hooks/journal/useLocalStorage";

const LiftJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { date: selectedDateParam } = useParams();
  const { user } = useAuth();
  const { liftQuestions } = useJournalLocalStorage();
  
  // Parse the selected date from URL params or location state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formattedDate, setFormattedDate] = useState(format(new Date(), "MMMM d"));
  
  // Questions from settings
  const [enabledQuestions, setEnabledQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Answers storage
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  
  // State variables
  const [page, setPage] = useState(0);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  
  // Time of day state
  const [timeOfDay, setTimeOfDay] = useState("");
  
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
    
    console.log("Selected date for journal entry:", dateToUse);
    setSelectedDate(dateToUse);
  }, [selectedDateParam, location.state]);
  
  // Load questions from the liftQuestions prop
  useEffect(() => {
    if (liftQuestions && liftQuestions.length > 0) {
      const filtered = liftQuestions.filter((q: Question) => q.enabled);
      setEnabledQuestions(filtered);
    } else {
      // Default questions if none are available
      const defaultQuestions: Question[] = [
        { id: "1", text: "How motivated was I before my lift today?", enabled: true, type: "text", section: "lift" },
        { id: "2", text: "Post-lift, how does my body feel?", enabled: true, type: "text", section: "lift" },
        { id: "3", text: "Am I happy that I lifted?", enabled: true, type: "text", section: "lift" },
      ];
      setEnabledQuestions(defaultQuestions.filter(q => q.enabled));
    }
  }, [liftQuestions]);
  
  // Handle answer change
  const handleAnswerChange = (id: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  // Handle navigation between pages
  const nextPage = () => {
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
  
  const previousPage = () => {
    if (page === 0) {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      } else {
        navigate("/new-activity", {
          state: {
            selectedDate: format(selectedDate, "yyyy-MM-dd"),
            displayDate: formattedDate
          }
        });
      }
    } else if (page === 1) {
      setPage(0);
      setCurrentQuestionIndex(enabledQuestions.length - 1);
    } else if (page === 2) {
      setPage(1);
    }
  };
  
  // Save lift journal entry
  const handleSubmit = async () => {
    if (!user) {
      toast.error("You need to be signed in to save journal entries");
      navigate("/signin");
      return;
    }
    
    console.log("Saving journal entry with date:", selectedDate);
    
    try {
      // Create consistent timestamp using selectedDate but keeping time consistent
      const formattedTimestamp = format(selectedDate, "yyyy-MM-dd") + "T12:00:00Z";
      
      // Create journal entry object with timezone-safe timestamp
      const journalEntry = {
        type: "Lift",
        date: formattedDate,
        timestamp: formattedTimestamp, // Use timezone-safe timestamp
        user_id: user.id,
        content: {
          answers,
          rating: selectedRating,
          notes,
          timeOfDay: timeOfDay.trim() || undefined // Only include timeOfDay if it has content
        }
      };
      
      // Save to Supabase
      const { error } = await supabase
        .from('journal_entries')
        .insert(journalEntry);
      
      if (error) {
        console.error("Error saving journal entry to Supabase:", error);
        toast.error("Failed to save your journal entry. Please try again.");
        return;
      }
      
      toast.success("Lift journal entry saved!");
      
      // Navigate back to the journal page with the correct date
      const dateString = format(selectedDate, "yyyy-MM-dd");
      navigate(`/journal/${dateString}`);
    } catch (error) {
      console.error("Error saving journal entry:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  // Handle rating selection with color coding
  const getRatingButtonColor = (rating: number) => {
    if (rating >= 9) return "bg-green-500 hover:bg-green-600";
    if (rating >= 7) return "bg-lime-500 hover:bg-lime-600";
    if (rating >= 5) return "bg-amber-500 hover:bg-amber-600";
    if (rating >= 3) return "bg-orange-500 hover:bg-orange-600";
    return "bg-red-500 hover:bg-red-600";
  };

  // Render content based on current page
  const renderContent = () => {
    if (page === 0) {
      if (enabledQuestions.length === 0) {
        return <p className="text-center">No lift questions are enabled. Please configure questions in settings.</p>;
      }
      
      const currentQuestion = enabledQuestions[currentQuestionIndex];
      
      // Add TimeOfDay field if this is the first question
      if (currentQuestionIndex === 0) {
        return (
          <>
            <div className="bg-[#3056b7] px-4 py-2 rounded-lg mb-6 text-center w-full">
              {formattedDate}
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
                onClick={previousPage}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                ← BACK
              </Button>
              
              <div className="text-sm text-gray-400">
                Question {currentQuestionIndex + 1} of {enabledQuestions.length}
              </div>
              
              <Button 
                onClick={nextPage}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                NEXT →
              </Button>
            </div>
          </>
        );
      }
      
      // Regular rendering for non-first questions
      return (
        <>
          <div className="bg-[#3056b7] px-4 py-2 rounded-lg mb-6 text-center w-full">
            {formattedDate}
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
              onClick={previousPage}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              ← BACK
            </Button>
            
            <div className="text-sm text-gray-400">
              Question {currentQuestionIndex + 1} of {enabledQuestions.length}
            </div>
            
            <Button 
              onClick={nextPage}
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
            {formattedDate}
          </div>
          
          <div className="w-full space-y-4">
            <p className="text-center mb-2">On a scale of 1-10,<br />how'd your lift go?</p>
            
            <div className="grid grid-cols-2 gap-3">
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((rating) => (
                <Button 
                  key={rating}
                  className={`${getRatingButtonColor(rating)} ${selectedRating === rating ? 'ring-2 ring-white' : ''}`}
                  onClick={() => setSelectedRating(rating)}
                >
                  {rating}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="w-full flex justify-between mt-8">
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white px-6"
              onClick={previousPage}
            >
              BACK
            </Button>
            
            <Button 
              className="bg-green-500 hover:bg-green-600 text-white px-6"
              onClick={nextPage}
            >
              NEXT
            </Button>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="bg-[#3056b7] px-4 py-2 rounded-lg mb-6 text-center w-full">
            {formattedDate}
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
          
          <div className="w-full flex justify-between mt-8">
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white px-6"
              onClick={previousPage}
            >
              BACK
            </Button>
            
            <Button 
              className="bg-green-500 hover:bg-green-600 text-white px-6"
              onClick={handleSubmit}
            >
              DONE
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
              <Link to="/new-activity" state={{ selectedDate: format(selectedDate, "yyyy-MM-dd"), displayDate: formattedDate }}>
                <Button variant="ghost" className="text-white p-0 h-auto">
                  <ArrowLeft className="h-6 w-6" />
                </Button>
              </Link>
              <h2 className="text-2xl font-bold">LIFT</h2>
              <div className="w-6"></div> {/* Empty div for spacing */}
            </div>
            
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiftJournal;
