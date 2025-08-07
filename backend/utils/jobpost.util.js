import jobPostValidator, { updateJobSchema } from "../schemas/job.schema.js";
import AppError from "./AppError.js";

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

export { verifyReqBody };
