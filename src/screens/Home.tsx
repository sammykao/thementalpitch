import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, UserPlus } from 'lucide-react-native';

const Home = () => {
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo and Header */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Sign In and Sign Up Buttons (only if not authenticated) */}
        {!isAuthenticated && (
          <View style={styles.authButtonsContainer}>
            <TouchableOpacity 
              style={styles.authButton}
              onPress={() => navigation.navigate('SignIn')}
            >
              <LogIn color="#fff" size={20} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.authButton}
              onPress={() => navigation.navigate('SignUp')}
            >
              <UserPlus color="#fff" size={20} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Journal Button */}
        <TouchableOpacity 
          style={styles.journalButton}
          onPress={() => navigation.navigate('Journal')}
        >
          <Text style={styles.journalButtonText}>Your Journal</Text>
        </TouchableOpacity>

        {/* Onrise Button */}
        <TouchableOpacity 
          style={styles.onriseButton}
          onPress={() => {
            // Open external link to Onrise
          }}
        >
          <Image 
            source={require('../../assets/onrise-logo.png')} 
            style={styles.onriseLogo}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Settings Button */}
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1F2C',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  logo: {
    width: 240,
    height: 80,
  },
  authButtonsContainer: {
    width: '100%',
    marginBottom: 24,
    gap: 16,
  },
  authButton: {
    backgroundColor: '#3b5ac1',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  journalButton: {
    width: '100%',
    height: 64,
    backgroundColor: '#3b5ac1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 24,
  },
  journalButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  onriseButton: {
    width: '100%',
    height: 64,
    backgroundColor: '#1f3b87',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 24,
  },
  onriseLogo: {
    height: 48,
    width: '80%',
  },
  settingsButton: {
    width: '100%',
    backgroundColor: '#3b5ac1',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default Home;