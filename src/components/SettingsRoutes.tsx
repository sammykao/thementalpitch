
import { Route, Routes } from "react-router-dom";
import Settings from "../pages/Settings";
import GameQuestions from "../pages/GameQuestions";
import TrainingQuestions from "../pages/TrainingQuestions";
import RehabQuestions from "../pages/RehabQuestions";
import LiftQuestions from "../pages/LiftQuestions";
import ImagerySettings from "../pages/ImagerySettings";
import EditQuestions from "../pages/EditQuestions";

export const SettingsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Settings />} />
      <Route path="/edit-questions" element={<EditQuestions />} />
      <Route path="/game-questions" element={<GameQuestions />} />
      <Route path="/training-questions" element={<TrainingQuestions />} />
      <Route path="/rehab-questions" element={<RehabQuestions />} />
      <Route path="/lift-questions" element={<LiftQuestions />} />
      <Route path="/imagery-settings" element={<ImagerySettings />} />
    </Routes>
  );
};
