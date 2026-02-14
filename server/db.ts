import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import config from "./config";

const { Pool } = pg;

// Use DATABASE_URL if provided, otherwise fall back to the default from config.
const connectionString = process.env.DATABASE_URL || config.database.url;

// For Render PostgreSQL, SSL is handled by sslmode in the connection string
// No additional SSL config needed when using sslmode=require
export const pool = new Pool({
  connectionString,
});

export const db = drizzle(pool, { schema });
