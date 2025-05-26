
import { format } from "date-fns";
import { useParams, Link } from "react-router-dom";
import { useJournalData } from "@/hooks/useJournalData";
import InProgressEntries from "@/components/journal/InProgressEntries";
import CompletedActivities from "@/components/journal/CompletedActivities";
import DeleteConfirmationDialog from "@/components/journal/DeleteConfirmationDialog";
import JournalLayout from "@/components/journal/JournalLayout";
import JournalLoading from "@/components/journal/JournalLoading";
import JournalError from "@/components/journal/JournalError";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import EntryList from "@/components/journal/EntryList";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarIcon, Home, PlusCircle } from "lucide-react";
import { useJournalEntryLoader } from "@/hooks/journal/useJournalEntryLoader";
import { useJournalUIState } from "@/hooks/journal/useJournalUIState";
import { useJournalLocalStorage } from "@/hooks/journal/useLocalStorage";
import { useJournalEntryDeletion } from "@/hooks/journal/useJournalEntryDeletion";

const Journal = () => {
  const todayDate = new Date();
  const today = format(todayDate, "MMMM d");
  const { isAuthenticated } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);
  const { date } = useParams<{ date?: string }>();

  const paramDate = date ?? format(todayDate, "yyyy-MM-dd");
  
  // Hook for loading questions
  const { 
    trainingQuestions, 
    rehabQuestions, 
    liftQuestions, 
    gameQuestions 
  } = useJournalLocalStorage();

  // Set an extremely short initial loading time to show content fast
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 300); // Very short initial loading (300ms)
    
    return () => clearTimeout(timer);
  }, []);

  // Load journal entries for the selected date or today
  const {
    entries,
    setEntries,
    displayDate,
    isLoading: entriesLoading,
    loadingComplete: entriesLoadingComplete,
    selectedDate
  } = useJournalEntryLoader(date);
  
  const { handleDeleteEntry } = useJournalEntryDeletion();
  const { expandedEntries, toggleExpanded, handleAddEntry } = useJournalUIState();
  
  // For standard Journal mode when no date is provided
  const {
    todayEntries,
    activities,
    inProgressEntries,
    deleteDialogOpen,
    activityToDelete,
    isLoading: mainLoading,
    loadingError,
    toggleExpanded: toggleMainExpanded,
    handleDeleteActivity,
    confirmDelete,
    setDeleteDialogOpen
  } = useJournalData();

  // Define these functions early so they're available throughout the component
  const deleteEntry = (entryIndex: number) => {
    handleDeleteEntry(entries, entryIndex, setEntries);
  };
  
  const handleAddNewEntry = () => {
    handleAddEntry(selectedDate, displayDate);
  };

  // Basic loading indicator during initial render
  if (pageLoading) {
    return (
      <JournalLayout title="Your" today={today} isLoading={true}>
        <JournalLoading />
      </JournalLayout>
    );
  }

  // If date param is provided, show entries for that specific date
  if (paramDate) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-[#1A1F2C] text-white">
        <div className="w-full max-w-md px-4 py-8 flex flex-col items-center">
          <div className="w-full mb-8">
            {/* Removed blue container - now seamless blue background */}
            <div className="w-full flex flex-col items-center">
              {/* Daily Journal Header */}
              <div className="w-full flex items-center justify-between mb-4">
                <Link to="/calendar">
                  <Button variant="ghost" className="text-white p-0 h-auto">
                    <ArrowLeft className="h-6 w-6" />
                  </Button>
                </Link>
                <h2 className="text-xl font-bold">DAILY JOURNAL</h2>
                <div className="w-6"></div> {/* Empty div for spacing */}
              </div>
              
              <div className="bg-[#3056b7] px-4 py-2 rounded-lg mb-6 text-center w-full">
                {displayDate}
              </div>
              
              <div className="w-full overflow-y-auto">
                <EntryList
                  entries={entries}
                  isLoading={entriesLoading}
                  expandedEntries={expandedEntries}
                  toggleExpanded={toggleExpanded}
                  handleDeleteEntry={deleteEntry}
                  handleAddEntry={handleAddNewEntry}
                  trainingQuestions={trainingQuestions}
                  rehabQuestions={rehabQuestions}
                  liftQuestions={liftQuestions}
                  gameQuestions={gameQuestions}
                />
              </div>
              
              {/* Home Button */}
              <div className="w-full mt-4 flex justify-center">
                <Link to="/">
                  <Button 
                    className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                  >
                    <Home className="h-5 w-5" />
                    Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Footer Actions - Moved higher and changed to gray */}
          <div className="fixed bottom-16 w-full max-w-md px-4 flex justify-between">
            <Link to="/calendar">
              <Button 
                className="bg-gray-500 hover:bg-gray-600 rounded-full h-14 w-14 shadow-lg flex items-center justify-center"
              >
                <CalendarIcon className="h-7 w-7" />
              </Button>
            </Link>
            
            <Button 
              onClick={() => handleAddNewEntry()} 
              className="bg-gray-500 hover:bg-gray-600 rounded-full h-14 w-14 shadow-lg flex items-center justify-center"
            >
              <PlusCircle className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

 
  // Error state
  if (loadingError) {
    return (
      <JournalLayout title="Your" today={today}>
        <JournalError error={loadingError} />
      </JournalLayout>
    );
  }

  // Main journal content (standard journal mode)
  return (
    <JournalLayout title="Your" today={today}>
      {/* In Progress Activities Section */}
      <InProgressEntries entries={inProgressEntries} />
      
      {/* Completed Activities Section - if we have no activities, show something */}
      {activities.length > 0 ? (
        <CompletedActivities
          activities={activities}
          todayEntries={todayEntries}
          expandedEntries={expandedEntries}
          toggleExpanded={toggleMainExpanded}
          handleDeleteActivity={handleDeleteActivity}
          gameQuestions={gameQuestions}
          inProgressEntriesEmpty={inProgressEntries.length === 0}
        />
      ) : (
        <div className="text-center py-4 w-full">
          <p className="text-gray-300">No completed activities for today.</p>
          <p className="text-sm text-gray-400 mt-2">Create a new activity using the + button below.</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        activityType={activityToDelete}
        onConfirm={confirmDelete}
      />
      
      {/* Home Button */}
      <div className="w-full mt-4 flex justify-center">
        <Link to="/">
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
          >
            <Home className="h-5 w-5" />
            Home
          </Button>
        </Link>
      </div>
      
      {/* Footer Actions - Moved higher and changed to gray */}
      <div className="fixed bottom-16 w-full max-w-md px-4 flex justify-between">
        <Link to="/calendar">
          <Button 
            className="bg-gray-500 hover:bg-gray-600 rounded-full h-14 w-14 shadow-lg flex items-center justify-center"
          >
            <CalendarIcon className="h-7 w-7" />
          </Button>
        </Link>
        
        <Link to="/new-activity">
          <Button 
            className="bg-gray-500 hover:bg-gray-600 rounded-full h-14 w-14 shadow-lg flex items-center justify-center"
          >
            <PlusCircle className="h-8 w-8" />
          </Button>
        </Link>
      </div>
    </JournalLayout>
  );
};

export default Journal;
