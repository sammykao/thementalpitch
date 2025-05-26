
import React from "react";
import NavigationBar from "@/components/ui/navigation-bar";
import { Button } from "@/components/ui/button";
import { useCalendarData } from "@/hooks/calendar/useCalendarData";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import CalendarLegend from "@/components/calendar/CalendarLegend";
import { format } from "date-fns";

const Calendar = () => {
  const {
    currentMonth,
    calendarData,
    isLoading,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    handleDateSelect
  } = useCalendarData();
  
  // Format today's date for display
  const formattedToday = format(new Date(), "MMMM d");

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#1A1F2C] text-white">
      <div className="w-full max-w-md px-4 py-8 flex flex-col items-center">
        <div className="w-full mb-8">
          <div className="bg-[#193175] rounded-lg p-4 w-full flex flex-col items-center">
            {/* Calendar Header */}
            <CalendarHeader formattedToday={formattedToday} />
            
            {/* Today button */}
            <Button 
              onClick={goToToday}
              className="mb-4 bg-blue-600 hover:bg-blue-700"
            >
              Jump to Today
            </Button>
            
            {/* Calendar Grid */}
            <CalendarGrid
              currentDate={currentMonth}
              previousMonth={goToPreviousMonth}
              nextMonth={goToNextMonth}
              journalEntries={calendarData}
              isLoading={isLoading}
              handleDateSelect={handleDateSelect}
            />
            
            {/* Legend for calendar colors */}
            <CalendarLegend />
            
            {/* Navigation Bar */}
            <div className="w-full mt-auto">
              <NavigationBar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
