import { useRef, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { v4 as uuid } from "uuid";
import { motion } from "motion/react";
import TitleAndDescription from "@/components/jobpost-form/title-and-description";
import RequiredSkills from "@/components/jobpost-form/required-skills";
import SalaryRange from "@/components/jobpost-form/salary-range";
import EmploymentType from "@/components/jobpost-form/employment-type";
import RemoteSwitch from "@/components/jobpost-form/remote-switch";

export type SalaryRangeType = {
  salary_min: number;
  salary_max: number;
};

export type SkillType = {
  id: string;
  title: string;
};

const INITIAL_SALARY_RANGE = {
  salary_min: 2000,
  salary_max: 3000,
};

export type InputValuesType = {
  title: string;
  description: string;
  requiredSkills: SkillType[];
  salaryRange: SalaryRangeType;
  employmentType: string;
  remote: boolean;
};

const PostJob = () => {
  const [inputValues, setInputValues] = useState<InputValuesType>({
    title: "",
    description: "",
    requiredSkills: [],
    salaryRange: INITIAL_SALARY_RANGE,
    employmentType: "full-time",
    remote: false,
  });

  const skillInputRef = useRef<HTMLInputElement>(null);

  const handleSalaryInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = event.target.value.replace(/[^0-9]/g, ""); // strip non-numerics
    const numericValue = Number(rawValue) || 0;
    setInputValues((prevInputValues: InputValuesType) => {
      return {
        ...prevInputValues,
        salaryRange: {
          ...prevInputValues.salaryRange,
          [event.target.name]: numericValue,
        },
      };
    });
  };

  const handleSalarySet = (name: string, value: number) => {
    if (
      inputValues.salaryRange.salary_min <= inputValues.salaryRange.salary_max
    ) {
      setInputValues((prevInputValues: InputValuesType) => {
        return {
          ...prevInputValues,
          salaryRange: {
            ...prevInputValues.salaryRange,
            [name]: value,
          },
        };
      });
    } else {
      setInputValues((prevInputValues: InputValuesType) => {
        return {
          ...prevInputValues,
          salaryRange: {
            salary_min: value,
            salary_max: value,
          },
        };
      });
    }
  };

  const handleAddSkill = () => {
    if (skillInputRef.current && skillInputRef.current.value) {
      const newRequiredSkill = skillInputRef.current.value;
      setInputValues((prevInputValues: InputValuesType) => {
        return {
          ...prevInputValues,
          requiredSkills: [
            ...prevInputValues.requiredSkills,
            { title: newRequiredSkill, id: uuid() },
          ],
        };
      });

      // Clear input
      skillInputRef.current.value = "";
      skillInputRef.current.focus();
    }
  };

  const handleRemoveSkill = (id: string) => {
    const prevSkills = inputValues.requiredSkills;

    setInputValues((prevInputValues: InputValuesType) => {
      return {
        ...prevInputValues,
        requiredSkills: prevSkills.filter((skill) => skill.id !== id),
      };
    });
  };

  const handleEnterAddSkill = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (skillInputRef.current) {
        const value = skillInputRef.current.value.trim();
        if (value) {
          const newRequiredSkill = skillInputRef.current.value;

          setInputValues((prevInputValues: InputValuesType) => {
            return {
              ...prevInputValues,
              requiredSkills: [
                ...prevInputValues.requiredSkills,
                { title: newRequiredSkill, id: uuid() },
              ],
            };
          });

          // Clear input
          skillInputRef.current.value = "";
          skillInputRef.current.focus();
        }
      }
    }
  };

  // This is used for title, description, employmentType, and remote
  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (event.target) {
      const value = event.target.value;
      const name = event.target.name;

      setInputValues((prevInputValues) => {
        return { ...prevInputValues, [name]: value };
      });
    }
  };

  const handleEmploymentTypeChange = (value: string) => {
    setInputValues((prevInputValues: InputValuesType) => {
      return { ...prevInputValues, employmentType: value };
    });
  };

  const handleRemoteToggle = () => {
    setInputValues((prevInputValues) => {
      return { ...prevInputValues, remote: !prevInputValues.remote };
    });
  };

  return (
    <div className="w-full min-h-[100vh] flex flex-col bg-background pt-10 items-center pb-20">
      <h1 className="text-4xl font-extrabold mb-10">Post A Job</h1>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-[90%] sm:w-120 md:w-150 h-fit bg-accent p-5 rounded-md [&>section]:space-y-3 space-y-5 mx-auto flex flex-col"
      >
        <TitleAndDescription
          inputValues={inputValues}
          onInputChange={handleInputChange}
        />
        <RequiredSkills
          handleAddSkill={handleAddSkill}
          handleRemoveSkill={handleRemoveSkill}
          skillInputRef={skillInputRef}
          skills={inputValues.requiredSkills}
          handleEnterAddSkill={handleEnterAddSkill}
        />
        <SalaryRange
          handleSalaryInputChange={handleSalaryInputChange}
          salaryRange={inputValues.salaryRange}
          onSalarySet={handleSalarySet}
        />
        <EmploymentType
          employmentType={inputValues.employmentType}
          onInputValuesChange={handleEmploymentTypeChange}
        />
        <RemoteSwitch
          onInputChange={handleRemoteToggle}
          remote={inputValues.remote}
        />
        <Button className="mt-5 mx-auto w-40" size={"lg"}>
          Submit
        </Button>
      </motion.div>
    </div>
  );
};

/*
TODO:
  1. Control the input of title and description [done]
  2. Create components for employment type and remote [done]
  3. Connect to backend
*/

export default PostJob;
