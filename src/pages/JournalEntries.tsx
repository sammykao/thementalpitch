
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useJournalEntriesLoader } from "@/hooks/journal/useJournalEntriesLoader";
import JournalEntryRenderer from "@/components/journal/entries/JournalEntryRenderer";

const JournalEntries = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activityType, setActivityType] = useState("");
  
  // Get activity type from location state
  useState(() => {
    if (!location.state || !location.state.activity) {
      navigate("/journal");
      return;
    }
    
    setActivityType(location.state.activity);
  });
  
  // Load entries and questions using our refactored hook
  const {
    entries,
    trainingQuestions,
    rehabQuestions,
    liftQuestions,
    gameQuestions,
    isLoading
  } = useJournalEntriesLoader(activityType);

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#1A1F2C] text-white">
      <div className="w-full max-w-md px-4 py-8 flex flex-col items-center">
        <div className="w-full mb-8">
          <div className="bg-[#193175] rounded-lg p-4 w-full flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-4">
              <Link to="/journal">
                <Button variant="ghost" className="text-white p-0 h-auto">
                  <ArrowLeft className="h-6 w-6" />
                </Button>
              </Link>
              <h2 className="text-2xl font-bold">
                {activityType === "Game" && entries.length > 0 && entries[0].content.opposingTeam
                  ? `GAME vs ${entries[0].content.opposingTeam}`
                  : `${activityType} JOURNAL`}
              </h2>
              <div className="w-6"></div> {/* Empty div for spacing */}
            </div>
            
            <div className="w-full overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-10">
                  <p className="text-gray-400">Loading journal entries...</p>
                </div>
              ) : entries.length > 0 ? (
                entries.map((entry, index) => (
                  <JournalEntryRenderer
                    key={index}
                    entry={entry}
                    trainingQuestions={trainingQuestions}
                    rehabQuestions={rehabQuestions}
                    liftQuestions={liftQuestions}
                    gameQuestions={gameQuestions}
                  />
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-400 mb-4">No {activityType.toLowerCase()} journal entries yet</p>
                  <Link to="/new-activity">
                    <Button className="bg-[#3056b7] hover:bg-[#2a4da3]">
                      Add Entry
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalEntries;
