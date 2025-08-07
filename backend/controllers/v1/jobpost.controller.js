import { dbClient } from "../../config/db.js";
import AppError from "../../utils/AppError.js";
import wrapAsync from "../../utils/wrapAsync.js";
import { verifyReqBody } from "../../utils/jobpost.util.js";
import * as z from "zod";

const postJob = wrapAsync(async (req, res) => {
  // Validate extracted job post information from request body
  let validInfo = verifyReqBody("post", req);
  if (!validInfo.success) throw validInfo.errors;
  else validInfo = validInfo.data;

  // Extract the user_id from request
  const user_id = req.token.user_id;

  // This verifies if the user's role is employer and throw an error if not
  const role = req.token.role;
  if (role !== "employer") {
    throw new AppError("Cannot post a job", 401);
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

  res.json({
    message: "Successfully posted a job",
    success: true,
    data: {
      ...validInfo.data,
    },
  });
});

const patchJob = wrapAsync(async (req, res) => {
  // Extract the job_id from params
  const jobpost_id = req.params.jobpost_id;

  // Verify if job is available based on the given job_id
  const existingJob = await dbClient.query(
    "SELECT title FROM jobposts WHERE jobpost_id=$1",
    [jobpost_id]
  );

  if (existingJob.rowCount < 1 || existingJob.rows.length < 1) {
    throw new AppError("Job not found", 404);
  }
  // Validate new job information from request body
  let validInfo = verifyReqBody("patch", req);
  if (!validInfo.success) throw validInfo.errors;
  else if (validInfo.success) validInfo = validInfo.data.data;

  // Extract new jobpost information from validated info
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
  } = validInfo;

  // Get user_id from token
  const user_id = req.token.user_id;

  // This verifies if the user's role is employer and throw an error if not
  const role = req.token.role;
  if (role !== "employer") throw new AppError("Cannot post a job", 401);

  // Initiate SQL update
  console.log(validInfo);
  const result = await dbClient.query(
    `
    UPDATE jobposts
    SET title=$1, description=$2, company=$3, location=$4, salary_min=$5, salary_max=$6, required_skills=$7, employment_type=$8, remote=$9
    WHERE posted_by=$10 AND jobpost_id=$11
    `,
    [
      title,
      description,
      company,
      location,
      salary_min,
      salary_max,
      required_skills,
      employment_type,
      remote,
      user_id,
      jobpost_id,
    ]
  );

  return res.json({
    message: "Successfully updated jobpost",
    success: true,
    data: {
      ...validInfo,
    },
  });
});

const getListOfJobs = wrapAsync(async (req, res) => {
  const jobsQuery = await dbClient.query("SELECT * FROM jobposts");
  const jobs = jobsQuery.rows;
  res.json({
    message: "Successfully retrieved jobs",
    success: true,
    data: jobs,
  });
});

const getJob = wrapAsync(async (req, res) => {
  const jobpost_id = req.params.jobpost_id;

  if (!jobpost_id) {
    throw new AppError("Job not found", 404);
  }

  const jobQuery = await dbClient.query(
    "SELECT * FROM jobposts WHERE jobpost_id=$1;",
    [jobpost_id]
  );

  if (jobQuery.rowCount < 1) {
    throw new AppError("Job not found", 404);
  }

  const job = jobQuery.rows[0];

  res.json({
    message: "Successfully retrieved job data",
    success: true,
    data: job,
  });
});

const applyJob = wrapAsync(async (req, res) => {
  const MessageSchema = z
    .string()
    .trim()
    .min(1, "Developer message is required")
    .max(500, "Message must be less than 500 characters");

  const user_id = req.token.user_id;
  const message = req.body.message;

  // Verify if message is available and validate it
  const validatedMessage = MessageSchema.safeParse(message);
  if (!validatedMessage.success) {
    const errors = isValid.error._zod.def.map((err) => {
      return `${err.message}`;
    });
    throw new AppError("Error while validating", 400, { errors });
  }

  // Verify if user exist
  const existingUser = await dbClient.query(
    "SELECT user_id FROM users WHERE user_id = $1",
    [user_id]
  );

  if (existingUser.rowCount < 1) {
    throw new AppError("User not found", 404);
  }

  // This verifies if the user's role is employer and throw an error if not
  const role = req.token.role;
  if (role !== "developer") {
    throw new AppError("Cannot post a job", 401);
  }

  // Verify if jobpost exist
  const jobpost_id = req.params.jobpost_id;

  if (!jobpost_id) {
    throw new AppError("Job Post not found", 404);
  }

  const existingJobPost = await dbClient.query(
    "SELECT * FROM jobposts WHERE jobpost_id = $1",
    [jobpost_id]
  );

  if (existingJobPost.rowCount < 1) {
    throw new AppError("Job Post not found", 404);
  }

  // Create new application

  await dbClient
    .query(
      `
    INSERT INTO applications
      (applicant_id, jobpost_id, message, status, note_from_employer)
    VALUES ($1, $2, $3, $4, $5)
    `,
      [user_id, jobpost_id, message, "applied", ""]
    )
    .catch((err) => {
      if (err.code == 23505) {
        throw new AppError("Already applied to this job", 409);
      } else {
        throw new AppError("Failed to apply to this job", 400);
      }
    });

  res.json({
    message: "Successfully applied to a job",
    success: true,
  });
});

export { postJob, patchJob, getListOfJobs, getJob, applyJob };
