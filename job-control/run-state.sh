# run state job

clear

# clean out any old state
curl -X DELETE http://localhost:4500/state/628bd965-fc5e-43cf-8e8d-bea39154d0fd -i

# create new/clean state document
curl -X POST http://localhost:4500/state \
  -H "Content-Type: application/json" \
  -d '{"id": "628bd965-fc5e-43cf-8e8d-bea39154d0fd", "message": "hello dynamic world"}' | jq .

# run the job that reads the state
curl -X POST -d "@job-read-state.json" -H "content-type: application/json" http://localhost:4700/run-job | jq .

# clean out any remaining state
# curl -X DELETE http://localhost:4500/state/628bd965-fc5e-43cf-8e8d-bea39154d0fd  -i 
