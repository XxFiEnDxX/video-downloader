#!/bin/bash

# Quick deployment script
# Builds and runs the app in production mode

set -e  # Exit on error

echo "🚀 Deploying Instagram Reel Downloader..."
echo ""

# Build the app
./build.sh

# Run the server
echo "🌐 Starting server on port 8000..."
cd backend
./venv/bin/python main.py
