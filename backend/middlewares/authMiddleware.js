import { validateJWT } from "../utils/token.js";

const authMiddleware = async (req, res, next) => {
  if (req.method == "OPTIONS") {
    return next();
  }

  if (!req.headers.authorization) {
    const message = "NOT AUTH. AUTH HEADER MISSING";
    return res.status(401).json({ message, success: false, token: null });
  }

  const authFragments = req.headers.authorization.split(" ");

  if (authFragments.length !== 2) {
    const message = "NOT AUTH. AUTH HEADER INVALID.";
    return res.status(401).json({ message, success: false, token: null });
  }

  const authToken = authFragments[1];

  try {
    const validatedToken = validateJWT(authToken);
    req.token = validatedToken;
  } catch (error) {
    const message = "NOT AUTH. TOKEN INVALID.";
    return res.status(401).json({ message, success: false, token: null });
  }
  next();
};

export const socketAuthMiddleware = (socket, next) => {
  const authToken = socket.handshake.auth.token;
  if (!authToken) {
    return next(new Error("NOT AUTH. AUTH TOKEN MISSING"));
  }

  try {
    const validatedToken = validateJWT(authToken);
    socket.data.user = validatedToken; // store decoded payload safely
    next();
  } catch (err) {
    return next(new Error("NOT AUTH. TOKEN INVALID."));
  }
};

export default authMiddleware;
