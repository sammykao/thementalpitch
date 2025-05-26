
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type MealType = "Breakfast" | "Lunch" | "Snack" | "Dinner";

interface FoodJournalContent {
  mealType: MealType;
  timeOfDay: string;
  foodItems: string;
  feelingNotes?: string;
  [key: string]: any; // Add index signature to make it compatible with Json type
}

const FoodJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Parse the selected date from location state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formattedDate, setFormattedDate] = useState(format(new Date(), "MMMM d"));
  
  const [activeSection, setActiveSection] = useState<MealType>("Breakfast");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [foodItems, setFoodItems] = useState("");
  const [feelingNotes, setFeelingNotes] = useState(""); // Only for dinner
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You need to be signed in to save journal entries");
      navigate("/signin");
      return;
    }
    
    if (!timeOfDay.trim()) {
      toast.error("Please enter the time of day");
      return;
    }
    
    if (!foodItems.trim()) {
      toast.error("Please enter at least one food item");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Create the journal entry content
      const content: FoodJournalContent = {
        mealType: activeSection,
        timeOfDay,
        foodItems,
        feelingNotes: activeSection === "Dinner" ? feelingNotes : ""
      };
      
      // Create the journal entry - FIX: use the formatted date string for timestamp instead of ISO string
      // This ensures the entry is saved on the correct day regardless of timezone
      const entry = {
        type: "Food",
        date: formattedDate,
        timestamp: format(selectedDate, "yyyy-MM-dd") + "T12:00:00.000Z", // Use noon on the selected day as timestamp
        user_id: user.id,
        content
      };
      
      console.log("Saving journal entry:", entry);
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('journal_entries')
        .insert([entry])
        .select(); // Add select() to get the returned data with the generated ID
        
      if (error) {
        console.error("Error saving journal entry to Supabase:", error);
        toast.error("Failed to save entry. Please try again.");
        setIsSaving(false);
        return;
      }
      
      toast.success(`${activeSection} journal entry saved!`);
      
      // Navigate back to the journal page with the correct date
      const dateString = format(selectedDate, "yyyy-MM-dd");
      navigate(`/journal/${dateString}`);
    } catch (err) {
      console.error("Error saving food journal:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleBack = () => {
    navigate("/new-activity", { 
      state: { 
        selectedDate: format(selectedDate, "yyyy-MM-dd"), 
        displayDate: formattedDate 
      } 
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center bg-[#1A1F2C] text-white">
      <div className="w-full max-w-md px-4 py-8 flex flex-col items-center">
        <div className="w-full mb-8">
          <div className="bg-[#1A1F2C] rounded-lg p-4 w-full flex flex-col items-center">
            {/* Header */}
            <div className="w-full bg-[#003087] rounded-lg p-4 mb-6">
              <div className="text-center text-2xl font-bold mb-4">FOOD</div>
              <div className="text-center text-xl">{activeSection}</div>
            </div>
            
            {/* Today's Date */}
            <div className="w-full bg-[#003087] rounded-lg p-2 mb-4 text-center">
              {formattedDate}
            </div>
            
            {/* Time Input */}
            <div className="w-full bg-[#003087] rounded-lg p-2 mb-4">
              <Input 
                className="bg-transparent border-none text-white text-center placeholder:text-gray-300"
                placeholder="Enter time of day"
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value)}
              />
            </div>
            
            {/* Food Input - Making it more obvious with enhanced styling */}
            <Card className="w-full bg-[#1A1F2C] border-2 border-white rounded-lg p-2 mb-4">
              <div className="text-center text-sm mb-2 text-white font-bold">TYPE ANY FOOD OR VITAMINS</div>
              <div className="relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white text-black px-3 py-1 rounded-full text-xs">
                  Type here ↓
                </div>
                <Textarea 
                  className="min-h-[240px] bg-[#1A1F2C] border border-white text-white resize-none p-4 focus:ring-2 focus:ring-white placeholder-gray-400"
                  value={foodItems}
                  onChange={(e) => setFoodItems(e.target.value)}
                  placeholder="List your food items here..."
                  style={{
                    boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)"
                  }}
                />
              </div>
            </Card>
            
            {/* Feeling Notes (Only for Dinner) */}
            {activeSection === "Dinner" && (
              <Card className="w-full bg-[#1A1F2C] border border-white rounded-lg p-2 mb-4">
                <div className="text-center text-sm mb-2">TYPE how you feel about what you ate today</div>
                <Textarea 
                  className="min-h-[100px] bg-transparent border-none text-white resize-none"
                  value={feelingNotes}
                  onChange={(e) => setFeelingNotes(e.target.value)}
                />
              </Card>
            )}
            
            {/* Navigation Buttons */}
            <div className="w-full flex justify-between mt-4">
              <Button 
                onClick={handleBack}
                className="bg-[#FF9999] hover:bg-[#FF7777] text-black font-bold"
                disabled={isSaving}
              >
                ←BACK
              </Button>
              <Button 
                onClick={handleSubmit}
                className="bg-[#CCFF99] hover:bg-[#BBFF77] text-black font-bold"
                disabled={isSaving}
              >
                {isSaving ? "SAVING..." : "DONE→"}
              </Button>
            </div>
            
            {/* Meal Type Selector */}
            <div className="w-full grid grid-cols-4 gap-2 mt-6">
              {(["Breakfast", "Lunch", "Snack", "Dinner"] as MealType[]).map((meal) => (
                <Button 
                  key={meal}
                  onClick={() => setActiveSection(meal)}
                  className={`${
                    activeSection === meal 
                    ? "bg-[#003087] text-white" 
                    : "bg-[#1A1F2C] text-gray-300 border border-[#003087]"
                  }`}
                  disabled={isSaving}
                >
                  {meal}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodJournal;
