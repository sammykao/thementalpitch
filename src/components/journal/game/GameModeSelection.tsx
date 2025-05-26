
import React from "react";
import { Button } from "@/components/ui/button";
import { GamePhase } from "./types";

interface GameModeSelectionProps {
  handlePhaseSelect: (phase: GamePhase) => void;
  navigateToJournal: () => void;
  isSaving: boolean;
}

export const GameModeSelection: React.FC<GameModeSelectionProps> = ({
  handlePhaseSelect,
  navigateToJournal,
  isSaving
}) => {
  return (
    <div className="w-full space-y-6">
      <div className="bg-[#1A1F2C] border border-[#3056b7] rounded-lg p-4 text-center">
        <h3 className="text-xl font-bold mb-4">GAME</h3>
        <div className="space-y-4">
          <Button 
            className="w-full bg-[#3056b7] hover:bg-[#2a4da3] text-white font-bold py-3"
            onClick={() => handlePhaseSelect("pregame")}
            disabled={isSaving}
          >
            PREGAME
          </Button>
          <Button 
            className="w-full bg-[#3056b7] hover:bg-[#2a4da3] text-white font-bold py-3"
            onClick={() => handlePhaseSelect("postgame")}
            disabled={isSaving}
          >
            POST-GAME
          </Button>
          <Button 
            className="w-full bg-[#3056b7] hover:bg-[#2a4da3] text-white font-bold py-3"
            onClick={navigateToJournal}
            disabled={isSaving}
          >
            OTHER NOTES
          </Button>
        </div>
      </div>
    </div>
  );
};
