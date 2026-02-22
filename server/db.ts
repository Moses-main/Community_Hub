import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import config from "./config";

const { Pool } = pg;

// Use DATABASE_URL if provided, otherwise fall back to the default from config.
// Force sslmode=no-verify in the connection string for Aiven PostgreSQL
const connectionString = (process.env.DATABASE_URL || config.database.url)
  .replace('sslmode=require', 'sslmode=no-verify');

// Always use SSL with rejectUnauthorized for Aiven PostgreSQL
export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const db = drizzle(pool, { schema });
