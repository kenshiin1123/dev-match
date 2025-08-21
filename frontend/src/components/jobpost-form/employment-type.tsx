import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const employmentTypes = ["full-time", "part-time", "contract"];

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase();
};

const EmploymentType: React.FC<{
  employmentType: string;
  onInputValuesChange: (value: string) => void;
}> = ({ employmentType, onInputValuesChange }) => {
  return (
    <div className="mt-5 space-y-4 border p-3">
      <Label>Employment Type</Label>
      <RadioGroup
        defaultValue="full-time"
        value={employmentType}
        onValueChange={onInputValuesChange}
        className="flex gap-4"
      >
        {employmentTypes.map((empType, i) => {
          return (
            <div className="flex items-center gap-2" key={empType}>
              <RadioGroupItem value={empType} id={"r" + i} />
              <Label htmlFor={"r" + i}>{capitalizeFirstLetter(empType)}</Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default EmploymentType;
