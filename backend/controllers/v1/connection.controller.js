import userConnectionValidator from "../../schemas/connection.schema.js";
import { dbClient } from "../../config/db.js";
import AppError from "../../utils/AppError.js";
import wrapAsync from "../../utils/wrapAsync.js";

// This function validates input data using the userConnectionValidator schema.
// If validation passes, it returns the validated data with success=true.
// If validation fails, it collects error messages, wraps them in an AppError, and sets success=false.
const validateData = (unvalidatedData) => {
  const validatedData = userConnectionValidator.safeParse(unvalidatedData);
  const result = { success: true, data: validatedData.data, errors: {} };

  if (!validatedData.success) {
    const errors = result.data.error._zod.def.map((err) => {
      return `${err.message}`;
    });
    result.errors = new AppError("Error while validating", 400, {
      errors,
    });
    result.success = false;
  }

  return result; // Returns the validated data not the complete zod OBJ
};

const establishConnection = wrapAsync(async (req, res) => {
  // Get all required fields
  const unvalidatedData = {
    sender_id: req.token.user_id, // extracted from token
    receiver_id: req.body.receiver_id, // extracted from request body
    status: "pending",
  };

  // Validate Data
  const validatedData = validateData(unvalidatedData);
  if (!validatedData.success) throw validatedData.errors;

  const {
    sender_id, // extracted from token
    receiver_id, // extracted from request body
    status,
  } = validatedData.data;

  // Verify if sender and receiver ever exist in database
  const existingUsersDBQuery = await dbClient.query(
    "SELECT user_id FROM users WHERE user_id = $1 OR user_id = $2",
    [sender_id, receiver_id]
  );

  // Throw error if users are not available or if the rows is only one.
  if (existingUsersDBQuery.rows.length < 2 || existingUsersDBQuery.rowCount < 2)
    throw new AppError("Users not found", 404);

  // Establish a connection
  await dbClient.query(
    `
        INSERT INTO user_connections
          (sender_id, receiver_id, status)
        VALUES
          ($1 ,$2, $3);
    `,
    [sender_id, receiver_id, status]
  );

  res.json(validatedData);
});

const blockConnection = wrapAsync(async (req, res) => {});
const unblockConnection = wrapAsync(async (req, res) => {});
const acceptConnection = wrapAsync(async (req, res) => {});
const rejectConnection = wrapAsync(async (req, res) => {});
const cancelConnection = wrapAsync(async (req, res) => {});
const removeConnection = wrapAsync(async (req, res) => {});
const receivedConnectionRequest = wrapAsync(async (req, res) => {});
const sentConnectionRequest = wrapAsync(async (req, res) => {});

export {
  establishConnection,
  acceptConnection,
  rejectConnection,
  cancelConnection,
  removeConnection,
  blockConnection,
  unblockConnection,
  receivedConnectionRequest,
  sentConnectionRequest,
};
