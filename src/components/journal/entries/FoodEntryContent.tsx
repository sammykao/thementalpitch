
import React from "react";
import { JournalEntry } from "@/hooks/journal/types";
import { formatKeyForDisplay } from "@/utils/journalDisplay";

interface FoodEntryContentProps {
  entry: JournalEntry;
}

const FoodEntryContent: React.FC<FoodEntryContentProps> = ({ entry }) => {
  const { content } = entry;
  const mealType = content.mealType || "Meal";
  const foodItems = content.foodItems || "";
  const feelingNotes = content.feelingNotes;
  
  return (
    <div className="mt-2">
      <h3 className="text-md font-semibold mb-2">{mealType}</h3>
      
      {/* Food Items */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-blue-300 mb-1">Food Items</h4>
        <div className="bg-[#0d1c45] p-3 rounded-md text-sm">
          {foodItems.split('\n').map((item, i) => (
            <p key={i} className="mb-1">{item}</p>
          ))}
        </div>
      </div>
      
      {/* Feeling Notes (Only for Dinner) */}
      {mealType === "Dinner" && feelingNotes && (
        <div className="mb-2">
          <h4 className="text-sm font-medium text-blue-300 mb-1">Feeling Notes</h4>
          <div className="bg-[#0d1c45] p-3 rounded-md text-sm">
            {feelingNotes.split('\n').map((note, i) => (
              <p key={i} className="mb-1">{note}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodEntryContent;
