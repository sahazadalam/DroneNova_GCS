#!/bin/bash

# Wait for database to be ready
echo "Waiting for database..."
sleep 5

# Start the backend server
echo "Starting Urban Mirtalx GCS Backend..."
python app/main.py