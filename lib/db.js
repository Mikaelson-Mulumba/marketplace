import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" }); // explicitly load your Neon env file

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,              // force SSL
    rejectUnauthorized: false,  // Neon requires this
  },
});

export default pool;
