# Job Definition Schema

## Overview

A **Job Definition** is a structured document used by the Job Control service to coordinate and execute tasks across one or more services. Each job contains a list of steps, and each step includes one or more tasks.

Jobs are executed **step-by-step**, with **parallel task execution** within each step.

---

## Top-Level Fields

| Field             | Type     | Required | Description |
|------------------|----------|----------|-------------|
| `name`           | string   | ✅       | Name of the job |
| `sharedStateURL` | string   | ❌       | Optional external state store reference (can be a placeholder or generated value) |
| `sharedState`    | object   | ❌       | Optional embedded state to initialize shared values |
| `steps`          | array    | ✅       | Ordered list of execution steps |

---

## Step Object

| Field   | Type     | Required | Description |
|---------|----------|----------|-------------|
| `name`  | string   | ✅       | Name of the step |
| `mode`  | string   | ❌       | Execution mode. Common values include `sequential`, `parallel`, and `revert`, but any string is allowed for forward compatibility. Unknown modes are ignored at runtime (noop). |
| `enabled` | boolean | ❌       | If set to `false`, this step will be skipped (default is `true`) |
| `tasks` | array    | ✅       | List of tasks to execute in parallel |


| Field   | Type     | Required | Description |
|---------|----------|----------|-------------|
| `name`  | string   | ✅       | Name of the step |
| `mode`  | string   | ❌       | Execution mode. Common values include `sequential`, `parallel`, and `revert`, but any string is allowed for forward compatibility. Unknown modes are ignored at runtime (noop). |
| `tasks` | array    | ✅       | List of tasks to execute in parallel |

---

## Task Object

| Field           | Type   | Required | Description |
|----------------|--------|----------|-------------|
| `tag`          | string | ✅       | Identifier used to look up the service via discovery |
| `input`        | object | ✅       | Structured command message for the service |
| `enabled`      | boolean| ❌       | If set to `false`, this task will be skipped (default is `true`) |
| `storeResultAt`| string / object / array | ❌ | Path(s) in shared state to store the result. Accepts:<br>- A string path<br>- A single object with `targetPath` (and optional `sourcePath`, `onlyOnStatus`)<br>- An array of such objects |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ `targetPath` | string | ✅ | JSON Pointer where the result should be stored |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ `sourcePath` | string | ❌ | Optional path within result to extract |
| &nbsp;&nbsp;&nbsp;&nbsp;↳ `onlyOnStatus` | array | ❌ | Restrict storage to certain status codes |


| Field           | Type   | Required | Description |
|----------------|--------|----------|-------------|
| `tag`          | string | ✅       | Identifier used to look up the service via discovery |
| `input`        | object | ✅       | Structured command message for the service |
| `storeResultAt`| string / object / array | ❌ | Path(s) in shared state to store the result. Accepts:<br>- A string path<br>- A single object with `targetPath` (and optional `sourcePath`, `onlyOnStatus`)<br>- An array of such objects |
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
          "storeResultAt": "/state/todoCreated"
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

### Skipping Steps and Tasks
- You can temporarily disable a step or task using `"enabled": false`.
- This is useful for debugging or turning off parts of a job without removing them.
- If all tasks in a step are disabled, the step is skipped entirely.

## Notes

- Shared state variables can be used in input values via:
  ```json
  "input": {
    "id": { "$fromState": "/todoCreated/id" }
  }
  ```
- Future extensions may include task-level `mode` and conditional execution flags


### Forward Compatibility

- Unrecognized `mode` values are ignored at runtime (treated as noop).
- The schema is designed to evolve over time, allowing safe use of new features by newer agents without breaking older processors.


### `$fromState` and JSON Pointer

- `$fromState` must use [JSON Pointer](https://datatracker.ietf.org/doc/html/rfc6901) format (e.g., `"/user/role"`).
- Dot notation (e.g., `"user.role"`) is no longer supported.
- This matches the format used in `targetPath` and ensures consistency across job-control.
