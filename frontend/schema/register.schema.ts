import * as z from "zod";

const passwordSchema = z
  .string()
  .min(8, "Please enter a password with at least 8 characters.")
  .max(255, "Please enter a password with at 255 characters or less.");

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Please enter a name with at least 2 characters.")
      .max(50, "Please enter a name with at 50 characters or less.")
      .nonempty("Please enter your name."),
    email: z
      .string()
      .email("Please enter a valid email address.")
      .min(5, "Please enter an email with at least 5 characters.")
      .max(100, "Please enter an email with at 100 characters or less.")
      .nonempty("Please enter your email."),
    role: z.enum(["developer", "employer"]),
    company: z.string().optional(),
    password: passwordSchema,
    confirm_password: passwordSchema,
    skills: z
      .object({
        id: z.string(),
        title: z
          .string()
          .min(2, "Skill must be at least 2 characters.")
          .max(50, "Skill cannot exceed 50 characters."),
      })
      .array(),
    location: z.string().min(3, "Location must be at least 3 characters."),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

export default registerSchema;
