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

export default router;
