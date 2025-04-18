#!/bin/bash

clear

JOB_CONTROL=4700
SHARED_STATE=4500

# 1. Create the shared-state document
curl -s -X POST http://localhost:$SHARED_STATE/state \
  -H "Content-Type: application/json" \
  -d @seed-person.json \
  -o response.json

# cat response.json

STATE_URL="http://localhost:4500/state/q1w2e3r4"

echo "Created shared state: $STATE_URL"

# 2. Replace sharedStateURL in job-control file
jq --arg url "$STATE_URL" '.sharedStateURL = $url' job-person-happy.template.json > job-person-happy.json

# cat job-person-happy.json

# 3. Execute the job
curl -X POST http://localhost:$JOB_CONTROL/run-job \
 -H "Content-Type: application/json" \
 -d @job-person-happy.json 

# 4. Check final shared-state document
curl -s "$STATE_URL" | jq

# 5. Clean up
curl -s -X DELETE "$STATE_URL"
