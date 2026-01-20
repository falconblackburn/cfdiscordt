FROM python:3.9-slim

# Install system dependencies including memcached and build tools
RUN apt-get update && apt-get install -y \
    memcached \
    gcc \
    libpq-dev \
    libmemcached-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install dependencies
COPY setup/requirements.txt /app/setup/requirements.txt
RUN pip install --no-cache-dir -r setup/requirements.txt && \
    pip install --no-cache-dir psycopg2-binary pylibmc

# Copy the rest of the application
COPY . /app

# Make the entrypoint script executable
COPY render_entrypoint.sh /app/render_entrypoint.sh
RUN chmod +x /app/render_entrypoint.sh

# Environment variables
ENV PYTHONUNBUFFERED=1

# Expose the port
EXPOSE 8888

# Set entrypoint
ENTRYPOINT ["/app/render_entrypoint.sh"]
