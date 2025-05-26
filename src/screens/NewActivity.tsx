import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react-native';

const NewActivity = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get the selected date from route params or use today's date
  const selectedDate = route.params?.selectedDate || format(new Date(), 'yyyy-MM-dd');
  const displayDate = route.params?.displayDate || format(new Date(), 'MMMM d');
  
  const handleActivitySelection = (activity) => {
    // Navigate to the appropriate journal page based on activity
    // and pass along the selected date
    navigation.navigate(`${activity}Journal`, { 
      selectedDate, 
      displayDate 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Journal')}>
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>YOUR JOURNAL</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.dateHeader}>
          <Text style={styles.dateText}>{displayDate}</Text>
        </View>
        
        <View style={styles.activitiesContainer}>
          <TouchableOpacity 
            style={styles.activityButton}
            onPress={() => handleActivitySelection('Game')}
          >
            <Text style={styles.activityButtonText}>GAME</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.activityButton}
            onPress={() => handleActivitySelection('Training')}
          >
            <Text style={styles.activityButtonText}>TRAINING</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.activityButton}
            onPress={() => handleActivitySelection('Rehab')}
          >
            <Text style={styles.activityButtonText}>REHAB</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.activityButton}
            onPress={() => handleActivitySelection('Lift')}
          >
            <Text style={styles.activityButtonText}>LIFT</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.activityButton}
            onPress={() => handleActivitySelection('Imagery')}
          >
            <Text style={styles.activityButtonText}>IMAGERY</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.activityButton}
            onPress={() => handleActivitySelection('Food')}
          >
            <Text style={styles.activityButtonText}>FOOD</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 24,
  },
  dateText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  activitiesContainer: {
    flex: 1,
    gap: 16,
  },
  activityButton: {
    backgroundColor: '#193175',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  activityButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NewActivity;