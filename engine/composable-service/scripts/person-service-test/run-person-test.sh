#!/bin/bash

# 1. Create the shared-state document
curl -s -X POST http://localhost:4500/state \
  -H "Content-Type: application/json" \
  -d @seed-person.json \
  -o response.json

# cat response.json

STATE_URL="http://localhost:4500/state/q1w2e3r4"

echo "Created shared state: $STATE_URL"

# 2. Replace sharedStateURL in job-control file
jq --arg url "$STATE_URL" '.sharedStateURL = $url' job-person-happy.template.json > job-person-happy.json

cat job-person-happy.json

# 3. Execute the job
curl -s -X POST http://localhost:4600/execute \
 -H "Content-Type: application/json" \
 -d @job-person-happy.json | jq

# 4. Check final shared-state document
curl -s "$STATE_URL" | jq

# 5. Clean up
curl -s -X DELETE "$STATE_URL"
