#!/bin/bash

# List of known ports for the services
PORTS=(4000 4001 4100 4200 4300 4400 4500 4600 4602 4700)

echo "Stopping services..."

for PORT in "${PORTS[@]}"; do
  PID=$(lsof -ti tcp:$PORT)
  if [ -n "$PID" ]; then
    echo "Stopping service on port $PORT (PID $PID)"
    kill $PID
  else
    echo "No service running on port $PORT"
  fi
done

echo "All known services attempted to stop."
