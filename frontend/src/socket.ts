import { io } from "socket.io-client";
const { VITE_API_ORIGIN } = import.meta.env;
export const socket = io(VITE_API_ORIGIN);
