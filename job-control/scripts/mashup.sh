# run job
# actual job details in mashup.json

clear

# shared state-id
id=628bd965-fc5e-43cf-8e8d-bea39154d0fd

# clean out any old state
curl -s -X DELETE http://localhost:4500/state/$id

# create new/clean state document
curl -s -X POST http://localhost:4500/state \
  -H "Content-Type: application/json" \
  -d '{"id": "'$id'", "message": "time check"}' | jq .

# run the job
curl -s -X POST http://localhost:4700/run-job \
  -d "@mashup.json" \
  -H "content-type: application/json" | jq .

# read resulting state document
curl -s http://localhost:4500/state/$id | jq .

# clean out any old state
curl -s -X DELETE http://localhost:4500/state/$id

# eof
