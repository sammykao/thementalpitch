import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface ImageryPrompt {
  id: string;
  text: string;
  selected: boolean;
}

const ImageryJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Date handling
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formattedDate, setFormattedDate] = useState(format(new Date(), "MMMM d"));
  
  const [prompts, setPrompts] = useState<ImageryPrompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<ImageryPrompt[]>([]);
  const [notes, setNotes] = useState("");
  const [openIntroDialog, setOpenIntroDialog] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState(""); // Add timeOfDay state
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
  
  // Load prompts on mount
  useEffect(() => {
    // Default prompts in case nothing is saved
    const defaultPrompts = [
      { 
        id: "pass",
        text: "Visualize a successful pass that's common in your position.", 
        selected: false 
      },
      { 
        id: "goal", 
        text: "Envision Scoring a Goal: Picture yourself receiving the ball, beating a defender, and scoring.", 
        selected: false 
      },
      { 
        id: "defense", 
        text: "Mentally Practice Defensive Positioning: Visualize positioning yourself to intercept an opponent's pass.", 
        selected: false 
      },
      { 
        id: "pressure", 
        text: "Simulate Handling Pressure: Visualize maintaining composure when facing a high-pressure situation.", 
        selected: false 
      },
      { 
        id: "communication", 
        text: "Imagine Effective Communication: Picture yourself directing teammates during a set piece.", 
        selected: false 
      },
      { 
        id: "tackle", 
        text: "Recreate a Successful Tackle: Mentally rehearse timing and executing a clean tackle.", 
        selected: false 
      },
      { 
        id: "body", 
        text: "Visualize Positive Body Language: Imagine displaying confident body language.", 
        selected: false 
      },
      { 
        id: "adversity", 
        text: "Envision Overcoming Adversity: Picture yourself recovering from a mistake.", 
        selected: false 
      },
      { 
        id: "game", 
        text: "Simulate Game Scenarios: Mentally rehearse various game situations.", 
        selected: false 
      },
      { 
        id: "best", 
        text: "Relive your best moment: Close your eyes and think about your most fun game.", 
        selected: false 
      }
    ];
    
    // Load saved imagery prompts from localStorage
    const savedPrompts = localStorage.getItem("imageryPrompts");
    
    if (savedPrompts) {
      // Convert saved prompts (which have enabled property) to journal prompts (with selected property)
      const parsedPrompts = JSON.parse(savedPrompts).map((p: any) => ({
        id: p.id,
        text: p.text,
        selected: false
      }));
      setPrompts(parsedPrompts);
      
      // Filter to only enabled prompts
      const enabled = JSON.parse(savedPrompts).filter((p: any) => p.enabled);
      setFilteredPrompts(enabled.map((p: any) => ({ ...p, selected: false })));
    } else {
      setPrompts(defaultPrompts);
      setFilteredPrompts(defaultPrompts);
    }
  }, []);
  
  const handleTogglePrompt = (id: string) => {
    setFilteredPrompts(filteredPrompts.map(prompt => 
      prompt.id === id ? { ...prompt, selected: !prompt.selected } : prompt
    ));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("You need to be signed in to save journal entries");
      navigate("/signin");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Format the date for consistent storage - match the format used in daily journal
      const dateFormatted = format(selectedDate, "MMMM d");
      
      // Create consistent timestamp with noon UTC time
      const todayFormatted = format(selectedDate, "yyyy-MM-dd") + "T12:00:00Z";
      
      // Create the journal entry object
      const journalEntry = {
        type: "Imagery",
        date: dateFormatted,
        timestamp: todayFormatted,
        user_id: user.id,
        content: {
          selectedPrompts: filteredPrompts.filter(p => p.selected).map(p => p.text),
          notes,
          timeOfDay: timeOfDay.trim() || undefined // Only include timeOfDay if it has content
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
      
      toast.success("Imagery journal entry saved!");
      
      // Navigate back to the journal page with the selected date
      const dateString = format(selectedDate, "yyyy-MM-dd");
      navigate(`/journal/${dateString}`);
    } catch (err) {
      console.error("Error saving imagery journal:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSaving(false);
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
              <h2 className="text-2xl font-bold">IMAGERY</h2>
              <div className="w-6"></div>
            </div>
            
            <div className="bg-[#3056b7] px-4 py-2 rounded-lg mb-6 text-center w-full">
              {formattedDate}
            </div>
            
            {/* Time of Day Input */}
            <div className="w-full bg-[#1A1F2C] rounded-lg p-4 mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Time of day:</label>
              <Input 
                className="bg-[#242c3d] border-[#3056b7] text-white"
                placeholder="Enter time of day"
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value)}
              />
            </div>

            <div className="w-full mb-6">
              <div className="bg-[#1A1F2C] rounded-lg p-4 mb-6 text-sm">
                <p>Before you begin visualization, take a moment 
                to close your eyes and block out everything around 
                you. Focus solely on your mental image, letting go 
                of any distractions or external thoughts.</p>
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {filteredPrompts.length > 0 ? (
                  filteredPrompts.map((prompt) => (
                    <div 
                      key={prompt.id}
                      className={`bg-[#1A1F2C] rounded-lg p-3 cursor-pointer ${prompt.selected ? 'border border-green-500' : ''}`}
                      onClick={() => handleTogglePrompt(prompt.id)}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm flex-1">{prompt.text}</p>
                        <div className="ml-2">
                          {prompt.selected ? (
                            <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          ) : (
                            <div className="h-6 w-6 rounded-full border border-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-gray-400">
                    No imagery prompts are enabled. Please configure prompts in settings.
                  </p>
                )}
              </div>

              <div className="mt-6 border-t border-[#3056b7] pt-4">
                <h4 className="font-semibold mb-2">Notes:</h4>
                <textarea 
                  className="w-full bg-[#1A1F2C] border border-[#3056b7] rounded-lg p-2 min-h-[100px] text-white"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes about your imagery session..."
                />
              </div>
            </div>

            <div className="flex justify-between w-full">
              <Link to="/new-activity" state={{ selectedDate: format(selectedDate, "yyyy-MM-dd"), displayDate: formattedDate }}>
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white"
                  disabled={isSaving}
                >
                  BACK
                </Button>
              </Link>
              <Button 
                onClick={handleSubmit}
                className="bg-green-500 hover:bg-green-600 text-white"
                disabled={isSaving}
              >
                {isSaving ? "SAVING..." : "DONE"}
              </Button>
            </div>

            <Dialog open={openIntroDialog} onOpenChange={setOpenIntroDialog}>
              <DialogContent className="bg-[#193175] text-white">
                <DialogHeader>
                  <DialogTitle className="text-center">Imagery Session</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-gray-300">
                  <p className="mb-4">
                    Select visualization prompts to focus on during your imagery session. 
                    Check the ones that resonate with you today.
                  </p>
                  <p>
                    You can customize which prompts appear here in the Imagery Settings.
                  </p>
                </DialogDescription>
                <Button
                  className="w-full bg-white text-black hover:bg-gray-200"
                  onClick={() => setOpenIntroDialog(false)}
                >
                  Start Session
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageryJournal;
