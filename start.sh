#!/bin/bash

# Load environment variables
export $(grep -v '^#' .env | xargs)

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set in .env file"
  exit 1
fi

echo "Starting server with NODE_ENV=development"
NODE_ENV=development npx tsx server/server.ts
