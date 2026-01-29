import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Cache the database connection to reuse across function invocations
let pool: Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!db) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    // Create connection pool with serverless-friendly settings
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      // Serverless-friendly pool settings
      max: 1, // Limit to 1 connection for serverless
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    db = drizzle(pool);
  }

  return db;
}

// Export pool for cleanup if needed
export function getPool() {
  return pool;
}

// Cleanup function for graceful shutdown
export async function closeDb() {
  if (pool) {
    await pool.end();
    pool = null;
    db = null;
  }
}
