#!/bin/sh
set -e

# Start the Node.js server in the background
cd /app/server
node dist/index.js &
NODE_PID=$!

# Give the server a moment to bind
sleep 1

# Start nginx in the foreground
nginx -g "daemon off;" &
NGINX_PID=$!

# If either process dies, kill the other and exit
wait_any() {
    wait -n 2>/dev/null || true
    kill "$NODE_PID" "$NGINX_PID" 2>/dev/null || true
}

trap wait_any TERM INT

# Wait for both
wait "$NODE_PID" "$NGINX_PID"
