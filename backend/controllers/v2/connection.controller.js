import { dbClient } from "../../config/db.js";

const establishConnection = async (data, socket) => {
  // Get all required fields
  const extractedData = {
    sender_id: data.sender_id,
    receiver_id: data.receiver_id,
    status: "pending",
  };

  console.log(data);

  const {
    sender_id, // extracted from token
    receiver_id, // extracted from request body
    status,
  } = extractedData;

  console.log(sender_id, receiver_id);

  // Prevent users from connecting to themselves
  if (sender_id === receiver_id)
    if (sender_id === receiver_id) {
      throw new Error("You cannot establish a connection with yourself.");
    }

  // Prevents connecting to connected users
  const existingConnection = await dbClient.query(
    "SELECT * FROM user_connections WHERE sender_id = $1 AND receiver_id = $2",
    [sender_id, receiver_id]
  );

  if (existingConnection.rowCount > 0) {
    throw new Error("A connection request between these users already exists.");
  }

  // Verify if sender and receiver ever exist in database
  const existingUsersDBQuery = await dbClient.query(
    "SELECT user_id FROM users WHERE user_id = $1 OR user_id = $2",
    [sender_id, receiver_id]
  );

  // Throw error if users are not available or if the rows is only one.
  if (
    existingUsersDBQuery.rows.length < 2 ||
    existingUsersDBQuery.rowCount < 2
  ) {
    throw new Error("Users not found", 404);
  }

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

  const newConnectionQuery = await dbClient.query(
    "SELECT connection_id FROM user_connections WHERE sender_id = $1 AND receiver_id = $2",
    [sender_id, receiver_id]
  );

  const newConnection = newConnectionQuery.rows[0];

  return socket.emit("establish_connection_response", {
    message: "Successfully sent a connection request",
    success: true,
    data: newConnection,
  });
};

export { establishConnection };
