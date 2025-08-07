import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for some environments, adjust based on your setup
  },
});

const connectDB = () => {
  pool
    .query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
    )
    .then((result) => {
      console.log(
        `Connected to NEON PostgreSQL with a total of ${result.rows.length} tables!`
      );
    })
    .catch((err) => {
      console.err(err);
    });
};

export { pool as dbClient };
export default connectDB;
