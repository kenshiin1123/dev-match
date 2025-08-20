import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Info } from "lucide-react";
import { type SkillType } from "@/pages/post-job";

const RequiredSkills: React.FC<{
  skillInputRef: React.RefObject<HTMLInputElement | null>;
  handleAddSkill: () => void;
  skills: SkillType[];
  handleRemoveSkill: (id: string) => void;
  handleEnterAddSkill: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}> = ({
  skillInputRef,
  handleAddSkill,
  skills,
  handleRemoveSkill,
  handleEnterAddSkill,
}) => {
  return (
    <>
      <section>
        <Label htmlFor="required_skill">Required Skills</Label>
        <Input
          onKeyDown={handleEnterAddSkill}
          type="text"
          id="required_skill"
          ref={skillInputRef}
        />
      </section>
      <Button id="required_skill" className="w-full" onClick={handleAddSkill}>
        Add Required Skill
      </Button>
      {/* Skills Display */}
      <ul className="space-x-2 space-y-2 border rounded p-2 min-h-20">
        {skills.length > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <Info size={15} /> Click a skill to remove
          </div>
        )}
        {skills.map((skill) => {
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
    </>
  );
};

export default RequiredSkills;
