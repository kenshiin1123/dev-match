import { Client } from "pg";
import "dotenv/config";

const {
  SQL_HOST: host,
  SQL_USER: user,
  SQL_PORT: port,
  SQL_PASSWORD: password,
  SQL_DATABASE: database,
} = process.env;

const dbClient = new Client({
  host,
  user,
  port,
  password,
  database,
});

const connectDB = () => {
  dbClient
    .connect()
    .then(() => console.log("PostgreSQL Connected!"))
    .catch((err) => console.error("Connection error:", err));
};

export { dbClient };
export default connectDB;
