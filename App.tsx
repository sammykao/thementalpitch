import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './src/contexts/AuthContext';
import { StatusBar } from 'expo-status-bar';

// Screens
import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import Journal from './src/screens/Journal';
import Calendar from './src/screens/Calendar';
import NewActivity from './src/screens/NewActivity';
import Profile from './src/pages/Profile';
import Settings from './src/pages/Settings';
import TrainingJournal from './src/screens/TrainingJournal';
import GameJournal from './src/screens/GameJournal';
import ImageryJournal from './src/screens/ImageryJournal';
import FoodJournal from './src/screens/FoodJournal';
import RehabJournal from './src/screens/RehabJournal';
import LiftJournal from './src/screens/LiftJournal';
import Activities from './src/screens/Activities';
import Home from './src/screens/Home';
import NotFound from './src/screens/NotFound';

const Stack = createNativeStackNavigator();

// Setup QueryClient with defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000
    }
  }
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator 
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#1A1F2C' }
            }}
          >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Journal" component={Journal} />
            <Stack.Screen name="Calendar" component={Calendar} />
            <Stack.Screen name="NewActivity" component={NewActivity} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="TrainingJournal" component={TrainingJournal} />
            <Stack.Screen name="GameJournal" component={GameJournal} />
            <Stack.Screen name="ImageryJournal" component={ImageryJournal} />
            <Stack.Screen name="FoodJournal" component={FoodJournal} />
            <Stack.Screen name="RehabJournal" component={RehabJournal} />
            <Stack.Screen name="LiftJournal" component={LiftJournal} />
            <Stack.Screen name="Activities" component={Activities} />
            <Stack.Screen name="NotFound" component={NotFound} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  );
}