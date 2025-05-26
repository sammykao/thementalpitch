
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Alert } from 'react-native';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: any;
    data: any;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: any;
    data: any;
  }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    };

    initAuth();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        Alert.alert('Error', error.message);
        return { error, data: null };
      }
      
      Alert.alert('Success', 'Signed in successfully!');
      return { error: null, data };
    } catch (error) {
      console.error("Error signing in:", error);
      Alert.alert('Error', 'An unexpected error occurred during sign in.');
      return { error, data: null };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        Alert.alert('Error', error.message);
        return { error, data: null };
      }
      
      Alert.alert('Success', 'Signed up successfully! Please check your email for verification.');
      return { error: null, data };
    } catch (error) {
      console.error("Error signing up:", error);
      Alert.alert('Error', 'An unexpected error occurred during sign up.');
      return { error, data: null };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      Alert.alert('Success', 'Signed out successfully!');
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert('Error', 'An error occurred while signing out.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
