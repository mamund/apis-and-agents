#!/bin/bash

# run a job

job-runner todo-test.json \
    --state todo-test-state.json  \
    --overwrite \
    --emit \
    --keep | jq .
        
# EOF   
