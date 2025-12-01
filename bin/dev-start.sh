#!/bin/bash

# Stop any running containers from the old setup
echo "Stopping legacy containers..."
docker compose -f compose.local.yaml down 2>/dev/null || true

# Clean dist folder to avoid conflicts
echo "Cleaning dist folder..."
rm -rf dist/

# Check if Supabase is running
if ! npx supabase status > /dev/null 2>&1; then
    echo "Starting Supabase..."
    npx supabase start
else
    echo "Supabase is already running."
fi

# Show Supabase status
npx supabase status

echo "Starting NestJS application..."
npm run start:dev
