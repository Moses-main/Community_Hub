import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import config from "./config";

const { Pool } = pg;

// Use DATABASE_URL if provided, otherwise fall back to the default from config.
// This allows the server to start in development even when a database
// environment variable has not been explicitly configured.
const connectionString = process.env.DATABASE_URL || config.database.url;

// Configure the connection with SSL (relaxed for development)
const sslConfig = {
  rejectUnauthorized: false, // Only use this in development. For production, use proper certificates
};

export const pool = new Pool({
  connectionString,
  ssl: sslConfig,
});

export const db = drizzle(pool, { schema });
