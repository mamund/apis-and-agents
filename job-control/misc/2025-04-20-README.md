# Job-Control Service

The **Job-Control Service** is the orchestrator for executing declarative, step-based jobs composed of parallel tasks. It interprets job definition files, coordinates service invocations, and manages shared state updates and reversibility.

---

## 📄 Description

- Executes jobs defined in JSON documents
- Each job has ordered `steps`, each containing one or more `tasks`
- Tasks in a step run in **parallel**
- Steps are executed **sequentially**
- Supports:
  - Conditional task execution (`enabled: false`)
  - Shared state lookup (`$fromState`)
  - Revert-on-failure mechanism
  - Inline `sharedState` initialization using `PATCH`

---

## 🚀 How to Run

```bash
PORT=4700 node index.js
```

- Default port: `4700`
- Expects access to `shared-state` and `discovery` services

---

## 🔗 Endpoints

### `POST /run-job`

Execute a job document.

- **Request Body:**
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
            "input": { "input": "hello" }
          }
        ]
      }
    ]
  }
  ```

- **Response:**
  ```json
  {
    "jobId": "generated-uuid",
    "status": "completed"
  }
  ```

---

### `GET /forms`

Hypermedia description of the service interface.

- Lists the available rels, methods, and expected payload shapes

---

## 🧪 Features

- `$fromState`: Reference data from shared state using JSON Pointer
  ```json
  "input": {
    "id": { "$fromState": "/user/id" }
  }
  ```

- `storeResultAt`: Save results back to shared state
- `mode`: Supports `sequential`, `parallel`, `revert`, or custom modes (unknown modes are skipped)
- Automatically attempts revert on error using a reverse execution stack

---

## 🧰 Development Notes

- Requires running `discovery` and `shared-state` services
- Will PATCH `sharedStateURL` at job start if `sharedState` is defined
- Skips disabled steps or tasks
- Supports basic error logging and revert tracing

