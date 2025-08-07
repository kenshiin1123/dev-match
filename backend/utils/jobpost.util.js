import jobPostValidator, { updateJobSchema } from "../schemas/job.schema.js";

const isEmployerFn = async (user_id) => {
  const result = {
    success: true,
    error: new AppError("Failed to post a job", 401),
  };
  // Get the user information in database
  const user = await dbClient.query("SELECT role FROM users WHERE user_id=$1", [
    user_id,
  ]);
  // Verify if user is an employer
  if (user.rows[0].role !== "employer") {
    result.success = false;
  }
  return result;
};

const verifyReqBody = (method, req) => {
  const result = { success: true, data: {}, errors: new AppError() };
  method = method.toLowerCase();

  switch (method) {
    case "post":
      result.data = jobPostValidator.safeParse(req.body);
      break;
    case "patch":
      result.data = updateJobSchema.safeParse(req.body);
      break;
  }
  if (!result.data.success) {
    const errors = result.data.error._zod.def.map((err) => {
      return `${err.message}`;
    });
    result.errors = new AppError("Error while validating", 400, { errors });
    result.success = false;
  }

  return result;
};

export { isEmployerFn, verifyReqBody };
