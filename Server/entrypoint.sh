#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status
set -o pipefail

echo "Applying Prisma schema to the database..."
npx prisma db push --accept-data-loss
echo ""

echo "Seeding the database..."
npx prisma generate
npx prisma db seed
echo ""

# Start the application
echo "Starting the application..."
exec "$@"
