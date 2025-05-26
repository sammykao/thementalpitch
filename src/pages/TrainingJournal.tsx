import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import TimeOfDayField from "../components/TimeOfDayField";

interface Question {
  id: string;
  text: string;
  enabled: boolean;
}

const TrainingJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Parse the selected date from location state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formattedDate, setFormattedDate] = useState(format(new Date(), "MMMM d"));
  
  // Questions from settings
  const [questions, setQuestions] = useState<Question[]>([]);
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
  
  // Loading state
  const [isSaving, setIsSaving] = useState(false);
  
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
    } else {
      setFormattedDate(format(dateToUse, "MMMM d"));
    }
    
    setSelectedDate(dateToUse);
  }, [location.state]);
  
  // Load questions on mount
  useEffect(() => {
    // Load saved training questions from localStorage
    const savedQuestions = localStorage.getItem("trainingQuestions");
    if (savedQuestions) {
      const parsedQuestions = JSON.parse(savedQuestions);
      setQuestions(parsedQuestions);
      const filtered = parsedQuestions.filter((q: Question) => q.enabled);
      setEnabledQuestions(filtered);
    } else {
      // Default questions
      const defaultQuestions = [
        { id: "1", text: "Did I feel focused during practice today?", enabled: true },
        { id: "2", text: "What were distracting external factors for me during training?", enabled: true },
        { id: "3", text: "What weakness in my game do I want to work on?", enabled: true },
        { id: "4", text: "Write down what I did well today, and my \"play of the day\":", enabled: true },
        { id: "5", text: "What'd I do when I first woke up this morning to set a positive tone for my day?", enabled: true },
        { id: "6", text: "Did I do the treatment, activation, and stretching I normally do?", enabled: true },
      ];
      setQuestions(defaultQuestions);
      setEnabledQuestions(defaultQuestions.filter(q => q.enabled));
    }
  }, []);
  
  // Handle answer change
  const handleAnswerChange = (id: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("You need to be signed in to save journal entries");
      navigate("/signin");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Create consistent timestamp using selectedDate but keeping time consistent
      const formattedTimestamp = format(selectedDate, "yyyy-MM-dd") + "T12:00:00Z";
      
      // Create journal entry object - Use the same date format as other journal types
      const journalEntry = {
        type: "Training",
        date: formattedDate, // Keep the formatted date for consistency with other journal types
        timestamp: formattedTimestamp, // Use timezone-safe timestamp
        user_id: user.id,
        content: {
          answers,
          rating,
          notes,
          timeOfDay: timeOfDay?.trim() || undefined // Only include if not empty
        }
      };
      
      // Save to Supabase
      const { error } = await supabase
        .from('journal_entries')
        .insert([journalEntry]);
      
      if (error) {
        console.error("Error saving journal entry to Supabase:", error);
        toast.error("Failed to save entry. Please try again.");
        return;
      }
      
      toast.success("Training journal entry saved!");
      
      // Navigate back to the journal page
      navigate("/journal");
    } catch (err) {
      console.error("Error saving training journal:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSaving(false);
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
        return <p className="text-center">No training questions are enabled. Please configure questions in settings.</p>;
      }

      const currentQuestion = enabledQuestions[currentQuestionIndex];
      
      // Add TimeOfDay field if this is the first question
      if (currentQuestionIndex === 0) {
        return (
          <>
            <div className="bg-[#3056b7] px-4 py-2 rounded-lg mb-6 text-center w-full">
              Today, {formattedDate}
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
                disabled={isSaving}
              >
                ← BACK
              </Button>
              
              <div className="text-sm text-gray-400">
                Question {currentQuestionIndex + 1} of {enabledQuestions.length}
              </div>
              
              <Button 
                onClick={handleNext}
                className="bg-green-500 hover:bg-green-600 text-white"
                disabled={isSaving}
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
            Today, {formattedDate}
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
              disabled={isSaving}
            >
              ← BACK
            </Button>
            
            <div className="text-sm text-gray-400">
              Question {currentQuestionIndex + 1} of {enabledQuestions.length}
            </div>
            
            <Button 
              onClick={handleNext}
              className="bg-green-500 hover:bg-green-600 text-white"
              disabled={isSaving}
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
            Today, {formattedDate}
          </div>
          
          <div className="w-full space-y-4">
            <p className="text-center mb-2">On a scale of 1-10,<br />how'd training go?</p>
            
            <div className="grid grid-cols-2 gap-3">
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((value) => (
                <Button 
                  key={value}
                  onClick={() => handleRatingSelect(value)}
                  className={`${getRatingColor(value)} ${rating === value ? 'ring-2 ring-white' : ''}`}
                  disabled={isSaving}
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
              disabled={isSaving}
            >
              ← BACK
            </Button>
            <Button 
              onClick={handleNext}
              disabled={rating === null || isSaving}
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
            Today, {formattedDate}
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
              disabled={isSaving}
            >
              ← BACK
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 text-white"
              disabled={isSaving}
            >
              {isSaving ? "SAVING..." : "DONE →"}
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
              <h2 className="text-2xl font-bold">TRAINING</h2>
              <div className="w-6"></div> {/* Empty div for spacing */}
            </div>
            
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingJournal;
