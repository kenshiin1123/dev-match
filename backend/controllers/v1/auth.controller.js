import UserValidator from "../../schemas/user.schema.js";
import AppError from "../../utils/AppError.js";
import { hashPassword } from "../../utils/passwordHandler.js";

const register = async (req, res) => {
  // Validate request body
  const isValid = UserValidator.safeParse(req.body);
  if (!isValid.success) {
    const errors = isValid.error._zod.def.map((err) => {
      return `${err.message}`;
    });
    throw new AppError("Error while validating", 400, { errors });
  }

  // Extract data after validation
  const { name, email, role, location, skills, password } = isValid.data;

  // Check for existing email
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new AppError("Email already in used", 409, email);
  }

  // Set new user's info
  const userData = {
    name,
    email,
    hashedPassword: await hashPassword(password),
    role,
    location,
    skills,
  };

  // Save to database

  res.json({
    message: "Successfully registered user",
    success: true,
  });
};

export { register };
