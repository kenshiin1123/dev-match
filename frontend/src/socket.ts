import { io } from "socket.io-client";
import { getAuthToken } from "./util/auth";
const { VITE_API_ORIGIN } = import.meta.env;
export const socket = io(VITE_API_ORIGIN, {
  auth: {
    token: getAuthToken(),
  },
});
