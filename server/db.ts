import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import config from "./config";

const { Pool } = pg;

// Use DATABASE_URL if provided, otherwise fall back to the default from config.
const connectionString = process.env.DATABASE_URL || config.database.url;

// For Render PostgreSQL with sslmode=require in the URL, don't set SSL in Pool config
// The SSL is handled by the connection string itself
export const pool = new Pool({
  connectionString,
});

export const db = drizzle(pool, { schema });
