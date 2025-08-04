import * as z from "zod";

const jobSchema = z.object({
  posted_by: z.string().uuid("Invalid UUID for posted_by"),

  title: z.string().nonempty("Title is required"),
  description: z.string().nonempty("Description is required"),
  company: z.string().nonempty("Company is required"),
  location: z.string().nonempty("Location is required"),

  salary_min: z.number().nonnegative("Salary must be a positive number"),
  salary_max: z.number().nonnegative("Salary must be a positive number"),

  required_skills: z.array(z.string()).default([]),

  employment_type: z.enum(["full-time", "part-time", "contract"], {
    required_error: "Employment type is required",
  }),

  remote: z.boolean({
    required_error: "Remote value is required",
  }),
});

export default jobSchema;
