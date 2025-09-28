import { Button } from "./ui/button";
import { CardDescription } from "./ui/card";
import { Info } from "lucide-react";
import { Input } from "./ui/input";

export type SkillType = { title: string; id: string };

const SkillsDisplay: React.FC<{
  skills: SkillType[];
  onAddSkill: () => void;
  onRemoveSkill: (id: string) => void;
  className?: string;
  skillInputRef: React.RefObject<HTMLInputElement | null>;
  handleEnterAddSkill: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}> = ({
  skills,
  onAddSkill,
  onRemoveSkill,
  className,
  skillInputRef,
  handleEnterAddSkill,
}) => {
  return (
    <div className={className}>
      <h1>
        Your skills{" "}
        {skills.length < 1 && <span className="text-red-500">*</span>}
      </h1>
      <ul className="space-x-2 space-y-2 border rounded p-2 min-h-20">
        {skills.length > 0 && (
          <CardDescription className="flex items-center gap-1 mb-3">
            <Info size={15} /> Click a skill to remove
          </CardDescription>
        )}
        {skills.map((skill) => {
          return (
            <Button
              onClick={() => onRemoveSkill(skill.id)}
              variant={"secondary"}
              className="border hover:bg-red-200 dark:hover-bg-red-400 dark:hover:text-black"
              key={skill.id}
            >
              {skill.title}
            </Button>
          );
        })}
      </ul>
      <Input
        ref={skillInputRef}
        id="skill"
        type="skill"
        onKeyDown={handleEnterAddSkill}
        className="w-full mt-3"
        placeholder="Input your skill here"
      />
      <Button
        type="button"
        onClick={onAddSkill}
        variant={"outline"}
        className="w-full mt-3"
      >
        Add Skill
      </Button>
    </div>
  );
};

export default SkillsDisplay;
