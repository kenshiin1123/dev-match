import userValidator, { loginValidator } from "../../schemas/user.schema.js";
import { hashPassword, verifyPassword } from "../../utils/passwordHandler.js";
import { dbClient } from "../../config/db.js";
import AppError from "../../utils/AppError.js";
import { genJWT } from "../../utils/token.js";

// An error handler for asynchronous operations.
const wrapAsync = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err));
  };
};

const register = wrapAsync(async (req, res) => {
  // Validate request body
  const isValid = userValidator.safeParse(req.body);

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

  res.status(201).json({
    message: "Successfully registered user",
    success: true,
  });
});

const login = wrapAsync(async (req, res) => {
  // Validate user input
  const isValid = loginValidator.safeParse(req.body);

  if (!isValid.success) {
    const errors = isValid.error._zod.def.map((err) => {
      return `${err.message}`;
    });
    throw new AppError("Error while validating", 400, { errors });
  }

  // Extract email and password from validated user fields
  const { email: inputted_email, password: inputted_password } = isValid.data;

  // Find user by email
  const user = await dbClient.query(
    "SELECT user_id, hashed_password, role FROM users WHERE email=$1",
    [inputted_email]
  );

  if (user.rowCount < 1 || user.rows.length < 1)
    throw new AppError("Email not found", 404);

  const { user_id, hashed_password, role } = user.rows[0];

  // verifyPassword
  const validPassword = await verifyPassword(
    inputted_password,
    hashed_password
  );

  if (!validPassword) throw new AppError("Invalid password!", 401);

  // Generate JWT token and use user_id and role as a payload
  const token = genJWT({ user_id, role });
  if (!token) throw new AppError("Failed to generate a token", 500);

  res.json({
    message: "Successfully logged in!",
    success: true,
    data: { token },
  });
});
export { register, login };
