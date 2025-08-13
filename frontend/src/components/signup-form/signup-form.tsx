import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

// Custom Contents
import { AccountContent } from "./account-content";
import { PasswordContent } from "./password-content";
import { SkillsContent } from "./skill-content";
import { AddressContent } from "./address-content";
import { ReviewContent } from "./review-content";

// Initial Input Values
import { INITIAL_INPUT_VALUE } from "./signup-form-types";

// Types
import type { InputsType, SkillType, LocationType } from "./signup-form-types";

export function SignupForm() {
  const [inputValues, setInputValues] =
    useState<InputsType>(INITIAL_INPUT_VALUE);

  // const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  // };

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

  const tabsTriggers = ["Account", "Password", "Skills", "Address", "Review"];

  return (
    <ScrollArea className="flex w-full max-w-sm flex-col gap-6 mx-auto npm dlx shadcn@latest add scroll-area">
      <Tabs defaultValue="account">
        <TabsList>
          {tabsTriggers.map((title) => (
            <TabsTrigger key={title} value={title.toLowerCase()}>
              {title}
            </TabsTrigger>
          ))}
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
        />
        <ReviewContent inputValues={inputValues} />
      </Tabs>
    </ScrollArea>
  );
}
