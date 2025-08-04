import AppError from "../../utils/AppError.js";
import { patchUserValidator } from "../../schemas/user.schema.js";
import { dbClient } from "../../config/db.js";

const wrapAsync = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err));
  };
};

const getUser = wrapAsync(async (req, res) => {
  const user_id = req.params.user_id;
  if (!user_id) throw new AppError("User id is required!", 422);

  // Find user in database by the id provided

  const user = await dbClient.query(
    "SELECT name, email, skills, company, avatar, avatar_content_type, created_at FROM users WHERE user_id=$1;",
    [user_id]
  );

  // Verify if user is available
  if (user.rows.length < 1 || user.rowCount < 1) {
    throw AppError("User not found!", 404);
  }

  res.json({
    message: "Successfully retrieved user data",
    success: true,
    data: user.rows[0],
  });
});

const getUsers = wrapAsync(async (req, res, next) => {
  try {
    const result = await dbClient.query("SELECT * FROM users");

    if (!result || !result.rows || result.rows.length === 0) {
      throw new AppError("No users found", 404);
    }

    return res.json({
      message: "Successfully retrieved users",
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

const patchUser = wrapAsync(async (req, res) => {
  const isValid = patchUserValidator.safeParse(req.body);

  // Validate user inputs
  if (!isValid.success) {
    const errors = isValid.error._zod.def.map((err) => {
      return `${err.message}`;
    });
    throw new AppError("Error while validating", 400, { errors });
  }

  const { name, location, skills, company } = isValid.data;

  // Get user Id from token
  const user_id = req.token.user_id;

  // Find user
  const user = await dbClient.query("SELECT name FROM users WHERE user_id=$1", [
    user_id,
  ]);

  if (user.rows.length < 1 || user.rowCount < 1) {
    throw new AppError("Update failure: user not found.", 404);
  }

  const queryResult = await dbClient.query(
    "UPDATE users SET name=$1, location=$2, skills=$3, company=$4 WHERE user_id=$5;",
    [name, location, skills, company, user_id]
  );

  res.json({
    message: "Successfully updated user information.",
    success: true,
  });
});

const deleteUser = wrapAsync(async (req, res) => {
  const user_id = req.token.user_id;
  if (!user_id)
    throw new AppError("User ID is required in deleting a user.", 422);

  // Find user
  const user = await dbClient.query("SELECT name FROM users WHERE user_id=$1", [
    user_id,
  ]);

  if (user.rows.length < 1 || user.rowCount < 1) {
    throw new AppError("Deletion failure: user not found.", 404);
  }

  await dbClient.query("DELETE FROM users WHERE user_id=$1", [user_id]);

  res.json({ message: "Successfully deleted user", success: true });
});

export { patchUser, getUser, getUsers, deleteUser };
