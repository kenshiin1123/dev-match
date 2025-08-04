import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;
const { sign, verify } = jwt;
const option = { expiresIn: "1h" };

const genJWT = (payload_obj) => {
  return sign(payload_obj, JWT_SECRET, option);
};

const verifyJWT = (token) => {};

export { genJWT };
