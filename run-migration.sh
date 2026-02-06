#!/bin/bash

# Extract database connection details from DATABASE_URL
DB_URL=$(grep DATABASE_URL .env | cut -d '=' -f2-)

# Run the migration using psql with the connection string
PGPASSWORD=$(echo $DB_URL | grep -oP '(?<=:)[^@]+' | cut -d'@' -f1) \
psql "$DB_URL" -f migrations/001_update_users_table.sql
