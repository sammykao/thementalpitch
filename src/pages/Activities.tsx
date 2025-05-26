import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import NavigationBar from "@/components/ui/navigation-bar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client"; 

interface Activity {
  type: string;
  id: string;
}

const Activities = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State for storing activities for the selected date
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get the selected date from location state or use today's date
  const selectedDate = location.state?.selectedDate || format(new Date(), "yyyy-MM-dd");
  const displayDate = location.state?.displayDate || format(new Date(), "MMMM d");
  
  // For navigation - determine where to go back to
  const [goBackPath, setGoBackPath] = useState("/journal");
  
  useEffect(() => {
    // If we have a selectedDate that's not today, we should go back to the daily journal
    if (location.state?.selectedDate && 
        location.state.selectedDate !== format(new Date(), "yyyy-MM-dd")) {
      setGoBackPath(`/daily-journal/${location.state.selectedDate}`);
    }
    
    // Load activities for the selected date
    loadActivities();
  }, [location.state, user]);

  // Load activities for the selected date from both Supabase and localStorage
  const loadActivities = async () => {
    setIsLoading(true);
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    try {
      // Attempt to load from Supabase first
      const { data: supabaseEntries, error } = await supabase
        .from('journal_entries')
        .select('*')
        .gte('timestamp', `${selectedDate}T00:00:00`)
        .lte('timestamp', `${selectedDate}T23:59:59.999Z`);
      
      if (error) {
        console.error("Error fetching activities from Supabase:", error);
      }
      
      // Also load from localStorage as a fallback
      const allEntries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
      
      // Filter entries for the selected date and current user
      const localEntries = allEntries.filter((entry: any) => {
        try {
          // Parse the timestamp to get the entry date
          const entryDate = format(parseISO(entry.timestamp), "yyyy-MM-dd");
          
          // Check if the entry belongs to selected date and current user
          return entryDate === selectedDate && entry.userEmail === user.email;
        } catch (error) {
          console.error("Error parsing entry timestamp:", error, entry);
          return false;
        }
      });
      
      // Combine both sources, removing duplicates
      const supabaseTimestamps = supabaseEntries ? new Set(supabaseEntries.map(e => e.timestamp)) : new Set();
      const combinedEntries = [...(supabaseEntries || [])];
      
      for (const entry of localEntries) {
        if (!supabaseTimestamps.has(entry.timestamp)) {
          combinedEntries.push(entry);
        }
      }
      
      // Map entries to activities
      const dateActivities = combinedEntries.map((entry: any) => ({
        type: entry.type.toUpperCase(),
        id: entry.timestamp // Use timestamp as a unique identifier
      }));
      
      setActivities(dateActivities);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading activities:", error);
      setIsLoading(false);
    }
  };
  
  // Handle viewing a specific activity journal
  const handleViewJournal = (activityType: string) => {
    // Navigate to the daily journal with the selected date
    navigate(goBackPath);
  };
  
  // Handle deleting an activity
  const handleDeleteActivity = async (activityId: string, activityType: string) => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "You need to be logged in to delete activities.",
        duration: 3000
      });
      return;
    }
    
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('timestamp', activityId);
      
      if (error) {
        console.error("Error deleting activity from Supabase:", error);
        toast({
          title: "Error",
          description: "Failed to delete the activity. Please try again.",
          duration: 3000
        });
        return;
      }
      
      // Also delete from localStorage
      const allEntries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
      const updatedEntries = allEntries.filter((entry: any) => entry.timestamp !== activityId);
      localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
      
      // Update the activities state
      setActivities(activities.filter(activity => activity.id !== activityId));
      
      // Show a toast notification
      toast({
        title: `${activityType} activity deleted`,
        description: "The activity has been removed from your journal",
        duration: 3000
      });
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast({
        title: "Error",
        description: "Failed to delete the activity. Please try again.",
        duration: 3000
      });
    }
  };

  // Helper function to check if an activity type exists in the activities array
  const hasActivityType = (type: string): boolean => {
    return activities.some(a => a.type === type);
  };

  // Helper function to find an activity by type
  const findActivityByType = (type: string): Activity | undefined => {
    return activities.find(a => a.type === type);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#1A1F2C] text-white">
      <div className="w-full max-w-md px-4 py-8 flex flex-col items-center">
        <div className="w-full mb-8">
          <div className="bg-[#193175] rounded-lg p-4 w-full flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">YOUR JOURNAL</h2>
            <div className="bg-[#3056b7] px-4 py-2 rounded-lg mb-6 text-center">
              {displayDate}
            </div>
            
            <div className="w-full mb-6">
              <Button 
                className="w-full bg-white text-black hover:bg-gray-200 font-bold rounded-full mb-4"
              >
                Activities
              </Button>
            </div>
            
            {isLoading ? (
              <div className="w-full text-center py-4">
                <p className="text-gray-400">Loading activities...</p>
              </div>
            ) : (
              <div className="w-full mb-4 space-y-4">
                {hasActivityType("GAME") ? (
                  <div className="flex">
                    <Button 
                      className="flex-1 mr-2 bg-[#193175] border-2 border-white text-white font-bold"
                    >
                      GAME
                    </Button>
                    <div className="flex">
                      <div 
                        className="bg-[#193175] text-white px-3 py-1 rounded-lg flex items-center cursor-pointer mr-2"
                        onClick={() => handleViewJournal("GAME")}
                      >
                        see journal →
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => {
                          const activity = findActivityByType("GAME");
                          if (activity) {
                            handleDeleteActivity(activity.id, "Game");
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex">
                    <Button 
                      className="flex-1 mr-2 bg-[#193175] border-2 border-white text-white font-bold"
                    >
                      GAME
                    </Button>
                    <div className="bg-[#193175] text-white px-3 py-1 rounded-lg flex items-center">
                      see journal →
                    </div>
                  </div>
                )}
                
                {hasActivityType("REHAB") ? (
                  <div className="flex">
                    <Button 
                      className="flex-1 mr-2 bg-[#193175] border-2 border-white text-white font-bold"
                    >
                      REHAB
                    </Button>
                    <div className="flex">
                      <div 
                        className="bg-[#193175] text-white px-3 py-1 rounded-lg flex items-center cursor-pointer mr-2"
                        onClick={() => handleViewJournal("REHAB")}
                      >
                        see journal →
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => {
                          const activity = findActivityByType("REHAB");
                          if (activity) {
                            handleDeleteActivity(activity.id, "Rehab");
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex">
                    <Button 
                      className="flex-1 mr-2 bg-[#193175] border-2 border-white text-white font-bold"
                    >
                      REHAB
                    </Button>
                    <div className="bg-[#193175] text-white px-3 py-1 rounded-lg flex items-center">
                      see journal →
                    </div>
                  </div>
                )}
                
                {hasActivityType("PRACTICE") || hasActivityType("TRAINING") ? (
                  <div className="flex">
                    <Button 
                      className="flex-1 mr-2 bg-[#193175] border-2 border-white text-white font-bold"
                    >
                      PRACTICE
                    </Button>
                    <div className="flex">
                      <div 
                        className="bg-[#193175] text-white px-3 py-1 rounded-lg flex items-center cursor-pointer mr-2"
                        onClick={() => handleViewJournal("PRACTICE")}
                      >
                        see journal →
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => {
                          const activity = findActivityByType("PRACTICE") || findActivityByType("TRAINING");
                          if (activity) {
                            handleDeleteActivity(activity.id, "Practice");
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex">
                    <Button 
                      className="flex-1 mr-2 bg-[#193175] border-2 border-white text-white font-bold"
                    >
                      PRACTICE
                    </Button>
                    <div className="bg-[#193175] text-white px-3 py-1 rounded-lg flex items-center">
                      see journal →
                    </div>
                  </div>
                )}
                
                {hasActivityType("LIFT") ? (
                  <div className="flex">
                    <Button 
                      className="flex-1 mr-2 bg-[#193175] border-2 border-white text-white font-bold"
                    >
                      LIFT
                    </Button>
                    <div className="flex">
                      <div 
                        className="bg-[#193175] text-white px-3 py-1 rounded-lg flex items-center cursor-pointer mr-2"
                        onClick={() => handleViewJournal("LIFT")}
                      >
                        see journal →
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => {
                          const activity = findActivityByType("LIFT");
                          if (activity) {
                            handleDeleteActivity(activity.id, "Lift");
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex">
                    <Button 
                      className="flex-1 mr-2 bg-[#193175] border-2 border-white text-white font-bold"
                    >
                      LIFT
                    </Button>
                    <div className="bg-[#193175] text-white px-3 py-1 rounded-lg flex items-center">
                      see journal →
                    </div>
                  </div>
                )}
                
                <Link 
                  to="/new-activity"
                  state={{ selectedDate, displayDate }}
                  className="w-full"
                >
                  <Button 
                    className="w-full bg-white text-black hover:bg-gray-200 font-bold"
                  >
                    NEW ACTIVITY
                  </Button>
                </Link>
              </div>
            )}
            
            <div className="w-full flex justify-between mt-auto">
              <Link to="/calendar">
                <Button variant="outline" className="bg-[#193175] text-white border-[#3056b7] hover:bg-[#254086] rounded-lg p-2 h-14 w-14">
                  <Calendar className="h-6 w-6" />
                </Button>
              </Link>
              
              <Link 
                to="/new-activity"
                state={{ selectedDate, displayDate }}
              >
                <Button variant="outline" className="bg-[#193175] text-white border-[#3056b7] hover:bg-[#254086] rounded-lg p-2 h-14 w-14">
                  <Plus className="h-6 w-6" />
                </Button>
              </Link>
            </div>
            
            {/* Add NavigationBar component */}
            <div className="w-full mt-auto">
              <NavigationBar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activities;
