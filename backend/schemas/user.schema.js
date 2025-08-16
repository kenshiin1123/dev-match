import * as z from "zod";

const loginValidator = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters long"),
});

const patchUserValidator = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters long"),
  location: z.string({ required_error: "Location is required" }),
  skills: z
    .array(z.string({ required_error: "Skill must be a string" }), {
      invalid_type_error: "Skills must be an array of strings",
    })
    .default([]),
  company: z.string({ required_error: "Company is required" }),
});

const User = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters long"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters long"),
  role: z
    .enum(["developer", "employer", "admin"], {
      errorMap: () => ({
        message: "Role must be one of: developer, employer, admin",
      }),
    })
    .default("developer"),
  location: z.string({ required_error: "Location is required" }),
  skills: z
    .array(z.string({ required_error: "Skill must be a string" }), {
      invalid_type_error: "Skills must be an array of strings",
    })
    .default([]),
  company: z.string({ required_error: "Company is required" }).optional(),
  // avatar: z
  //   .object({
  //     buffer: z.string({ required_error: "Avatar buffer is required" }),
  //     contentType: z.string({ required_error: "Avatar content type is required" }),
  //   })
  //   .optional(),
  // resume: z
  //   .object({
  //     buffer: z.string({ required_error: "Resume buffer is required" }),
  //     contentType: z.string({ required_error: "Resume content type is required" }),
  //   })
  //   .optional(),
});

export { loginValidator, patchUserValidator };
export default User;
