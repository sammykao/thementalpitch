
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PostgameNotesSectionProps {
  notes: string;
  setNotes: (notes: string) => void;
  handleBack: () => void;
  handleSaveComplete: () => void;
  isSaving: boolean;
}

export const PostgameNotesSection: React.FC<PostgameNotesSectionProps> = ({
  notes,
  setNotes,
  handleBack,
  handleSaveComplete,
  isSaving
}) => {
  return (
    <div className="w-full space-y-4">
      <p className="text-center mb-2">OTHER NOTES:</p>
      
      <Textarea 
        className="w-full bg-[#1A1F2C] border border-white rounded-lg p-2 min-h-[250px] text-white"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Type thoughts..."
        disabled={isSaving}
      />
      
      <div className="w-full flex justify-between mt-6">
        <Button 
          onClick={handleBack}
          className="bg-red-500 hover:bg-red-600 text-white"
          disabled={isSaving}
        >
          ← BACK
        </Button>
        <Button 
          onClick={handleSaveComplete}
          className="bg-green-500 hover:bg-green-600 text-white"
          disabled={isSaving}
        >
          {isSaving ? "SAVING..." : "DONE →"}
        </Button>
      </div>
    </div>
  );
};
