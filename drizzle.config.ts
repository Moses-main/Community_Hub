import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Please ensure the database is provisioned and the environment variable is set.",
  );
}

// Parse the connection string
const url = new URL(process.env.DATABASE_URL);
const dbName = url.pathname.replace(/^\//, "");

// Extract username and password from URL
const [username, password] = url.username
  ? [url.username, url.password]
  : [undefined, undefined];

// Extract host and port
const host = url.hostname;
const port = url.port ? parseInt(url.port) : 5432;

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    host,
    port,
    user: username,
    password,
    database: dbName,
    ssl: {
      rejectUnauthorized: false, // Only for development
    },
  },
  verbose: true,
});
