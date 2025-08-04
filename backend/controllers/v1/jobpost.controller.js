import jobPostValidator from "../../schemas/job.schema.js";
import { dbClient } from "../../config/db.js";
import AppError from "../../utils/AppError.js";

const wrapAsync = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => {
      return next(err);
    });
  };
};

const postJob = wrapAsync(async (req, res) => {
  // Validate extracted job post information from request body
  const validInfo = jobPostValidator.safeParse(req.body);
  if (!validInfo.success) {
    const errors = isValid.error._zod.def.map((err) => {
      return `${err.message}`;
    });
    throw new AppError("Error while validating", 400, { errors });
  }

  // Extract the user_id from request
  const user_id = req.token.user_id;
  // Get the user information in database
  const user = await dbClient.query("SELECT role FROM users WHERE user_id=$1", [
    user_id,
  ]);
  // Verify if user is an employer
  if (user.rows[0].role !== "employer") {
    // Throw error if the user's role is not employer
    throw new AppError("Failed to post a job", 401);
  }

  // Extract validated data
  const {
    title,
    description,
    company,
    location,
    salary_min,
    salary_max,
    required_skills,
    employment_type,
    remote,
  } = validInfo.data;

  // Save job post in database
  await dbClient.query(
    `INSERT INTO jobposts
        (posted_by, title, description, company, location, salary_min, salary_max, required_skills, employment_type, remote)
     VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      user_id,
      title,
      description,
      company,
      location,
      salary_min,
      salary_max,
      required_skills,
      employment_type,
      remote,
    ]
  );

  res.json({ message: "Successfully posted a job", success: true });
});

export { postJob };
