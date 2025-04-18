# Job-Control Service

The **Job-Control Service** is the orchestrator for executing declarative, step-based jobs composed of parallel tasks. It interprets job definition files, coordinates service invocations via discovery, manages shared-state updates, and supports safe rollback using a reversible task stack.

---

## 📄 Description

- Executes jobs defined in structured JSON documents
- Each job has ordered `steps`, each containing one or more `tasks`
- Tasks in a step run in **parallel**
- Steps are executed **sequentially**
- Coordinates with:
  - 🔎 Discovery Service (`tag`-based service lookup)
  - 🧾 Shared-State Service (dynamic data wiring)
  - 🧱 Composable Engine Services (via `/forms` interface)

---

## 🚀 How to Run

```bash
PORT=4700 node index.js
```

- Default port: `4700`
- Requires `discovery` and `shared-state` services to be running

---

## 🔗 Endpoints

### `POST /run-job`

Executes a job-control document.

#### Example Request
```json
{
  "name": "example-job",
  "sharedStateURL": "http://localhost:4500/state/example",
  "steps": [
    {
      "name": "step-1",
      "tasks": [
        {
          "tag": "uppercase",
          "input": {
            "input": {
              "$fromState": "/message",
              "default": "hello"
            }
          },
          "storeResultAt": [
            {
              "targetPath": "/results/text",
              "onlyOnStatus": [200]
            }
          ]
        }
      ]
    }
  ]
}
```

#### Example Response
```json
{
  "jobId": "generated-uuid",
  "status": "completed"
}
```

---

### `GET /forms`

Hypermedia description of the service interface.  
Returns available rels, methods, and input/output hints.

---

## 🧪 Features

### `$fromState`
Reference values from shared state using JSON Pointer syntax.

```json
"input": {
  "status": {
    "$fromState": "/user/status",
    "default": "active"
  }
}
```

- Supports deeply nested and recursive structures
- Logs when a `default` value is used

### `storeResultAt`
Store task output back into shared-state:

- `targetPath`: where to write
- `sourcePath`: partial data from the result
- `onlyOnStatus`: conditionally write based on HTTP status

### Revert Stack
On error, previously successful tasks are reversed using a LIFO execution log and the `/revert` endpoint.

---

## 🧰 Development Notes

- Supports `enabled: false` for skipping steps or tasks
- Automatically merges inline `sharedState` into the document via PATCH
- Logs all operations with structured output
- Tolerant of unknown `mode` values (treated as no-ops)

---

## ✅ Validation Support

This service supports validation against a JSON Schema:  
📄 `job-control.schema.final.json`  
Use it to validate jobs before submission.

---

## 🛣️ Future Enhancements

- Transform functions in `storeResultAt`
- Conditional task execution with `when` expressions
- Retry logic and timeouts
- Parallelism limits and mapping
- Agent-executed dynamic step expansion