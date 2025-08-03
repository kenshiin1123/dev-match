import UserValidator from "../../schemas/user.schema.js";
import AppError from "../../utils/AppError.js";
import { hashPassword } from "../../utils/passwordHandler.js";
import { dbClient } from "../../config/db.js";

// An error handler for asynchronous operations.
const wrapAsync = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err));
  };
};

const register = wrapAsync(async (req, res) => {
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
  const existingEmail = await dbClient.query(
    `SELECT email FROM users WHERE email=$1`,
    [email]
  );

  if (existingEmail.rowCount > 0 || existingEmail.rows.length > 0) {
    throw new AppError("Email already in use", 409, email);
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
  try {
    await dbClient.query(
      `INSERT INTO users (name, email, hashed_password, role, location, skills)
     VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        userData.name,
        userData.email,
        userData.hashedPassword,
        userData.role,
        userData.location,
        userData.skills,
      ]
    );
  } catch (error) {
    throw new AppError("Failed to register!", 500, error);
  }

  res.json({
    message: "Successfully registered user",
    success: true,
  });
});

export { register };
