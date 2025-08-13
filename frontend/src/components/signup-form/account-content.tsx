import { Button } from "@/components/ui/button";
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
import { type ChangeEvent } from "react";
import { TabCardButton } from "./tab-card-button";

import type { InputsType } from "./signup-form-types";

export const AccountContent: React.FC<{
  inputValues: InputsType;
  onInputValueChange: (event: ChangeEvent<HTMLInputElement>) => void;
  setInputValues: React.Dispatch<React.SetStateAction<InputsType>>;
}> = ({ inputValues, onInputValueChange, setInputValues }) => {
  const handleSetAccountType = (role: string) => {
    setInputValues((prevInputValues) => {
      return { ...prevInputValues, role: role };
    });
  };

  return (
    <TabsContent value="account">
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Input your account information here</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={inputValues.name}
              onChange={onInputValueChange}
              name="name"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={inputValues.email}
              onChange={onInputValueChange}
              name="email"
            />
          </div>
          {inputValues.role === "employer" && (
            <div className="grid gap-3">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={inputValues.company}
                onChange={onInputValueChange}
                name="company"
              />
            </div>
          )}
          <div className="grid gap-3">
            <Label>Account Type</Label>
            <div className=" border rounded-md [&>button]:w-[50%] [&>button]:h-full  [&>button]:py-2 divide-x">
              <Button
                variant={inputValues.role === "developer" ? "default" : "ghost"}
                name="role"
                onClick={() => handleSetAccountType("developer")}
                type="button"
              >
                Developer
              </Button>
              <Button
                variant={inputValues.role === "employer" ? "default" : "ghost"}
                name="role"
                onClick={() => handleSetAccountType("employer")}
                type="button"
              >
                Employer
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <TabCardButton value="password" className="ml-auto">
            Next
          </TabCardButton>
        </CardFooter>
      </Card>
    </TabsContent>
  );
};
