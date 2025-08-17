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
import { useEffect, type ChangeEvent } from "react";
import { TabCardButton } from "./tab-card-button";

import type { InputsType, AccountType } from "./signup-form-types";
import { useSearchParams } from "react-router-dom";

export const AccountContent: React.FC<{
  inputValues: InputsType;
  onInputValueChange: (event: ChangeEvent<HTMLInputElement>) => void;
  setInputValues: React.Dispatch<React.SetStateAction<InputsType>>;
}> = ({ inputValues, onInputValueChange, setInputValues }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // This is used to modify the account type
  const handleSetAccountType = (role: AccountType) => {
    setSearchParams({ role: role });
    setInputValues((prevInputValues) => {
      return { ...prevInputValues, role: role };
    });
  };

  const isEmployerAndCompanyIsNotNull =
    (inputValues.role === "employer" && inputValues.company) ||
    inputValues.role === "developer";

  useEffect(() => {
    if (!searchParams.get("role")) setSearchParams({ role: "developer" });
    setInputValues((prevInputValues) => {
      const role = searchParams.get("role");

      // If role is either employer or developer, do a change the input values
      if (role === "developer" || role === "employer") {
        return { ...prevInputValues, role: role };
      } else {
        return { ...prevInputValues };
      }
    });
  }, []);

  return (
    <TabsContent value="account">
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Provide your basic details so we can set up your profile and
            personalize your experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="name">
              Name{!inputValues.name && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="name"
              value={inputValues.name}
              onChange={onInputValueChange}
              name="name"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="email">
              Email
              {!inputValues.email && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="email"
              value={inputValues.email}
              onChange={onInputValueChange}
              name="email"
            />
          </div>
          {inputValues.role === "employer" && (
            <div className="grid gap-3">
              <Label htmlFor="company">
                Company{" "}
                {!inputValues.company && (
                  <span className="text-red-500">*</span>
                )}
              </Label>
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
          {inputValues.name &&
            inputValues.email &&
            isEmployerAndCompanyIsNotNull && (
              <TabCardButton value="password" className="ml-auto">
                Next
              </TabCardButton>
            )}
        </CardFooter>
      </Card>
    </TabsContent>
  );
};
