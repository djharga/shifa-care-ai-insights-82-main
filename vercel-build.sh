#!/bin/bash

# Vercel Build Script for Shifa Care AI Insights

echo "🚀 Starting build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run type checking
echo "🔍 Running type checking..."
npx tsc --noEmit

# Build the project
echo "🏗️ Building project..."
npm run build

echo "✅ Build completed successfully!" 