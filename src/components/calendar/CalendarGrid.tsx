
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { CalendarData } from "@/hooks/calendar/useCalendarData";

interface CalendarGridProps {
  currentDate: Date;
  previousMonth: () => void;
  nextMonth: () => void;
  journalEntries: CalendarData[];
  isLoading: boolean;
  handleDateSelect: (date: Date) => void;
}

const CalendarGrid = ({ 
  currentDate, 
  previousMonth, 
  nextMonth, 
  journalEntries, 
  isLoading,
  handleDateSelect
}: CalendarGridProps) => {
  const currentMonth = format(currentDate, "MMMM");
  const currentYear = format(currentDate, "yyyy");

  // Generate days for the current month
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Get color for calendar day based on entry count and ratings
  const getColor = (day: number) => {
    // Create a date for the current day
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    // Find entry for this date in calendarData
    const dayEntry = journalEntries.find(entry => 
      isSameDay(entry.date, dateToCheck)
    );
    
    console.log(`Day ${day}:`, dayEntry ? {
      hasEntries: dayEntry.hasEntries,
      entryCount: dayEntry.entryCount,
      averageRating: dayEntry.averageRating
    } : 'No entry');
    
    if (!dayEntry || !dayEntry.hasEntries) {
      return "bg-gray-500"; // No entries
    }
    
    // If entries exist but no ratings available, show blue
    if (dayEntry.entryCount > 0 && dayEntry.averageRating === null) {
      return "bg-blue-500"; 
    }
    
    // Color based on rating ranges
    if (dayEntry.averageRating !== null) {
      if (dayEntry.averageRating >= 8) {
        return "bg-green-500"; // 8-10 rating: green
      } else if (dayEntry.averageRating >= 6) {
        return "bg-yellow-500"; // 6-7 rating: yellow
      } else if (dayEntry.averageRating >= 4) {
        return "bg-orange-500"; // 4-5 rating: orange
      } else {
        return "bg-red-500"; // 0-3 rating: red
      }
    }
    
    // Default color when we don't know
    return "bg-gray-500";
  };

  // Handle clicking on a day - ENSURE WE CREATE THE CORRECT DATE
  const handleDayClick = (day: number) => {
    // Create the selected date - make sure this creates the correct date
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    console.log(`Clicked day ${day}, created date:`, selectedDate);
    console.log(`Formatted date:`, format(selectedDate, "yyyy-MM-dd"));
    
    // Use the handler from props
    handleDateSelect(selectedDate);
  };

  // Debug entire dataset on render
  console.log("All calendar entries:", journalEntries);
  console.log("Calendar entries count:", journalEntries.length);
  console.log("Entries with ratings:", journalEntries.filter(e => e.averageRating !== null).length);
  console.log("Entries with journal entries:", journalEntries.filter(e => e.hasEntries).length);

  if (isLoading) {
    return <div className="text-center py-4">Loading calendar data...</div>;
  }

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-2">
        <Button 
          variant="ghost" 
          onClick={previousMonth} 
          className="text-white p-1"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="bg-gray-700 inline-block px-6 py-1 rounded-md">
          {currentMonth} {currentYear}
        </div>
        <Button 
          variant="ghost" 
          onClick={nextMonth} 
          className="text-white p-1"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-2 text-center">
        <div>S</div>
        <div>M</div>
        <div>T</div>
        <div>W</div>
        <div>T</div>
        <div>F</div>
        <div>S</div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {/* Add empty cells for days before the first day of the month */}
        {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() }, (_, i) => (
          <div key={`empty-${i}`} className="h-9 w-9"></div>
        ))}
        
        {days.map((day) => {
          // Add indicator for current day
          const isToday = isSameDay(
            new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
            new Date()
          );
          
          return (
            <div 
              key={day} 
              className={`${getColor(day)} rounded-full h-9 w-9 flex items-center justify-center text-sm font-bold cursor-pointer hover:opacity-80 transition-all hover:scale-110 ${
                isToday ? 'ring-2 ring-white' : ''
              }`}
              onClick={() => handleDayClick(day)}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
