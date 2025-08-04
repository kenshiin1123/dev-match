import express from "express";
const router = express.Router();

import { dbClient } from "../../config/db.js";
import AppError from "../../utils/AppError.js";

router.get("/", async (req, res, next) => {
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

router.get("/:user_id", async (req, res) => {
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

export default router;
