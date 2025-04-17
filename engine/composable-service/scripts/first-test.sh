curl -X POST http://localhost:4600/execute \
  -H "Content-Type: application/json" \
  -d '{
    "command": "create",
    "resource": "person",
    "id": "q1w2e3r4",
    "payload": {
      "givenName": "Alice",
      "familyName": "Example",
      "email": "alice@example.com"
    }
  }' | jq .

