
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Trash2 } from "lucide-react";
import JournalEntryPreview, { JournalEntry } from "./JournalEntryPreview";
import { useMemo } from "react";

interface Question {
  id: string;
  text: string;
  enabled: boolean;
  section?: "pregame" | "postgame" | string;
  isCustom?: boolean;
}

interface CompletedActivitiesProps {
  activities: string[];
  todayEntries: JournalEntry[];
  expandedEntries: {[key: string]: boolean};
  toggleExpanded: (activityType: string) => void;
  handleDeleteActivity: (activityType: string) => void;
  gameQuestions: Question[];
  inProgressEntriesEmpty: boolean;
}

export const CompletedActivities = ({
  activities,
  todayEntries,
  expandedEntries,
  toggleExpanded,
  handleDeleteActivity,
  gameQuestions,
  inProgressEntriesEmpty
}: CompletedActivitiesProps) => {
  
  // Use useMemo to prevent unnecessary recalculations
  const activityEntries = useMemo(() => {
    // Map each activity to its latest entry
    const entriesByActivity = new Map<string, JournalEntry>();
    
    // Fill the map with the most recent entry for each activity
    todayEntries.forEach(entry => {
      if (!entry || !entry.type || !entry.timestamp) return;
      
      const existingEntry = entriesByActivity.get(entry.type);
      if (!existingEntry || new Date(entry.timestamp) > new Date(existingEntry.timestamp)) {
        entriesByActivity.set(entry.type, entry);
      }
    });
    
    return entriesByActivity;
  }, [todayEntries]);
  
  return (
    <div className="w-full mb-4">
      <h3 className="text-xl font-bold text-center mb-3">Completed Activities</h3>
      {activities.length > 0 ? (
        activities.map((activity, index) => {
          const latestEntry = activityEntries.get(activity);
          if (!latestEntry) return null;
          
          return (
            <div 
              key={`activity-${activity}-${latestEntry.timestamp || index}`} 
              className="bg-[#193175] border border-[#3056b7] rounded-lg p-2 mb-4"
              data-activity-type={activity}
            >
              <div className="flex items-center justify-between">
                <div className="bg-[#193175] text-white font-bold px-4 py-2 rounded-lg flex-1 text-center">
                  {activity === "Game" && latestEntry.content?.opposingTeam 
                    ? `Game vs ${latestEntry.content.opposingTeam}` 
                    : activity}
                </div>
                <div className="flex items-center">
                  <Link 
                    to={`/${activity.toLowerCase()}-journal-entries`} 
                    state={{ activity: activity }}
                    className="bg-[#193175] text-white px-3 py-1 rounded-lg flex items-center ml-2"
                  >
                    see journal →
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="text-red-400 hover:text-red-600 p-1 h-auto ml-1"
                    onClick={() => handleDeleteActivity(activity)}
                    aria-label={`Delete ${activity} journal`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <JournalEntryPreview 
                entry={latestEntry}
                isExpanded={expandedEntries[activity] || false}
                onToggleExpand={() => toggleExpanded(activity)}
                gameQuestions={gameQuestions}
              />
            </div>
          );
        })
      ) : (
        inProgressEntriesEmpty && (
          <div className="text-center py-6">
            <p className="text-gray-400">No activities logged yet today</p>
            <p className="text-gray-400 mt-2">Click the <span className="inline-flex items-center"><Plus className="h-4 w-4 mr-1" /> button</span> to add a new activity</p>
            <div className="mt-4">
              <Link to="/calendar" className="inline-flex items-center text-blue-400 hover:underline">
                <Calendar className="h-5 w-5 mr-2" />
                See past journal entries in the calendar
              </Link>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default CompletedActivities;
