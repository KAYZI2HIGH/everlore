import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AcademyFilterSelectProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  options: { label: string; value: string }[];
  onValueChange: (value: string) => void;
}

export function AcademyFilterSelect({
  id,
  label,
  placeholder,
  value,
  options,
  onValueChange,
}: AcademyFilterSelectProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} className="w-full rounded-full py-5">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
