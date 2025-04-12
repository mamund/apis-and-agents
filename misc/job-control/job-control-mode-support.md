# Job Control: Step-Level `mode` Support

## Overview

The `mode` field in a job definition step allows you to control how each task is executed:

- `"execute"` (default) — performs the intended operation.
- `"repeat"` — idempotently replays a prior operation.
- `"revert"` — attempts to undo a prior operation.

This gives job authors flexible control over how services are invoked, using consistent structured messages.

---

## Where to Use `mode`

The `mode` field is supported **at the step level**:

```json
{
  "name": "step-name",
  "mode": "revert",
  "tasks": [
    {
      "tag": "todo",
      "input": {
        "command": "create",
        "resource": "todo",
        "id": "job-test-001"
      }
    }
  ]
}
```

> Note: `mode` applies to **all tasks within the step**. Mixed modes within a step are not currently supported (but may be in the future via task-level mode).

---

## 🚦 Valid Mode Values

| Mode     | Description                                      | Default |
|----------|--------------------------------------------------|---------|
| `execute`| Normal forward execution of a task               | ✅      |
| `repeat` | Repeats a previously successful task             |         |
| `revert` | Attempts to undo the effect of a prior command   |         |

---

## How It Works

The `job-control` runner looks up the correct service endpoint from its `/forms` metadata, using the value of `mode` as the affordance `rel`:

```js
const mode = step.mode || 'execute';
const targetForm = form.data.find(f => f.rel === mode);
```

So:

- `mode: "execute"` → POST to `/execute`
- `mode: "repeat"` → POST to `/repeat`
- `mode: "revert"` → POST to `/revert`

---

## Reversion Example

```json
{
  "name": "undo-create",
  "mode": "revert",
  "tasks": [
    {
      "tag": "todo",
      "input": {
        "command": "create",
        "resource": "todo",
        "id": "job-test-001"
      }
    }
  ]
}
```

This would send the structured message to the `/revert` endpoint of the matching service.

---

## Backward Compatibility

Jobs that do **not** include a `mode` field will default to:

```json
"mode": "execute"
```

This ensures older job definitions remain valid with no changes required.

---

## Future Work

- Add `mode` support at the **task** level for mixed-mode steps
- Document full lifecycle workflows: execute → repeat → revert
- Add job schema validation with mode awareness

