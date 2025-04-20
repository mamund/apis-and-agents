# Job-Control Developer Guide

This guide is for developers who want to **use** the job-control service to coordinate services through composable, declarative jobs.

## Overview

The job-control service executes structured jobs composed of sequential `steps`, each containing one or more `tasks`. It manages:
- Argument resolution via shared state
- Task dispatching via service discovery
- Result storage and state updates

## Getting Started

### 1. Create a Shared State Document

Use the shared-state service:
```bash
curl -X POST http://localhost:4500/state -d '{ "message": "hello" }' -H "Content-Type: application/json"
```

Save the returned `id` and construct the sharedStateURL like:
```
http://localhost:4500/state/<your-id>
```

### 2. Submit a Job

Send a job-control JSON file to:
```bash
curl -X POST http://localhost:4700/run-job -d @job.json -H "Content-Type: application/json"
```

## Job File Structure

```json
{
  "sharedStateURL": "http://localhost:4500/state/<id>",
  "steps": [
    {
      "enabled": true,
      "name": "step-name",
      "tasks": [
        {
          "tag": "service-tag",
          "input": {
            "argName": { "$fromState": "/some/path", "default": "fallback" }
          },
          "storeResultAt": [
            {
              "targetPath": "/results/step",
              "sourcePath": "data/value",
              "onlyOnStatus": [200]
            }
          ]
        }
      ]
    }
  ]
}
```

## Key Features

### `$fromState` Resolution

Dynamically pulls values from the shared-state document:
```json
"input": {
  "status": { "$fromState": "/user/status", "default": "new" }
}
```

Supports:
- Nested structures
- Arrays
- Default values (new)
- Logs fallback usage

### Task Flags

- `enabled: false` — disables task (or entire step)
- `tag` — used to find service via discovery

### Result Wiring

Use `storeResultAt` to persist response values:
- `targetPath`: where to store in shared-state
- `sourcePath`: what part of result to use
- `onlyOnStatus`: restrict when to store (e.g. `200` only)

---

## Debugging Tips

- Use structured logs (`job-failed`, `task-skipped`, etc.)
- Defaults are logged when used
- Unknown or missing tags/services are gracefully skipped