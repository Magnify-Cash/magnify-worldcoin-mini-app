import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RememberMeOptionProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export const RememberMeOption = ({ value, onChange }: RememberMeOptionProps) => (
  <RadioGroup
    defaultValue={value ? "remember" : "forget"}
    onValueChange={(value) => onChange(value === "remember")}
    className="flex flex-col space-y-2"
  >
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="remember" id="remember" />
      <Label htmlFor="remember">Keep me signed in for future sessions</Label>
    </div>
  </RadioGroup>
);