#!/bin/bash
set -e

# Start Memcached in the background
echo "Starting Memcached..."
memcached -u root -d

# Wait a moment for memcached to start
sleep 2

# Debug: Print env vars (excluding password)
echo "SQL_HOST: $SQL_HOST"
echo "SQL_PORT: $SQL_PORT"
echo "SQL_USER: $SQL_USER"
echo "SQL_DIALECT: $SQL_DIALECT"

# Run database setup / migrations
echo "Running Database Setup..."
# Explicitly pass vars to avoid parsing issues
python3 rootthebox.py --setup=prod \
    --sql_dialect=${SQL_DIALECT:-postgresql} \
    --sql_host=${SQL_HOST} \
    --sql_port=${SQL_PORT} \
    --sql_user=${SQL_USER} \
    --sql_password=${SQL_PASSWORD} \
    --sql_database=${SQL_DATABASE}

# Start the application
echo "Starting RootTheBox..."
python3 rootthebox.py --start \
    --sql_dialect=${SQL_DIALECT:-postgresql} \
    --sql_host=${SQL_HOST} \
    --sql_port=${SQL_PORT} \
    --sql_user=${SQL_USER} \
    --sql_password=${SQL_PASSWORD} \
    --sql_database=${SQL_DATABASE}
