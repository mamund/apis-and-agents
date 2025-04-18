#!/bin/bash

# Base URL
BASE_URL="http://localhost:4600"
ID="test-123"

echo "Testing CREATE"
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/execute" \
  -H "Content-Type: application/json" \
  -d "{
    \"command\": \"create\",
    \"resource\": \"person\",
    \"id\": \"$ID\",
    \"payload\": {
      \"givenName\": \"Alice\",
      \"familyName\": \"Example\",
      \"email\": \"alice@example.com\"
    }
  }")

echo "$CREATE_RESPONSE" | jq

echo "Testing READ"
curl -s -X POST "$BASE_URL/execute" \
  -H "Content-Type: application/json" \
  -d "{
    \"command\": \"read\",
    \"resource\": \"person\",
    \"id\": \"$ID\"
  }" | jq

echo "Testing UPDATE"
curl -s -X POST "$BASE_URL/execute" \
  -H "Content-Type: application/json" \
  -d "{
    \"command\": \"update\",
    \"resource\": \"person\",
    \"id\": \"$ID\",
    \"payload\": {
      \"telephone\": \"+1-555-1234\"
    }
  }" | jq

echo "Testing STATUS"
curl -s -X POST "$BASE_URL/execute" \
  -H "Content-Type: application/json" \
  -d "{
    \"command\": \"status\",
    \"resource\": \"person\",
    \"id\": \"$ID\",
    \"payload\": {
      \"status\": \"slippy\"
    }
  }" | jq

echo "Testing FILTER"
curl -s -X POST "$BASE_URL/execute" \
  -H "Content-Type: application/json" \
  -d '{
    "command": "filter",
    "resource": "person",
    "payload": {
      "givenName": "ali"
    }
  }' | jq

echo "Testing LIST"
curl -s -X POST "$BASE_URL/execute" \
  -H "Content-Type: application/json" \
  -d '{
    "command": "list",
    "resource": "person"
  }' | jq

echo "Testing DELETE"
curl -s -X POST "$BASE_URL/execute" \
  -H "Content-Type: application/json" \
  -d "{
    \"command\": \"delete\",
    \"resource\": \"person\",
    \"id\": \"$ID\"
  }" | jq
