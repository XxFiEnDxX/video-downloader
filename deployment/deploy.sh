#!/bin/bash

# ========================================
# Manual Deployment Script
# Use this for manual updates to the server
# ========================================

set -e  # Exit on any error

echo "🚀 Starting deployment..."

# Navigate to project directory
cd /var/www/instagram-downloader

# Pull latest code from GitHub
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Update backend dependencies (if requirements.txt changed)
echo "📦 Updating backend dependencies..."
cd backend
source venv/bin/activate
pip install -r requirements.txt --quiet
deactivate
cd ..

# Build frontend
echo "🔨 Building frontend..."
cd frontend
npm install --silent
npm run build
cd ..

# Restart backend service
echo "🔄 Restarting backend service..."
sudo systemctl restart instagram-downloader

# Wait for service to start
sleep 3

# Check service status
if systemctl is-active --quiet instagram-downloader; then
    echo "✅ Deployment successful! Service is running."
    echo "🌐 Visit: http://$(hostname -I | awk '{print $1}')"
else
    echo "❌ Deployment failed! Service is not running."
    echo "Check logs: sudo journalctl -u instagram-downloader -n 50"
    exit 1
fi

echo "✨ Deployment complete!"
