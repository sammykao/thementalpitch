
import React from "react";
import { Button } from "@/components/ui/button";

interface PostgameRatingSectionProps {
  rating: number | null;
  handleRatingSelect: (value: number) => void;
  handleBack: () => void;
  handleNext: () => void;
  isSaving: boolean;
}

export const PostgameRatingSection: React.FC<PostgameRatingSectionProps> = ({
  rating,
  handleRatingSelect,
  handleBack,
  handleNext,
  isSaving
}) => {
  // Define color classes for the rating buttons
  const getRatingColor = (value: number) => {
    if (value >= 9) return "bg-green-500 hover:bg-green-600";
    if (value >= 7) return "bg-lime-400 hover:bg-lime-500";
    if (value >= 5) return "bg-yellow-500 hover:bg-yellow-600";
    if (value >= 3) return "bg-orange-500 hover:bg-orange-600";
    return "bg-red-500 hover:bg-red-600";
  };

  return (
    <div className="w-full space-y-4">
      <p className="text-center mb-2">On a scale of 1-10,<br />how'd the game go?</p>
      
      <div className="grid grid-cols-2 gap-3">
        {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((value) => (
          <Button 
            key={value}
            onClick={() => handleRatingSelect(value)}
            className={`${getRatingColor(value)} ${rating === value ? 'ring-2 ring-white' : ''}`}
            disabled={isSaving}
          >
            {value}
          </Button>
        ))}
      </div>
      
      <div className="w-full flex justify-between mt-6">
        <Button 
          onClick={handleBack}
          className="bg-red-500 hover:bg-red-600 text-white"
          disabled={isSaving}
        >
          ← BACK
        </Button>
        <Button 
          onClick={handleNext}
          className="bg-green-500 hover:bg-green-600 text-white"
          disabled={isSaving || rating === null}
        >
          NEXT →
        </Button>
      </div>
    </div>
  );
};
