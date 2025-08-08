import { dbClient } from "../config/db.js";

const userExist = async (user_id) => {
  const user = await dbClient.query("SELECT name FROM users WHERE user_id=$1", [
    user_id,
  ]);

  if (user.rows.length < 1 || user.rowCount < 1) {
    return false;
  }
  return true;
};

export { userExist };
