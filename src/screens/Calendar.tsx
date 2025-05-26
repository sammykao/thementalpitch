import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';
import { ArrowLeft, ChevronLeft, ChevronRight, Home } from 'lucide-react-native';

const Calendar = () => {
  const navigation = useNavigation();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Format today's date for display
  const formattedToday = format(new Date(), 'MMMM d');

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    navigation.navigate('Journal', {
      date: format(date, 'yyyy-MM-dd'),
      displayDate: format(date, 'MMMM d, yyyy')
    });
  };

  // Generate days for the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get the day of the week for the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const startDay = monthStart.getDay();
  
  // Create empty slots for days before the first day of the month
  const emptyDays = Array.from({ length: startDay }, (_, i) => i);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Journal')}>
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>YOUR JOURNAL</Text>
          <View style={{ width: 24 }} />
        </View>
        
        {/* Date display */}
        <View style={styles.dateHeader}>
          <Text style={styles.dateText}>Today, {formattedToday}</Text>
        </View>
        
        {/* Today button */}
        <TouchableOpacity 
          style={styles.todayButton}
          onPress={goToToday}
        >
          <Text style={styles.todayButtonText}>Jump to Today</Text>
        </TouchableOpacity>
        
        {/* Month navigation */}
        <View style={styles.monthNavigation}>
          <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
            <ChevronLeft color="white" size={20} />
          </TouchableOpacity>
          
          <View style={styles.monthYearContainer}>
            <Text style={styles.monthYearText}>
              {format(currentMonth, 'MMMM yyyy')}
            </Text>
          </View>
          
          <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
            <ChevronRight color="white" size={20} />
          </TouchableOpacity>
        </View>
        
        {/* Weekday headers */}
        <View style={styles.weekdayHeader}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <Text key={index} style={styles.weekdayText}>{day}</Text>
          ))}
        </View>
        
        {/* Calendar grid */}
        <View style={styles.calendarGrid}>
          {/* Empty days */}
          {emptyDays.map(index => (
            <View key={`empty-${index}`} style={styles.emptyDay} />
          ))}
          
          {/* Days of the month */}
          {daysInMonth.map(date => {
            const day = date.getDate();
            const isToday = isSameDay(date, new Date());
            
            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  isToday && styles.todayButton,
                  isSameDay(date, selectedDate) && styles.selectedDay
                ]}
                onPress={() => handleDateSelect(date)}
              >
                <Text style={styles.dayText}>{day}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        
        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} />
            <Text style={styles.legendText}>8-10</Text>
            
            <View style={[styles.legendDot, { backgroundColor: '#eab308' }]} />
            <Text style={styles.legendText}>6-7</Text>
          </View>
          
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#f97316' }]} />
            <Text style={styles.legendText}>4-5</Text>
            
            <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
            <Text style={styles.legendText}>0-3</Text>
          </View>
          
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
            <Text style={styles.legendText}>No rating</Text>
            
            <View style={[styles.legendDot, { backgroundColor: '#6b7280' }]} />
            <Text style={styles.legendText}>No entries</Text>
          </View>
        </View>
      </View>
      
      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => navigation.navigate('Journal')}
        >
          <Home color="white" size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1F2C',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dateHeader: {
    backgroundColor: '#3056b7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  dateText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  todayButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  todayButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  monthYearContainer: {
    backgroundColor: '#4b5563',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  monthYearText: {
    color: 'white',
    fontSize: 16,
  },
  weekdayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekdayText: {
    color: 'white',
    fontSize: 14,
    width: 30,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  emptyDay: {
    width: 36,
    height: 36,
    margin: 2,
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6b7280',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  todayButton: {
    borderWidth: 2,
    borderColor: 'white',
  },
  selectedDay: {
    backgroundColor: '#3b82f6',
  },
  dayText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  legend: {
    marginTop: 24,
    alignItems: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
    marginLeft: 12,
  },
  legendText: {
    color: 'white',
    fontSize: 12,
    marginRight: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#193175',
    borderTopWidth: 1,
    borderTopColor: '#3056b7',
  },
  footerButton: {
    backgroundColor: '#193175',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3056b7',
  },
});

export default Calendar;