
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import Journal from "./pages/Journal";
import Calendar from "./pages/Calendar";
import NewActivity from "./screens/NewActivity";
import JournalEntries from "./pages/JournalEntries";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import { SettingsRoutes } from "./components/SettingsRoutes";
import TrainingJournal from "./pages/TrainingJournal";
import GameJournal from "./pages/GameJournal";
import ImageryJournal from "./pages/ImageryJournal";
import FoodJournal from "./pages/FoodJournal";
import RehabJournal from "./pages/RehabJournal";
import LiftJournal from "./pages/LiftJournal";
import Activities from "./pages/Activities";
import Index from "./pages/Index";

// Setup QueryClient with defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/journal"
              element={
                <ProtectedRoute>
                  <Journal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/journal/:date"
              element={
                <ProtectedRoute>
                  <Journal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/journal-entries"
              element={
                <ProtectedRoute>
                  <JournalEntries />
                </ProtectedRoute>
              }
            />
            <Route
              path="/new-activity"
              element={
                <ProtectedRoute>
                  <NewActivity />
                </ProtectedRoute>
              }
            />
            <Route
              path="/training-journal"
              element={
                <ProtectedRoute>
                  <TrainingJournal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/game-journal"
              element={
                <ProtectedRoute>
                  <GameJournal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/imagery-journal"
              element={
                <ProtectedRoute>
                  <ImageryJournal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/food-journal"
              element={
                <ProtectedRoute>
                  <FoodJournal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rehab-journal"
              element={
                <ProtectedRoute>
                  <RehabJournal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lift-journal"
              element={
                <ProtectedRoute>
                  <LiftJournal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/*"
              element={
                <ProtectedRoute>
                  <SettingsRoutes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/activities"
              element={
                <ProtectedRoute>
                  <Activities />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
