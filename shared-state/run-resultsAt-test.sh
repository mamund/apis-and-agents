# testing shared state feature

clear

curl -X DELETE http://localhost:4500/state/abc123 -i 

# REQUEST 
curl -X POST http://localhost:4500/state \
  -H "Content-Type: application/json" \
  -d '{"id":"http://localhost:4500/state/abc123"}' | jq .

# RESPONSE:
# { "stateURL": "http://localhost:4500/state/abc123" }

# REQUEST
curl -X POST http://localhost:4700/run-job \
  -H "Content-Type: application/json" \
  -d '{
    "sharedStateURL": "http://localhost:4500/state/abc123",
    "steps": [
      {
        "tasks": [
          {
            "tag": "uppercase",
            "input": {
              "input": "hello world"
            },
            "storeResultAt": [
              {
                "targetPath": "/results/full"
              },
              {
                "sourcePath": "/",
                "targetPath": "/results/textOnly"
              }
            ]
          }
        ]
      }
    ]
  }' | jq .

# REQUEST
curl http://localhost:4500/state/abc123 | jq .

# RESPONSE 
# {
#  "results": {
#    "full": { "text": "HELLO WORLD" },
#    "textOnly": "HELLO WORLD"
#  }
# }

# REQUEST
curl -X DELETE http://localhost:4500/state/abc123 -i 


