#!/bin/bash

echo "Create a TODO (no ID)"
curl -s -X POST http://localhost:4001/execute \
  -H "Content-Type: application/json" \
  -d '{
    "command": "create",
    "resource": "todo",
    "payload": {
      "title": "Buy milk",
      "done": false
    }
  }' | jq .
echo -e "\n"

echo "Create a TODO (no ID)"
curl -s -X POST http://localhost:4001/execute \
  -H "Content-Type: application/json" \
  -d '{
    "command": "create",
    "resource": "todo",
    "payload": {
      "title": "Buy eggs",
      "done": false
    }
  }' | jq .
echo -e "\n"

echo "Create a TODO (no ID)"
curl -s -X POST http://localhost:4001/execute \
  -H "Content-Type: application/json" \
  -d '{
    "command": "create",
    "resource": "todo",
    "payload": {
      "title": "Buy tomatoes",
      "done": false
    }
  }' | jq .
echo -e "\n"

echo "Create a TODO with ID 'test-001'"
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
  }' | jq .
echo -e "\n"

echo "Read TODO with ID 'test-001'"
curl -s -X POST http://localhost:4001/execute \
  -H "Content-Type: application/json" \
  -d '{
    "command": "read",
    "resource": "todo",
    "id": "test-001"
  }' | jq .
echo -e "\n"

echo "Update TODO with ID 'test-001'"
curl -s -X POST http://localhost:4001/execute \
  -H "Content-Type: application/json" \
  -d '{
    "command": "update",
    "resource": "todo",
    "id": "test-001",
    "payload": {
      "done": true
    }
  }' | jq .
echo -e "\n"

echo "List all TODOs"
curl -s -X POST http://localhost:4001/execute \
  -H "Content-Type: application/json" \
  -d '{
    "command": "list",
    "resource": "todo"
  }' | jq .
echo -e "\n"

echo "Filter TODOs by title containing 'walk'"
curl -s -X POST http://localhost:4001/execute \
  -H "Content-Type: application/json" \
  -d '{
    "command": "filter",
    "resource": "todo",
    "payload": {
      "title": "walk"
    }
  }' | jq .
echo -e "\n"

echo "Filter TODOs by title containing 'buy'"
curl -s -X POST http://localhost:4001/execute \
  -H "Content-Type: application/json" \
  -d '{
    "command": "filter",
    "resource": "todo",
    "payload": {
      "title": "buy"
    }
  }' | jq .
echo -e "\n"



