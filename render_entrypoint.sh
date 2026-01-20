#!/bin/bash
set -e

# Start Memcached in the background
echo "Starting Memcached..."
memcached -u root -d

# Wait a moment for memcached to start
sleep 2

# Run database setup / migrations
echo "Running Database Setup..."
# Use configuration from environment variables
python3 rootthebox.py --setup=prod

# Start the application
echo "Starting RootTheBox..."
python3 rootthebox.py --start
