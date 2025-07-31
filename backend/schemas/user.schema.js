import * as z from "zod";

const User = z.object({
  name: z.string("Name is required").min(2),
  email: z.email("Email is required"),
  password: z
    .string("Password is required")
    .min(8, "Password must be 8 or more characters"),
  role: z.enum(["developer", "employer", "admin"]).default("developer"),
  location: z.string("Location is required"),
  skills: z.array(z.string()).default([]),
  company: z.string(),
  // avatar: z
  //   .object({
  //     buffer: z.string(),
  //     contentType: z.string(),
  //   })
  //   .optional(),
  // resume: z
  //   .object({
  //     buffer: z.string(),
  //     contentType: z.string(),
  //   })
  //   .optional(),
});

export default User;
