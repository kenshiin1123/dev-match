import userConnectionValidator from "../../schemas/connection.schema.js";
import { dbClient } from "../../config/db.js";
import AppError from "../../utils/AppError.js";
import wrapAsync from "../../utils/wrapAsync.js";
import { success } from "zod";

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

  res.json({ message: "Successfully established a connection", success: true });
});

const acceptConnection = wrapAsync(async (req, res) => {
  const connection_id = req.params.connection_id;
  const receiver_id = req.token.user_id;
  const sender_id = req.body.sender_id;

  // Verify if connection is available
  const existingConnection = await dbClient.query(
    `SELECT * FROM user_connections 
   WHERE connection_id = $1 AND receiver_id = $2 AND sender_id = $3`,
    [connection_id, receiver_id, sender_id]
  );

  if (existingConnection.rows.length < 1) {
    throw new AppError("User connection is not found", 404);
  }

  // Ensure that the status is pending and not blocked
  const { status } = existingConnection.rows[0];
  console.log(status);
  if (status !== "pending") {
    throw new AppError(
      `Cannot accept connection: current status is '${status}', expected 'pending'.`,
      422
    );
  }

  await dbClient.query(
    `UPDATE user_connections SET status = 'accepted' WHERE connection_id = $1`,
    [connection_id]
  );

  res.json({ message: "Successfully accepted connection", success: true });
});

const removeConnection = wrapAsync(async (req, res) => {
  const connection_id = req.params.connection_id;
  const user_id = req.token.user_id;
  const connected_user_id = req.body.connected_user_id;

  // Verify if connection is available
  const existingConnection = await dbClient.query(
    `SELECT * FROM user_connections 
   WHERE connection_id = $1`,
    [connection_id]
  );

  if (existingConnection.rows.length < 1) {
    throw new AppError("User connection is not found", 404);
  }

  const { sender_id, receiver_id } = existingConnection.rows[0];

  // Validate if the user is part of this connection
  const isSenderToReceiver =
    user_id === sender_id && connected_user_id === receiver_id;

  const isReceiverToSender =
    user_id === receiver_id && connected_user_id === sender_id;

  if (!isSenderToReceiver && !isReceiverToSender) {
    throw new AppError(
      "Invalid connection: user is not part of this connection.",
      403
    );
  }

  await dbClient.query(
    "DELETE FROM user_connections WHERE connection_id = $1 ",
    [connection_id]
  );

  res.json({ message: "Successfully removed connection", success: true });
});

const receivedConnectionRequest = wrapAsync(async (req, res) => {
  const user_id = req.token.user_id;

  // verify if user is available based on given id
  const existingUser = await dbClient.query(
    "SELECT user_id FROM users WHERE user_id=$1",
    [user_id]
  );

  if (existingUser.rowCount < 1) {
    throw new AppError("User not found", 404);
  }

  // Get user received connections
  // Received Connection Request Query Result
  const queryResult = await dbClient.query(
    "SELECT * FROM user_connections WHERE receiver_id = $1 AND status=$2",
    [user_id, "pending"]
  );

  const receivedConnections = queryResult.rows;

  res.json({
    message: "Successfully retrieved connection requests.",
    success: true,
    data: { receivedConnections },
  });
});

const sentConnectionRequest = wrapAsync(async (req, res) => {
  const user_id = req.token.user_id;

  // verify if user is available based on given id
  const existingUser = await dbClient.query(
    "SELECT user_id FROM users WHERE user_id=$1",
    [user_id]
  );

  if (existingUser.rowCount < 1) {
    throw new AppError("User not found", 404);
  }

  // Get user sent connections
  const queryResult = await dbClient.query(
    "SELECT * FROM user_connections WHERE sender_id = $1 AND status=$2",
    [user_id, "pending"]
  );
  const sentConnections = queryResult.rows;

  res.json({
    message: "Successfully retrieved sent connections.",
    success: true,
    data: { sentConnections },
  });
});

// const blockConnection = wrapAsync(async (req, res) => {});
// const getBlockedConnection = wrapAsync(async (req, res) => {});

export {
  establishConnection,
  acceptConnection,
  removeConnection,
  receivedConnectionRequest,
  sentConnectionRequest,
  // blockConnection,
  // getBlockedConnection,
};
