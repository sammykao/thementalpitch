
import React from "react";

const CalendarLegend: React.FC = () => {
  return (
    <div className="w-full flex justify-center items-center mb-4">
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center">
          <div className="bg-green-500 h-3 w-3 rounded-full mr-1"></div>
          <span>8-10</span>
        </div>
        <div className="flex items-center">
          <div className="bg-yellow-500 h-3 w-3 rounded-full mr-1"></div>
          <span>6-7</span>
        </div>
        <div className="flex items-center">
          <div className="bg-orange-500 h-3 w-3 rounded-full mr-1"></div>
          <span>4-5</span>
        </div>
        <div className="flex items-center">
          <div className="bg-red-500 h-3 w-3 rounded-full mr-1"></div>
          <span>0-3</span>
        </div>
        <div className="flex items-center">
          <div className="bg-blue-500 h-3 w-3 rounded-full mr-1"></div>
          <span>No rating</span>
        </div>
        <div className="flex items-center">
          <div className="bg-gray-500 h-3 w-3 rounded-full mr-1"></div>
          <span>No entries</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarLegend;
