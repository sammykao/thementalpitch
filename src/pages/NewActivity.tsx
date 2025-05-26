
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import NavigationBar from "@/components/ui/navigation-bar";
import { format } from "date-fns";

const NewActivity = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the selected date from location state or use today's date
  const selectedDate = location.state?.selectedDate || format(new Date(), "yyyy-MM-dd");
  const displayDate = location.state?.displayDate || format(new Date(), "MMMM d");
  
  // For navigation - determine where to go back to
  const [goBackPath, setGoBackPath] = useState("/journal");
  
  useEffect(() => {
    // If we have a selectedDate that's not today, we should go back to the journal with date param
    if (location.state?.selectedDate && 
        location.state.selectedDate !== format(new Date(), "yyyy-MM-dd")) {
      setGoBackPath(`/journal/${location.state.selectedDate}`);
    }
  }, [location.state]);
  
  const handleActivitySelection = (activity: string) => {
    // Navigate to the appropriate journal page based on activity
    // and pass along the selected date
    switch(activity) {
      case "GAME":
        navigate("/game-journal", { 
          state: { selectedDate, displayDate } 
        });
        break;
      case "TRAINING":
        navigate("/training-journal", { 
          state: { selectedDate, displayDate } 
        });
        break;
      case "REHAB":
        navigate("/rehab-journal", { 
          state: { selectedDate, displayDate } 
        });
        break;
      case "LIFT":
        navigate("/lift-journal", { 
          state: { selectedDate, displayDate } 
        });
        break;
      case "IMAGERY":
        navigate("/imagery-journal", { 
          state: { selectedDate, displayDate } 
        });
        break;
      case "FOOD":
        navigate("/food-journal", { 
          state: { selectedDate, displayDate } 
        });
        break;
      default:
        // In a real app, you would handle this case
        break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#1A1F2C] text-white">
      <div className="w-full max-w-md px-4 py-8 flex flex-col items-center">
        <div className="w-full mb-8">
          <div className="bg-[#193175] rounded-lg p-4 w-full flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-4">
              <Link to={goBackPath}>
                <Button variant="ghost" className="text-white p-0 h-auto">
                  <ArrowLeft className="h-6 w-6" />
                </Button>
              </Link>
              <h2 className="text-2xl font-bold">YOUR JOURNAL</h2>
              <div className="w-6"></div> {/* Empty div for spacing */}
            </div>
            
            <div className="bg-[#3056b7] px-4 py-2 rounded-lg mb-6 text-center w-full">
              {displayDate}
            </div>
            
            
            
            <div className="w-full mb-4 space-y-4">
              <Button 
                className="w-full bg-[#193175] border-2 border-white text-white font-bold"
                onClick={() => handleActivitySelection("GAME")}
              >
                GAME
              </Button>
              
              <Button 
                className="w-full bg-[#193175] border-2 border-white text-white font-bold"
                onClick={() => handleActivitySelection("TRAINING")}
              >
                TRAINING
              </Button>
              
              <Button 
                className="w-full bg-[#193175] border-2 border-white text-white font-bold"
                onClick={() => handleActivitySelection("REHAB")}
              >
                REHAB
              </Button>
              
              <Button 
                className="w-full bg-[#193175] border-2 border-white text-white font-bold"
                onClick={() => handleActivitySelection("LIFT")}
              >
                LIFT
              </Button>
              
              <Button 
                className="w-full bg-[#193175] border-2 border-white text-white font-bold"
                onClick={() => handleActivitySelection("IMAGERY")}
              >
                IMAGERY
              </Button>
              
              <Button 
                className="w-full bg-[#193175] border-2 border-white text-white font-bold"
                onClick={() => handleActivitySelection("FOOD")}
              >
                FOOD
              </Button>
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

export default NewActivity;
