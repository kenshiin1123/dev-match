import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { TabCardButton } from "./tab-card-button";

import type { ContentType } from "./signup-form-types";

export const PasswordContent: React.FC<ContentType> = ({
  inputValues,
  onInputValueChange,
}) => {
  return (
    <TabsContent value="password">
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Change your password here. After saving, you&apos;ll be logged out.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={inputValues.password}
              onChange={onInputValueChange}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="confirm_password">Confirm password</Label>
            <Input
              id="confirm_password"
              type="password"
              name="confirm_password"
              value={inputValues.confirm_password}
              onChange={onInputValueChange}
            />
          </div>
        </CardContent>
        <CardFooter>
          <TabCardButton value="account">Previous</TabCardButton>
          <TabCardButton value="skills" className="ml-auto">
            Next
          </TabCardButton>
        </CardFooter>
      </Card>
    </TabsContent>
  );
};
