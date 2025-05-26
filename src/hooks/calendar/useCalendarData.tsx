
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export interface CalendarData {
  date: Date;
  hasEntries: boolean;
  entryCount: number;
  averageRating: number | null;
}

export function useCalendarData() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarData, setCalendarData] = useState<CalendarData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(true);
  
  const { user } = useAuth();
  
  // Set up mounted ref for cleanup
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  // Load calendar data for the current month
  useEffect(() => {
    const loadCalendarData = async () => {
      if (!user) {
        if (mountedRef.current) {
          setCalendarData([]);
          setIsLoading(false);
        }
        return;
      }
      
      if (mountedRef.current) {
        setIsLoading(true);
      }
      
      try {
        // Get all days in the current month
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
        
        // Format dates for query - use the same format as fetchEntriesForDate
        const startDate = format(monthStart, "yyyy-MM-dd") + "T00:00:00";
        const endDate = format(monthEnd, "yyyy-MM-dd") + "T23:59:59.999Z";
        
        console.log(`Loading calendar data from ${startDate} to ${endDate} for user ${user.id}`);
        
        // Query Supabase for entries in this month using the standard format
        const { data: entries, error } = await supabase
          .from('journal_entries')
          .select('*')  // Select all columns
          .eq('user_id', user.id)
          .gte('timestamp', startDate)
          .lte('timestamp', endDate);
          
        if (error) {
          console.error("Error fetching calendar data:", error);
          throw error;
        }
        
        console.log(`Found ${entries?.length || 0} entries for the month`);
        
        // Debug log some entries to see their structure
        if (entries && entries.length > 0) {
          console.log("Sample entry:", entries[0]);
        }
        
        // Process entries to count by date and calculate average ratings
        const entryCounts: { [key: string]: number } = {};
        const ratingTotals: { [key: string]: number } = {};
        const ratingCounts: { [key: string]: number } = {};
        
        entries?.forEach(entry => {
          try {
            // Ensure we have a valid date format to use as key
            const timestamp = entry.timestamp;
            
            if (!timestamp) {
              console.log("Entry missing timestamp:", entry);
              return;
            }
            
            // Extract the date part only (YYYY-MM-DD) to match with calendar days
            const dateKey = timestamp.substring(0, 10);
            
            // Count entries
            entryCounts[dateKey] = (entryCounts[dateKey] || 0) + 1;
            
            // Get content field
            let content = entry.content;
            if (typeof content === 'string') {
              try {
                content = JSON.parse(content);
              } catch (e) {
                console.error("Error parsing content:", e);
                return;
              }
            }
            
            if (!content || typeof content !== 'object') {
              return;
            }
            
            // Extract ratings using multiple strategies
            let rating: number | null = null;
            
            // Direct rating property
            if ('rating' in content && typeof content.rating === 'number') {
              rating = content.rating;
              console.log(`Found direct rating ${rating} for ${dateKey}`);
            } 
            // Game journal with postGameRating
            else if ('postGameRating' in content && typeof content.postGameRating === 'number') {
              rating = content.postGameRating;
              console.log(`Found postGameRating ${rating} for ${dateKey}`);
            }
            // Training entries with questions array
            else if ('questions' in content && Array.isArray(content.questions)) {
              const ratingQuestions = content.questions.filter((q: any) => 
                q && typeof q === 'object' && 'rating' in q && typeof q.rating === 'number'
              );
              
              if (ratingQuestions.length > 0) {
                const sum = ratingQuestions.reduce((total: number, q: any) => total + q.rating, 0);
                rating = sum / ratingQuestions.length;
                console.log(`Found average rating ${rating} from ${ratingQuestions.length} questions for ${dateKey}`);
              }
            }
            // Look for ratings in answers
            else if ('answers' in content && typeof content.answers === 'object' && content.answers !== null) {
              const answers = content.answers;
              const ratingAnswers = Object.entries(answers).filter(([key, value]: [string, any]) => {
                return (key.toLowerCase().includes('rating') || key.toLowerCase().includes('score')) && 
                       typeof value === 'string' && !isNaN(parseInt(value));
              });
              
              if (ratingAnswers.length > 0) {
                const sum = ratingAnswers.reduce((total, [_, value]) => total + parseInt(value as string), 0);
                rating = sum / ratingAnswers.length;
                console.log(`Found average rating ${rating} from answers for ${dateKey}`);
              }
            }
            // Look for postgame data
            else if ('postgame' in content && typeof content.postgame === 'object' && content.postgame !== null) {
              const postgame = content.postgame;
              if ('rating' in postgame && typeof postgame.rating === 'number') {
                rating = postgame.rating;
                console.log(`Found postgame rating ${rating} for ${dateKey}`);
              }
            }
            
            if (rating !== null && typeof rating === 'number' && !isNaN(rating)) {
              ratingTotals[dateKey] = (ratingTotals[dateKey] || 0) + rating;
              ratingCounts[dateKey] = (ratingCounts[dateKey] || 0) + 1;
            }
          } catch (error) {
            console.error("Error processing entry for calendar:", error);
          }
        });
        
        // Debug the collected rating data
        console.log("Entry counts by date:", entryCounts);
        console.log("Rating totals by date:", ratingTotals);
        console.log("Rating counts by date:", ratingCounts);
        
        // Create calendar data with entry information and average ratings
        const calendarData = daysInMonth.map(date => {
          const dateKey = format(date, "yyyy-MM-dd");
          const entryCount = entryCounts[dateKey] || 0;
          
          // Calculate average rating for the date if ratings exist
          let averageRating = null;
          if (ratingCounts[dateKey] && ratingCounts[dateKey] > 0) {
            averageRating = ratingTotals[dateKey] / ratingCounts[dateKey];
          }
          
          return {
            date,
            hasEntries: entryCount > 0,
            entryCount,
            averageRating
          };
        });
        
        console.log("Calendar days with entries:", calendarData.filter(d => d.hasEntries).length);
        console.log("Calendar days with ratings:", calendarData.filter(d => d.averageRating !== null).length);
        
        if (mountedRef.current) {
          setCalendarData(calendarData);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to load calendar data:", error);
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };
    
    loadCalendarData();
  }, [currentMonth, user]);
  
  // Handle date selection - FIX THE DATE NAVIGATION BUG HERE
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    
    console.log("Calendar date selected:", date);
    console.log("Date to navigate to:", format(date, "yyyy-MM-dd"));
    
    // Format the date to YYYY-MM-DD for the URL - this should be the exact date clicked
    const formattedDate = format(date, "yyyy-MM-dd");
    
    // Navigate to the journal page with the selected date
    navigate(`/journal/${formattedDate}`, {
      state: {
        displayDate: format(date, "MMMM d, yyyy")
      }
    });
  };
  
  // Go to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };
  
  // Go to next month
  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };
  
  // Go to today
  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  return {
    currentMonth,
    selectedDate,
    calendarData,
    isLoading,
    handleDateSelect,
    goToPreviousMonth,
    goToNextMonth,
    goToToday
  };
}
