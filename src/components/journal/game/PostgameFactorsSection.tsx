
import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { ExternalFactor } from "./types";

interface PostgameFactorsSectionProps {
  externalFactors: ExternalFactor[];
  toggleFactor: (index: number) => void;
  handleBack: () => void;
  handleNext: () => void;
  isSaving: boolean;
}

export const PostgameFactorsSection: React.FC<PostgameFactorsSectionProps> = ({
  externalFactors,
  toggleFactor,
  handleBack,
  handleNext,
  isSaving
}) => {
  return (
    <div className="w-full space-y-4">
      <p className="text-center mb-2">What external factors kept me from playing my best?</p>
      
      <div className="space-y-2">
        {externalFactors.map((factor, index) => (
          <div 
            key={index}
            className={`flex items-center justify-between p-2 rounded-lg border ${factor.selected ? 'bg-[#3056b7] border-white' : 'bg-[#1A1F2C] border-[#3056b7]'}`}
            onClick={() => toggleFactor(index)}
          >
            <span>{factor.name}</span>
            <div className={`w-6 h-6 rounded-full border border-white flex items-center justify-center ${factor.selected ? 'bg-transparent' : 'bg-transparent'}`}>
              {factor.selected && <Check className="h-4 w-4" />}
            </div>
          </div>
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
          disabled={isSaving}
        >
          NEXT →
        </Button>
      </div>
    </div>
  );
};
