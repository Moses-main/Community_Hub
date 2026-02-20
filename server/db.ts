import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import config from "./config";

const { Pool } = pg;

// Use DATABASE_URL if provided, otherwise fall back to the default from config.
const connectionString = process.env.DATABASE_URL || config.database.url;

// For Render PostgreSQL, SSL is required
export const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === "production" 
    ? { rejectUnauthorized: false }
    : false,
});

export const db = drizzle(pool, { schema });
