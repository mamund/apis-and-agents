# Job-Control Service Guide

## Overview

The **Job-Control Service** is the orchestrator in the composable service platform. It executes declarative jobs defined in structured JSON, coordinating steps, resolving shared state references, and managing service interactions.

Each job consists of one or more sequential `steps`, each of which may contain multiple `tasks` that run in parallel.

---

## Job Structure

```json
{
  "name": "my-job",
  "sharedStateURL": "http://localhost:4500/state/job-123",
  "steps": [
    {
      "name": "step-one",
      "tasks": [
        {
          "tag": "todo",
          "input": {
            "command": "create",
            "resource": "todo",
            "id": "job-001"
          },
          "storeResultAt": "/state/todoCreated"
        }
      ]
    }
  ]
}
```

---

## Key Features

### ✅ Steps and Tasks

- **Steps** are ordered and run sequentially
- **Tasks** within a step run in parallel
- You can disable a step or task using `"enabled": false`

---

### 🔁 `$fromState` (Input Resolution)

Use `$fromState` to pull values from shared state at runtime.

```json
"input": {
  "id": { "$fromState": "/todoCreated/id" }
}
```

---

### 📥 `sharedState` Inline Merge

You can initialize shared state directly in a job document:

```json
"sharedState": {
  "user": { "id": "u001", "role": "editor" }
}
```

This is merged into `sharedStateURL` using a `PATCH` `{ op: "merge" }` call at job start.

---

### 🧾 `storeResultAt` (Result Mapping)

Store task results in shared state:

```json
"storeResultAt": [
  {
    "targetPath": "/todo/output",
    "sourcePath": "data.result",
    "onlyOnStatus": [200]
  }
]
```

- Supports single string, object, or array of result instructions
- JSON Pointer `targetPath` format is required

---

### ⚠️ Revert-on-Failure

If a task fails:
- All previous steps are reverted in reverse order
- Each task must support a `revert` action for full rollback

---

## Execution Endpoint

### `POST /run-job`

Run a job document.

- **Input:** Valid job definition
- **Output:** `{ jobId, status | error }`

---

## Developer Notes

- Expects `discovery` and `shared-state` services to be running
- Unknown `mode` values are skipped (noop)
- All interactions are logged with job IDs
- Compatible with services exposing hypermedia-style `/forms` definitions

