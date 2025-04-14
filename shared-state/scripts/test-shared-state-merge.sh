#!/bin/bash

BASE_URL="http://localhost:4500"
ID="test-123"

echo "🟢 Creating shared state document..."
curl -s -X POST "$BASE_URL/state" \
  -H "Content-Type: application/json" \
  -d '{"id": "'$ID'", "foo": "original", "bar": 1}' | jq

echo "🟡 Merging new values into shared state..."
curl -s -X PATCH "$BASE_URL/state/$ID" \
  -H "Content-Type: application/json" \
  -d '{"op": "merge", "value": { "bar": 42, "baz": "new!" }}' | jq

echo "🔴 Sending invalid merge value (not an object)..."
curl -s -X PATCH "$BASE_URL/state/$ID" \
  -H "Content-Type: application/json" \
  -d '{"op": "merge", "value": "not-an-object"}' | jq

echo "🔴 Sending unsupported operation (replace)..."
curl -s -X PATCH "$BASE_URL/state/$ID" \
  -H "Content-Type: application/json" \
  -d '{"op": "replace", "value": {}}' | jq

echo "📄 Verifying final state..."
curl -s "$BASE_URL/state/$ID" | jq
