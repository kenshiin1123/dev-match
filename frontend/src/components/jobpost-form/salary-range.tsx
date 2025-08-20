import { type SalaryRangeType } from "@/pages/post-job";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";

const SalaryRange: React.FC<{
  salaryRange: SalaryRangeType;
  handleSalaryInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ salaryRange, handleSalaryInputChange }) => {
  return (
    <div className="flex gap-2 flex-col sm:flex-row justify-between w-[95%] mx-auto">
      <section className="flex flex-col gap-3">
        <Label htmlFor="salary_min">Min Salary</Label>
        <Input
          type="text"
          value={"$" + salaryRange.salary_min.toLocaleString() + ""}
          name="salary_min"
          id="salary_min"
          onChange={handleSalaryInputChange}
        />
        <Slider
          onChange={handleSalaryInputChange}
          name="salary_min"
          defaultValue={[salaryRange.salary_min]}
          min={0}
          max={10000}
          step={100}
          className={"mx-auto"}
        />
      </section>
      <section className="flex flex-col gap-3">
        <Label htmlFor="salary_max">Max Salary</Label>
        <Input
          type="text"
          id="salary_max"
          value={"$" + salaryRange.salary_max.toLocaleString() + ""}
          name="salary_max"
          onChange={handleSalaryInputChange}
        />
        <Slider
          onChange={handleSalaryInputChange}
          name="salary_max"
          defaultValue={[salaryRange.salary_max]}
          min={salaryRange.salary_min}
          max={Math.min(salaryRange.salary_min * 10, 200_000)} // cap at 200k
          step={100}
          className={"mx-auto"}
        />
      </section>
    </div>
  );
};

export default SalaryRange;
