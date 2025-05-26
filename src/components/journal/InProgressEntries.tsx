
import { Link } from "react-router-dom";

interface InProgressEntry {
  phase: string;
  date: string;
  timestamp: string;
  type: string;
  userEmail?: string;
  controlFactors?: string;
  opposingTeam?: string;
  [key: string]: any;
}

interface InProgressEntriesProps {
  entries: InProgressEntry[];
}

export const InProgressEntries = ({ entries }: InProgressEntriesProps) => {
  if (entries.length === 0) return null;
  
  return (
    <div className="w-full mb-4">
      <h3 className="text-xl font-bold text-center mb-3">In Progress</h3>
      {entries.map((entry, index) => (
        <div key={`in-progress-${index}`} className="bg-[#193175] border border-[#3056b7] rounded-lg p-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="bg-[#193175] text-white font-bold px-4 py-2 rounded-lg flex-1 text-center">
              {entry.type} <span className="text-yellow-400">(in progress)</span>
            </div>
            <Link 
              to={`/${entry.type.toLowerCase()}-journal`}
              state={{
                completingEntry: true,
                phase: "postgame",
                entryDate: entry.date,
                opposingTeam: entry.opposingTeam
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg flex items-center ml-2"
            >
              Finish Journal →
            </Link>
          </div>
          <div className="bg-[#1A1F2C] rounded-lg p-3 mt-2 text-sm">
            <div className="text-gray-300 mb-1">{entry.date} (Pregame completed)</div>
            {entry.opposingTeam && (
              <div className="text-gray-300">
                Opponent: {entry.opposingTeam}
              </div>
            )}
            {entry.controlFactors && (
              <div className="line-clamp-2 text-gray-300 mt-1">
                Control factors: {entry.controlFactors.substring(0, 50)}...
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InProgressEntries;
