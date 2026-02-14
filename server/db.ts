import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import config from "./config";

const { Pool } = pg;

// Use DATABASE_URL if provided, otherwise fall back to the default from config.
const connectionString = process.env.DATABASE_URL || config.database.url;

console.log('DATABASE_URL:', connectionString ? 'set' : 'not set');

// For Render PostgreSQL, handle SSL properly
export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const db = drizzle(pool, { schema });
