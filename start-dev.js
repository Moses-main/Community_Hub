import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '.env') });

// Verify required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Error: ${envVar} is not set in .env file`);
    process.exit(1);
  }
  console.log(`✅ ${envVar} is set`);
}

console.log('Starting server with debug logging...');

// Start the server
import('./server/server.ts').catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
