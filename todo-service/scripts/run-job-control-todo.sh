#!/bin/bash

set -e

SHARED_STATE_ID="job-test-001"
SHARED_STATE_URL="http://localhost:4500/state/${SHARED_STATE_ID}"
JOB_CONTROL_URL="http://localhost:4700/run-job"
JOB_FILE="job-test-todo-service.json"
# JOB_FILE="todo-step-1.json"

echo "Step 1: Create shared state document..."
curl -s -X POST http://localhost:4500/state \
  -H "Content-Type: application/json" \
  -d "{ \"id\": \"${SHARED_STATE_ID}\", \"state\": {} }"
echo -e "\nShared state created: ${SHARED_STATE_URL}"

echo "Step 2: Inject shared state URL into job-control file..."
cp ${JOB_FILE} tmp-${JOB_FILE}
# jq --arg stateUrl "${SHARED_STATE_URL}" '.job.sharedState = $stateUrl' tmp-${JOB_FILE} > job-to-run.json
jq --arg stateUrl "${SHARED_STATE_URL}" '.sharedStateURL = $stateUrl' tmp-${JOB_FILE} > job-to-run.json

echo "Step 2a. Show Updated Job file ..."
cat job-to-run.json | jq .
echo -e

echo "Step 3: Run job-control with modified job file..."
curl -s -X POST ${JOB_CONTROL_URL} \
  -H "Content-Type: application/json" \
  -d @job-to-run.json
echo -e "\nJob submitted."

echo "Step 4: Retrieve final shared state result..."
curl -s ${SHARED_STATE_URL} | jq
echo -e "\nShared state retrieved."

echo "Step 5: Clean up shared state..."
curl -s -X DELETE ${SHARED_STATE_URL}
echo -e "\nShared state deleted."

rm -f tmp-${JOB_FILE} job-to-run.json

echo "✅ All steps completed."
