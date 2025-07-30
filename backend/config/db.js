import mongoose from "mongoose";
import "dotenv/config";

const { connect, connection } = mongoose;
const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = () => {
  connect(MONGODB_URI);
  connection.on("error", console.error.bind("Connection Error"));
  connection.once("open", () => {
    console.log("MongoDB connected!");
  });
};

export default connectDB;
