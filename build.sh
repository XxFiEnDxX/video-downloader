#!/bin/bash

# Build script for single-server deployment
# This builds the React frontend and prepares the backend to serve it

set -e  # Exit on error

echo "🚀 Building Instagram Reel Downloader for production..."
echo ""

# Step 1: Install frontend dependencies (if needed)
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
echo "✅ Frontend dependencies installed"
echo ""

# Step 2: Build React frontend
echo "🔨 Building React frontend..."
npm run build
echo "✅ Frontend built to backend/static/"
echo ""

# Step 3: Setup Python virtual environment
echo "📦 Setting up Python virtual environment..."
cd ../backend

# Create venv if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
else
    echo "✅ Virtual environment already exists"
fi

# Install dependencies in venv
echo "Installing backend dependencies..."
./venv/bin/pip install -r requirements.txt
echo "✅ Backend dependencies installed"
echo ""

echo "✨ Build complete!"
echo ""
echo "To run in production mode:"
echo "  cd backend"
echo "  source venv/bin/activate  # On Windows: venv\\Scripts\\activate"
echo "  python main.py"
echo ""
echo "Or run directly with venv:"
echo "  cd backend && ./venv/bin/python main.py"
echo ""
echo "Then visit: http://localhost:8000"
