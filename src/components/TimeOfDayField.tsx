
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface TimeOfDayFieldProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export const TimeOfDayField = ({ value, onChange, required = false }: TimeOfDayFieldProps) => {
  return (
    <div className="mb-4">
      <Label htmlFor="timeOfDay" className="block mb-2 text-sm font-medium text-white">
        Time of Day {!required && <span className="text-gray-400">(optional)</span>}
      </Label>
      <Input
        id="timeOfDay"
        type="text"
        placeholder="Enter time (e.g. 3:30 PM)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#1A1F2C] border-[#3056b7] text-white"
      />
    </div>
  );
};

export default TimeOfDayField;
