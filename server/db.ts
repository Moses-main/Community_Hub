import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import config from "./config";

const { Pool } = pg;

// Use DATABASE_URL if provided, otherwise fall back to the default from config.
const connectionString = process.env.DATABASE_URL || config.database.url;

// Configure SSL for production (Render requires SSL)
const isProduction = process.env.NODE_ENV === 'production';

const sslConfig = isProduction 
  ? { rejectUnauthorized: false }
  : false;

export const pool = new Pool({
  connectionString,
  ssl: sslConfig,
});

export const db = drizzle(pool, { schema });
