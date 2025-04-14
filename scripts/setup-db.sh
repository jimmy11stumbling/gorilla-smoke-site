#!/bin/bash
# Script to set up the database

echo "🔄 Setting up database..."

# Run the database migration
echo "🛠️ Running database migrations..."
npx drizzle-kit push

# Seed the menu data
echo "🌱 Seeding the database..."
npx tsx scripts/seed-menu.ts

echo "✅ Database setup complete!"