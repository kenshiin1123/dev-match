import { dbClient } from "../../config/db.js";
import AppError from "../../utils/AppError.js";
import wrapAsync from "../../utils/wrapAsync.js";
import { getUserSocketId, io } from "../../index.js";

const postMessage = async (evt, data, socket) => {
  const sender_id = socket.data.user.user_id;
  const receiver_id = data.receiver_id;
  const content = data.content;

  if (!sender_id || !receiver_id || !content) {
    throw new Error(
      "Missing required fields: sender_id, receiver_id, and content are required."
    );
  }

  const existingReceiver = await dbClient.query(
    "SELECT user_id FROM users WHERE user_id = $1 OR user_id = $2",
    [sender_id, receiver_id]
  );

  if (existingReceiver.rowCount < 2) {
    throw new Error("Sender or receiver not found");
  }

  const messageQuery = await dbClient.query(
    "INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *",
    [sender_id, receiver_id, content]
  );

  const newMessage = await messageQuery.rows[0];

  const receiverSocketId = getUserSocketId(receiver_id);
  const senderSocketId = getUserSocketId(sender_id);
  return io.to(senderSocketId).to(receiverSocketId).emit(`${evt}_response`, {
    message: "Successfully sent a message",
    success: true,
    data: newMessage,
  });
};

const retrieveUserContacts = wrapAsync(async (req, res) => {
  const user_id = req.token.user_id;

  // Query to get unique conversation partners from both accepted connections and messages
  const unique_conversation_partners = `
  WITH unique_conversation_partners AS (
    SELECT
      CASE
        WHEN uc.sender_id = $1 THEN uc.receiver_id
        ELSE uc.sender_id
      END AS partner_id
    FROM user_connections uc
    WHERE
      uc.status = 'accepted' AND (uc.sender_id = $1 OR uc.receiver_id = $1)

    UNION

    SELECT
      CASE
        WHEN m.sender_id = $1 THEN m.receiver_id
        ELSE m.sender_id
      END AS partner_id
    FROM messages m
    WHERE
      m.sender_id = $1 OR m.receiver_id = $1
  ),
`;

  // Query to get the latest message for each conversation partner
  const latest_messages = `
  latest_messages AS (
    SELECT
      CASE
        WHEN m.sender_id = $1 THEN m.receiver_id
        ELSE m.sender_id
      END AS conversation_partner_id,
      m.content AS recent_message,
      m.created_at,
      ROW_NUMBER() OVER (
        PARTITION BY (CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END)
        ORDER BY m.created_at DESC
      ) as rn
    FROM messages m
    WHERE
      m.sender_id = $1 OR m.receiver_id = $1
  )
`;

  // Final SELECT query to combine unique partners with their latest messages and user details
  const select = `
  SELECT
    u.user_id,
    u.name,
    u.avatar,
    u.avatar_content_type,
    lm.recent_message,
    lm.created_at
  FROM
    unique_conversation_partners ucp
  JOIN
    users u ON ucp.partner_id = u.user_id
  LEFT JOIN
    latest_messages lm ON ucp.partner_id = lm.conversation_partner_id AND lm.rn = 1
  ORDER BY lm.created_at DESC NULLS LAST
`;

  const query = await dbClient.query(
    `${unique_conversation_partners} ${latest_messages} ${select}`,
    [user_id]
  );

  res.json({
    message: "Successfully retrieved user contacts",
    success: true,
    data: query.rows,
  });
});

const retrieveUserMessages = wrapAsync(async (req, res) => {
  const user_id = req.token.user_id;
  const { receiver_id } = req.params;

  if (!user_id || !receiver_id) {
    return res.json({
      message: "Validation failure, user ID and receiver_id is required!",
      success: false,
    });
  }

  const existingReceiverQuery = await dbClient.query(
    "SELECT user_id FROM users WHERE user_id = $1",
    [receiver_id]
  );

  if (existingReceiverQuery.rows < 1) {
    throw new AppError("User not found", 404);
  }

  const messagesQuery = await dbClient.query(
    "SELECT * FROM messages WHERE sender_id = $1 AND receiver_id = $2 OR sender_id = $2 AND receiver_id = $1",
    [user_id, receiver_id]
  );

  const messages = messagesQuery.rows;
  return res.json({
    message: "Successfully Retrieved Messages",
    success: true,
    data: messages,
  });
});

export { postMessage, retrieveUserContacts, retrieveUserMessages };
