import * as z from "zod";

const initialSchema = {
  title: z.string("Title is required").nonempty("Title is required"),
  description: z
    .string("Description is required")
    .nonempty("Description is required"),
  company: z.string("Company is required").nonempty("Company is required"),
  location: z.string("Location is required").nonempty("Location is required"),

  salary_min: z
    .number("Salary must be a positive number")
    .nonnegative("Salary must be a positive number"),
  salary_max: z
    .number("Salary must be a positive number")
    .nonnegative("Salary must be a positive number"),

  required_skills: z.array(z.string("Skill is required")).default([]),

  employment_type: z.enum(["full-time", "part-time", "contract"], {
    required_error: "Employment type is required",
  }),

  remote: z.boolean({
    required_error: "Remote value is required",
  }),
};

const jobSchema = z.object({
  ...initialSchema,
});

const updateJobSchema = z.object({
  ...initialSchema,
});

export { updateJobSchema };
export default jobSchema;
