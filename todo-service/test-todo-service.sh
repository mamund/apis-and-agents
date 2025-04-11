#!/bin/bash

echo "1. Create a TODO (no ID)"
curl -s -X POST http://localhost:4001/execute \
  -H "Content-Type: application/json" \
  -d '{
    "command": "create",
    "resource": "todo",
    "payload": {
      "title": "Buy milk",
      "done": false
    }
  }'
echo -e "\n"

echo "2. Create a TODO with ID 'test-001'"
curl -s -X POST http://localhost:4001/execute \
  -H "Content-Type: application/json" \
  -d '{
    "command": "create",
    "resource": "todo",
    "id": "test-001",
    "payload": {
      "title": "Walk the dog",
      "done": false
    }
  }'
echo -e "\n"

echo "3. Repeat the create (idempotent)"
curl -s -X POST http://localhost:4001/repeat \
  -H "Content-Type: application/json" \
  -d '{
    "command": "create",
    "resource": "todo",
    "id": "test-001",
    "payload": {
      "title": "Walk the dog",
      "done": false
    }
  }'
echo -e "\n"

echo "4. Read TODO with ID 'test-001'"
curl -s -X POST http://localhost:4001/execute \
  -H "Content-Type: application/json" \
  -d '{
    "command": "read",
    "resource": "todo",
    "id": "test-001"
  }'
echo -e "\n"

echo "5. Update TODO with ID 'test-001'"
curl -s -X POST http://localhost:4001/execute \
  -H "Content-Type: application/json" \
  -d '{
    "command": "update",
    "resource": "todo",
    "id": "test-001",
    "payload": {
      "done": true
    }
  }'
echo -e "\n"

echo "6. Filter TODOs by title containing 'walk'"
curl -s -X POST http://localhost:4001/execute \
  -H "Content-Type: application/json" \
  -d '{
    "command": "filter",
    "resource": "todo",
    "payload": {
      "title": "walk"
    }
  }'
echo -e "\n"

echo "7. List all TODOs"
curl -s -X POST http://localhost:4001/execute \
  -H "Content-Type: application/json" \
  -d '{
    "command": "list",
    "resource": "todo"
  }'
echo -e "\n"

echo "8. Revert creation of TODO with ID 'test-001'"
curl -s -X POST http://localhost:4001/revert \
  -H "Content-Type: application/json" \
  -d '{
    "command": "create",
    "resource": "todo",
    "id": "test-001"
  }'
echo -e "\n"
