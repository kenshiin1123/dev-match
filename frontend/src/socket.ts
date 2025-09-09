import { io } from "socket.io-client";
const { VITE_API_BASE_URL } = import.meta.env;
export const socket = io(VITE_API_BASE_URL);
