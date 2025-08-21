import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const RemoteSwitch: React.FC<{
  remote: boolean;
  onInputChange: () => void;
}> = ({ remote, onInputChange }) => {
  return (
    <div className="flex items-center space-x-2 border p-5">
      <Switch id="remote" onCheckedChange={onInputChange} checked={remote} />
      <Label htmlFor="remote">Remote Job</Label>
    </div>
  );
};
export default RemoteSwitch;
