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
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">
          <Sun /> Light
        </SelectItem>
        <SelectItem value="dark">
          <Moon /> Dark
        </SelectItem>
        <SelectItem value="system">
          <MonitorSmartphone /> System
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
