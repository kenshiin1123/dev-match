import { dbClient } from "../../config/db.js";
import AppError from "../../utils/AppError.js";
import wrapAsync from "../../utils/wrapAsync.js";
import { isEmployerFn, verifyReqBody } from "../../utils/jobpost.util.js";

const postJob = wrapAsync(async (req, res) => {
  // Validate extracted job post information from request body
  let validInfo = verifyReqBody("post", req);
  if (!validInfo.success) throw validInfo.errors;
  else validInfo = validInfo.data;

  // Extract the user_id from request
  const user_id = req.token.user_id;

  // This verifies if the user's role is employer and throw an error if not
  const isEmployer = await isEmployerFn(user_id);
  if (!isEmployer.success) throw isEmployer.error;

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
  // Verify if user is an employer
  const isEmployer = await isEmployerFn(user_id);
  if (!isEmployer.success) throw isEmployer.error;
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
    throw AppError("Job not found", 404);
  }

  const jobQuery = await dbClient.query(
    "SELECT * FROM jobposts WHERE jobpost_id=$1;",
    [jobpost_id]
  );

  if (jobQuery.rowCount < 1) {
    throw AppError("Job not found", 404);
  }

  const job = jobQuery.rows[0];

  res.json({
    message: "Successfully retrieved job data",
    success: true,
    data: job,
  });
});

const applyJob = wrapAsync(async (req, res) => {});

export { postJob, patchJob, getListOfJobs, getJob, applyJob };
