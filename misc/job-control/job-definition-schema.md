# Job Definition Schema

## Overview

A **Job Definition** is a structured document used by the Job Control service to coordinate and execute tasks across one or more services. Each job contains a list of steps, and each step includes one or more tasks.

Jobs are executed **step-by-step**, with **parallel task execution** within each step.

---

## Top-Level Fields

| Field             | Type     | Required | Description |
|------------------|----------|----------|-------------|
| `name`           | string   | ✅       | Name of the job |
| `sharedStateURL` | string   | ❌       | URL to external state store (used for dynamic inputs and result storage) |
| `steps`          | array    | ✅       | Ordered list of execution steps |

---

## Step Object

| Field   | Type     | Required | Description |
|---------|----------|----------|-------------|
| `name`  | string   | ✅       | Name of the step |
| `mode`  | string   | ❌       | Execution mode: `execute` (default), `repeat`, or `revert` |
| `tasks` | array    | ✅       | List of tasks to execute in parallel |

---

## Task Object

| Field           | Type   | Required | Description |
|----------------|--------|----------|-------------|
| `tag`          | string | ✅       | Identifier used to look up the service via discovery |
| `input`        | object | ✅       | Structured command message for the service |
| `storeResultAt`| string / object / array | ❌ | Path(s) in shared state to store the result |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ `targetPath` | string | ✅ | JSON Pointer where the result should be stored |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ `sourcePath` | string | ❌ | Optional path within result to extract |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ `onlyOnStatus` | array | ❌ | Restrict storage to certain status codes |

---

## Defaults and Behavior

- `mode` defaults to `"execute"` if not specified
- Results are only stored if `storeResultAt` is defined
- Tasks in a step run in **parallel**
- Steps run **sequentially**
- On failure, job-control automatically attempts to **revert** completed tasks in reverse order

---

## Example Job (Basic)

```json
{
  "name": "test-todo-job",
  "steps": [
    {
      "name": "create-todo",
      "tasks": [
        {
          "tag": "todo",
          "input": {
            "command": "create",
            "resource": "todo",
            "id": "job-123",
            "payload": { "title": "Write docs", "done": false }
          },
          "storeResultAt": "$state.todoCreated"
        }
      ]
    }
  ]
}
```

---

## Example Job with Mode: Revert

```json
{
  "name": "undo-create",
  "steps": [
    {
      "name": "revert-todo",
      "mode": "revert",
      "tasks": [
        {
          "tag": "todo",
          "input": {
            "command": "create",
            "resource": "todo",
            "id": "job-123"
          }
        }
      ]
    }
  ]
}
```

---

## Notes

- Shared state variables can be used in input values via:
  ```json
  "input": {
    "id": { "$fromState": "todoCreated.id" }
  }
  ```
- Future extensions may include task-level `mode` and conditional execution flags

