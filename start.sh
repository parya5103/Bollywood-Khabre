#!/bin/bash

echo "Starting CinePulse AI Platform..."

# Ensure we have execute permissions for this script
chmod +x "$0"

# Start Ollama locally if installed
if command -v ollama >/dev/null 2>&1; then
    echo "Starting Ollama..."
    ollama serve &
    sleep 5 # Wait for Ollama to start
else
    echo "Ollama is not installed. AI features will fail. See PORTAL_SETUP.md for instructions."
fi

# We assume the project is split into frontend and backend folders
# Start Backend
if [ -d "backend" ]; then
    echo "Starting Backend..."
    cd backend
    npm install
    npm run start &
    cd ..
else
    echo "Backend folder not found. Are you running this script in the root directory?"
fi

# Start Frontend
if [ -d "frontend" ]; then
    echo "Starting Frontend..."
    cd frontend
    npm install
    npm run dev &
    cd ..
else
    echo "Frontend folder not found."
fi

echo "CinePulse AI is running!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"

# Wait for background processes
wait
