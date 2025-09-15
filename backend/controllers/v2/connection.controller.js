import { dbClient } from "../../config/db.js";
import { getUserSocketId } from "../../index.js";

const establishConnection = async (evt, data, socket) => {
  // Get all required fields
  const extractedData = {
    sender_id: socket.data.token.user_id,
    receiver_id: data.receiver_id,
    status: "pending",
  };

  const {
    sender_id, // extracted from socket token
    receiver_id,
    status,
  } = extractedData;

  // Prevent users from connecting to themselves
  if (sender_id === receiver_id)
    throw new Error("You cannot establish a connection with yourself.");

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
    "SELECT * FROM user_connections WHERE sender_id = $1 AND receiver_id = $2",
    [sender_id, receiver_id]
  );

  const newConnection = newConnectionQuery.rows[0];

  const receiverSocketId = getUserSocketId(receiver_id);

  return socket.to(receiverSocketId).emit(`${evt}_response`, {
    message: "Successfully sent a connection request",
    success: true,
    data: newConnection,
  });
};

const removeConnection = async (evt, data, socket) => {
  const user_id = socket.data.token.user_id;
  const connected_user_id = data.connected_user_id;
  const connection_id = data.connection_id;

  // Verify if connection is available
  const existingConnection = await dbClient.query(
    `SELECT * FROM user_connections 
   WHERE connection_id = $1`,
    [connection_id]
  );

  if (existingConnection.rows.length < 1) {
    throw new Error("User connection is not found");
  }

  const { sender_id, receiver_id } = existingConnection.rows[0];

  // Validate if the user is part of this connection
  const isSenderToReceiver =
    user_id === sender_id && connected_user_id === receiver_id;

  const isReceiverToSender =
    user_id === receiver_id && connected_user_id === sender_id;

  if (!isSenderToReceiver && !isReceiverToSender) {
    throw new Error("Invalid connection: user is not part of this connection.");
  }

  await dbClient.query(
    "DELETE FROM user_connections WHERE connection_id = $1 ",
    [connection_id]
  );

  const connectedSocketId = getUserSocketId(connected_user_id);
  return socket.to(connectedSocketId).emit(`${evt}_response`, {
    message: "Successfully removed connection",
    success: true,
    data: { connection_id: connection_id },
  });
};

export { establishConnection, removeConnection };
