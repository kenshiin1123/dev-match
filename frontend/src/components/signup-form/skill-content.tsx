import { v4 as uuid } from "uuid";
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
import { TabsContent } from "@/components/ui/tabs";
import { useRef } from "react";
import { TabCardButton } from "./tab-card-button";
import { toast } from "sonner";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Info } from "lucide-react";

import type { InputsType, SkillType } from "./signup-form-types";

export const SkillsContent: React.FC<{
  inputValues: InputsType;
  onSkillsChange: (skills: SkillType) => void;
}> = ({ inputValues, onSkillsChange }) => {
  const skillInputRef = useRef<HTMLInputElement>(null);

  const handleAddSkill = () => {
    const skill = skillInputRef.current!.value;
    if (!skill) return toast.error("Please fill the skill input");

    // Add skill to the array
    const payload = { title: skill, id: uuid() };

    onSkillsChange([...inputValues.skills, payload]);

    skillInputRef.current!.value = "";
    skillInputRef.current!.focus();
  };

  const handleRemoveSkill = (id: string) => {
    const prevSkills = inputValues.skills;
    onSkillsChange(prevSkills.filter((skill) => skill.id !== id));
    toast.success("Successfully Removed Skill");
  };

  const handleEnterAddSkill = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (skillInputRef.current) {
        const value = skillInputRef.current.value.trim();
        if (value) {
          const skill = skillInputRef.current!.value;
          const payload = { title: skill, id: uuid() };
          onSkillsChange([...inputValues.skills, payload]);
          // Clear input
          skillInputRef.current.value = "";
          skillInputRef.current.focus();
        }
      }
    }
  };

  return (
    <TabsContent value="skills">
      <ScrollArea className="h-[75vh]">
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <CardDescription>
              Share your key skills and expertise to help others understand your
              strengths.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-1">
            <Input
              ref={skillInputRef}
              id="skill"
              type="skill"
              onKeyDown={handleEnterAddSkill}
            />
            <Button type="button" onClick={handleAddSkill} variant={"outline"}>
              Add Skill
            </Button>
            <h1 className="mt-5">
              Your skills{" "}
              {inputValues.skills.length < 1 && (
                <span className="text-red-500">*</span>
              )}
            </h1>
            <ul className="space-x-2 space-y-2 border rounded p-2 min-h-20">
              {inputValues.skills.length > 0 && (
                <CardDescription className="flex items-center gap-1 mb-3">
                  <Info size={15} /> Click a skill to remove
                </CardDescription>
              )}
              {inputValues.skills.map((skill) => {
                return (
                  <Button
                    onClick={() => handleRemoveSkill(skill.id)}
                    variant={"secondary"}
                    className="border hover:bg-red-200 dark:hover-bg-red-400 dark:hover:text-black"
                    key={skill.id}
                  >
                    {skill.title}
                  </Button>
                );
              })}
            </ul>
          </CardContent>
          <CardFooter>
            <TabCardButton value="password">Previous</TabCardButton>
            {inputValues.skills.length > 0 && (
              <TabCardButton value="address" className="ml-auto">
                Next
              </TabCardButton>
            )}
          </CardFooter>
        </Card>
      </ScrollArea>
    </TabsContent>
  );
};
