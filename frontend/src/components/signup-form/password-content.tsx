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
import { passwordStrength as passwordStrengthChecker } from "check-password-strength";

import type { ContentType } from "./signup-form-types";
import { useEffect, useState } from "react";

export const PasswordContent: React.FC<ContentType> = ({
  inputValues,
  onInputValueChange,
}) => {
  const [passwordStrengthVal, setPasswordStrengthVal] = useState<number>(0);

  useEffect(() => {
    const passwordStrength = passwordStrengthChecker(
      inputValues.password
    ).value;
    let strengthVal = 0;

    switch (passwordStrength) {
      case "Too weak":
        if (inputValues.password) strengthVal = 20;
        break;
      case "Weak":
        strengthVal = 40;
        break;
      case "Fair":
        strengthVal = 60;
        break;
      case "Medium":
        strengthVal = 80;
        break;
      case "Strong":
        strengthVal = 100;
        break;
      default:
        strengthVal = 0;
    }

    setPasswordStrengthVal(strengthVal);
  }, [inputValues.password]);

  return (
    <TabsContent value="password">
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Create a secure password to keep your account safe and private.
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
            <Label htmlFor="password-strength">
              {inputValues.password ? (
                <>
                  Your password is{" "}
                  {passwordStrengthChecker(
                    inputValues.password
                  ).value.toLowerCase()}
                  .
                </>
              ) : (
                <>Please input your password</>
              )}
            </Label>
            <div className="flex items-center gap-3 border dark:bg-black rounded-2xl">
              <div
                className={`h-2 rounded-2xl bg-black dark:bg-white transition-w duration-800`}
                style={{ width: `${passwordStrengthVal}%` }}
              ></div>
            </div>
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
