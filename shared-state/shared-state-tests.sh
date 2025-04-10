# testing 

curl -X POST http://localhost:4500/state \
  -H "Content-Type: application/json" \
  -d '{"step": 0, "status": "initialized"}' | jq .

echo .

curl -X POST http://localhost:4500/state \
  -H "Content-Type: application/json" \
  -d '{"id": "job-123", "step": 1, "status": "started"}' | jq .

echo .

curl http://localhost:4500/state/job-123 | jq .

echo .

curl -X POST http://localhost:4500/state/job-123 \
  -H "Content-Type: application/json" \
  -d '{"step": 2, "result": "partial-success"}' | jq .

echo .

curl http://localhost:4500/state/job-123 | jq .

echo .

curl -X DELETE http://localhost:4500/state/job-123 -i

echo .

curl -X DELETE http://localhost:4500/state/nonexistent-id -i


