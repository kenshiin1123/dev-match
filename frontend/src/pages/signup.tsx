import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

// Custom Contents
import { AccountContent } from "../components/signup-form/account-content";
import { PasswordContent } from "../components/signup-form/password-content";
import { SkillsContent } from "../components/signup-form/skill-content";
import { AddressContent } from "../components/signup-form/address-content";
import { ReviewContent } from "../components/signup-form/review-content";
import PageContainer from "@/components/page-container";

// Initial Input Values
import { INITIAL_INPUT_VALUE } from "../components/signup-form/signup-form-types";

// Types
import type {
  InputsType,
  SkillType,
  LocationType,
} from "../components/signup-form/signup-form-types";

import RegisterModel, {
  type RegValidationRes,
} from "../../model/register.model.ts";
import { redirect, type ActionFunction } from "react-router-dom";
import { toast } from "sonner";

export default function signup() {
  const [inputValues, setInputValues] =
    useState<InputsType>(INITIAL_INPUT_VALUE);
  const [validatedFields, setValidatedFields] = useState<RegValidationRes>({
    success: false,
    message: "",
  });

  const handleInputValuesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setInputValues((prevInputValues) => {
      return { ...prevInputValues, [name]: value };
    });
  };

  const handleSkillsModify = (skills: SkillType) => {
    setInputValues((prevInputValues) => {
      return { ...prevInputValues, skills: skills };
    });
  };

  const handleLocationChange = (
    type: "country" | "city",
    value: LocationType["country"] | LocationType["city"]
  ) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      location: {
        ...prevInputValues.location,
        [type]: value,
      },
    }));
  };

  useEffect(() => {
    const fieldModel = new RegisterModel(
      inputValues.name,
      inputValues.email,
      inputValues.role,
      inputValues.company,
      inputValues.password,
      inputValues.confirm_password,
      inputValues.skills,
      `${inputValues.location.country.country}, ${inputValues.location.city.city}`
    );

    const fieldValidationResult = fieldModel.validate();
    setValidatedFields(fieldValidationResult);
  }, [inputValues]);

  // This Confirms if the user role is employer, if so, it will check for the inputted company if its not empty
  // It will not allow the user to proceed if its empty.
  const isEmployerAndCompanyIsNotNull =
    (inputValues.role === "employer" && inputValues.company) ||
    inputValues.role === "developer";

  const validAccountInputs =
    inputValues.name &&
    inputValues.email &&
    inputValues.role &&
    isEmployerAndCompanyIsNotNull;

  const validPasswordInputs =
    inputValues.password === inputValues.confirm_password &&
    inputValues.confirm_password.length > 0 &&
    inputValues.confirm_password.length > 0;

  const validSkills = inputValues.skills.length > 0;

  return (
    <PageContainer>
      <ScrollArea className="flex w-full max-w-sm flex-col gap-6 mx-auto npm dlx shadcn@latest add scroll-area">
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value={"account"}>Account</TabsTrigger>
            {validAccountInputs && (
              <TabsTrigger value={"password"}>Password</TabsTrigger>
            )}
            {validAccountInputs && validPasswordInputs && (
              <TabsTrigger value={"skills"}>Skills</TabsTrigger>
            )}
            {validAccountInputs && validPasswordInputs && validSkills && (
              <TabsTrigger value={"address"}>Address</TabsTrigger>
            )}
            {validAccountInputs && validPasswordInputs && validSkills && (
              <TabsTrigger value={"review"}>Review</TabsTrigger>
            )}
          </TabsList>
          <AccountContent
            inputValues={inputValues}
            onInputValueChange={handleInputValuesChange}
            setInputValues={setInputValues}
          />
          <PasswordContent
            inputValues={inputValues}
            onInputValueChange={handleInputValuesChange}
          />
          <SkillsContent
            inputValues={inputValues}
            onSkillsChange={handleSkillsModify}
          />
          <AddressContent
            inputValues={inputValues}
            onLocationChange={handleLocationChange}
            validatedFields={validatedFields}
          />
          <ReviewContent inputValues={inputValues} />
        </Tabs>
      </ScrollArea>
    </PageContainer>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const { VITE_API_BASE_URL } = import.meta.env;
  const formData = await request.formData();

  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    password: formData.get("password"),
    skills: JSON.parse(formData.get("skills")!.toString()),
    location: formData.get("location"),
    company: formData.get("company"),
  };

  const response = await fetch(VITE_API_BASE_URL + "/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!data.success) {
    const errorMessages = data.data.errors;

    return toast.error(
      <div>
        <h1 className="font-bold">{data.message}:</h1>
        <ul>
          {errorMessages.map((errorMessage: string, i: string) => (
            <li key={i}>{errorMessage}</li>
          ))}
        </ul>
      </div>
    );
  } else if (data.success) {
    toast.success(data.message);
  }

  return redirect("/login");
};
