#!/bin/bash

mkdir -p logs

# Start DISCO
echo "Starting discovery..."
node discovery/index.js > logs/discovery.log 2>&1 &
sleep 1

# Start Shared State
echo "Starting shared-state..."
node shared-state/index.js > logs/shared-state.log 2>&1 &
sleep 1

# Start Job Control
echo "Starting job-control..."
node job-control/index.js > logs/job-control.log 2>&1 &
sleep 1

# Start Services
echo "Starting service-a..."
node service-a/index.js > logs/service-a.log 2>&1 &

echo "Starting service-b..."
node service-b/index.js > logs/service-b.log 2>&1 &

echo "Starting service-c-reader..."
node service-c-reader/index.js > logs/service-c-reader.log 2>&1 &

echo "Starting service-c-writer..."
node service-c-writer/index.js > logs/service-c-writer.log 2>&1 &

echo "Starting todo-service..."
node todo-service/index.js > logs/todo-service.log 2>&1 &

echo "Starting composable-engine..."
node engine/index.js > logs/engine.log 2>&1 &

echo "All services launched. Logs available in ./logs/"
