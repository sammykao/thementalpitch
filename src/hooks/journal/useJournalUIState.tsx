
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useJournalUIState() {
  const [expandedEntries, setExpandedEntries] = useState<{[key: string]: boolean}>({});
  const navigate = useNavigate();
  
  // Toggle the expanded state of an entry
  const toggleExpanded = (index: number) => {
    setExpandedEntries(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Navigate to add entry page with the selected date
  const handleAddEntry = (selectedDate?: string, displayDate?: string) => {
    navigate('/new-activity', {
      state: { 
        selectedDate,
        displayDate
      }
    });
  };

  return {
    expandedEntries,
    toggleExpanded,
    handleAddEntry
  };
}
