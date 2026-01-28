import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Parse the database URL
const connectionString = process.env.DATABASE_URL;

// Configure the connection with SSL
const sslConfig = {
  rejectUnauthorized: false // Only use this in development. For production, use proper certificates
};

export const pool = new Pool({
  connectionString,
  ssl: sslConfig
});

export const db = drizzle(pool, { schema });
