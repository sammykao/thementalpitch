import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Home, Plus } from 'lucide-react-native';
import { useJournalData } from '../hooks/useJournalData';

const Journal = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const todayDate = new Date();
  const today = format(todayDate, 'MMMM d');
  const [pageLoading, setPageLoading] = useState(true);
  
  // Set an extremely short initial loading time to show content fast
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 300); // Very short initial loading (300ms)
    
    return () => clearTimeout(timer);
  }, []);

  const {
    todayEntries,
    activities,
    inProgressEntries,
    isLoading: mainLoading,
    loadingError,
  } = useJournalData();

  if (pageLoading || mainLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading journal...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loadingError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{loadingError}</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.buttonText}>Return Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Journal</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.dateHeader}>
        <Text style={styles.dateText}>Today, {today}</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {/* In Progress Activities Section */}
        {inProgressEntries.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>In Progress</Text>
            {inProgressEntries.map((entry, index) => (
              <View key={`in-progress-${index}`} style={styles.activityCard}>
                <View style={styles.activityHeader}>
                  <Text style={styles.activityTitle}>
                    {entry.type} <Text style={styles.inProgressTag}>(in progress)</Text>
                  </Text>
                  <TouchableOpacity 
                    style={styles.finishButton}
                    onPress={() => {
                      // Navigate to finish the entry
                      navigation.navigate(`${entry.type}Journal`, {
                        completingEntry: true,
                        phase: "postgame",
                        entryDate: entry.date,
                        opposingTeam: entry.opposingTeam
                      });
                    }}
                  >
                    <Text style={styles.finishButtonText}>Finish Journal →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
        
        {/* Completed Activities Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Completed Activities</Text>
          {activities.length > 0 ? (
            activities.map((activity, index) => {
              const entry = todayEntries.find(e => e.type === activity);
              if (!entry) return null;
              
              return (
                <View key={`activity-${activity}-${index}`} style={styles.activityCard}>
                  <View style={styles.activityHeader}>
                    <Text style={styles.activityTitle}>
                      {activity === "Game" && entry.content?.opposingTeam 
                        ? `Game vs ${entry.content.opposingTeam}` 
                        : activity}
                    </Text>
                    <TouchableOpacity 
                      style={styles.journalButton}
                      onPress={() => {
                        // Navigate to journal entries for this activity
                      }}
                    >
                      <Text style={styles.journalButtonText}>see journal →</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {/* Activity content preview would go here */}
                  <View style={styles.activityPreview}>
                    <Text style={styles.previewText}>
                      {entry.content?.rating ? `Rating: ${entry.content.rating}/10` : 'No rating'}
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No activities logged yet today</Text>
              <Text style={styles.emptyStateSubtext}>
                Click the + button to add a new activity
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => navigation.navigate('Calendar')}
        >
          <Calendar color="white" size={24} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => navigation.navigate('NewActivity')}
        >
          <Plus color="white" size={24} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => navigation.navigate('Home')}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#f87171',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
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
    marginHorizontal: 16,
    marginBottom: 16,
  },
  dateText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#193175',
    borderWidth: 1,
    borderColor: '#3056b7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  inProgressTag: {
    color: '#fbbf24',
    fontWeight: 'normal',
  },
  finishButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  finishButtonText: {
    color: 'white',
    fontSize: 14,
  },
  journalButton: {
    backgroundColor: '#193175',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  journalButtonText: {
    color: 'white',
    fontSize: 14,
  },
  activityPreview: {
    backgroundColor: '#1A1F2C',
    borderRadius: 6,
    padding: 12,
  },
  previewText: {
    color: '#d1d5db',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    color: '#9ca3af',
    fontSize: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: '#9ca3af',
    fontSize: 14,
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
  button: {
    backgroundColor: '#3056b7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Journal;