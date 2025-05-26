
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { JournalMode } from "./types";

interface GameJournalHeaderProps {
  mode: JournalMode;
  formattedDate: string;
  handleBack: () => void;
  isSaving: boolean;
  isCompleting?: boolean;
}

export const GameJournalHeader: React.FC<GameJournalHeaderProps> = ({
  mode,
  formattedDate,
  handleBack,
  isSaving,
  isCompleting = false
}) => {
  let title = "GAME JOURNAL";
  if (mode === "pregame") title = "PREGAME";
  if (mode.startsWith("postgame")) title = "POST-GAME";
  
  return (
    <>
      <div className="w-full flex items-center justify-between mb-4">
        <Button 
          variant="ghost" 
          className="text-white p-0 h-auto" 
          onClick={handleBack} 
          disabled={isSaving}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="w-6"></div> {/* Empty div for spacing */}
      </div>
      
      <div className="bg-[#3056b7] px-4 py-2 rounded-lg mb-6 text-center w-full">
        {isCompleting && <span className="text-yellow-400 font-semibold">Completing in-progress entry</span>}
        {isCompleting ? <div>Today, {formattedDate}</div> : `Today, ${formattedDate}`}
      </div>
    </>
  );
};
