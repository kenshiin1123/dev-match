import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useTheme } from "./ui/theme-provider";
import { Sun, Moon, MonitorSmartphone } from "lucide-react";

export default function ThemeSelector() {
  const theme = useTheme();

  return (
    <Select value={theme.theme} onValueChange={theme.setTheme}>
      <SelectTrigger size="sm" className=" max-sm:px-1 w-13 sm:w-[120px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">
          <Sun /> <span className="max-sm:hidden">Light</span>
        </SelectItem>
        <SelectItem value="dark">
          <Moon /> <span className="max-sm:hidden">Dark</span>
        </SelectItem>
        <SelectItem value="system">
          <MonitorSmartphone /> <span className="max-sm:hidden">System</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
