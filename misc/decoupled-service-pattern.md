# Decoupled Service Orchestration with `execute`, `repeat`, and `revert`

## The Core Idea

To support dynamic, pluggable orchestration with zero coordination overhead, each service in our system follows a **universal interface pattern**:

```
POST /execute
POST /repeat
POST /revert
```

This 3-endpoint contract allows the `job-control` service to **discover, invoke, retry, and roll back** any service — without needing to understand its internal logic.

---

## What Each Endpoint Does

### `POST /execute`
- Primary operation.
- Performs the service’s main action (e.g., uppercase a string, submit a form, trigger a task).
- Accepts structured input, returns structured output.

### `POST /repeat`
- Re-invokes the same operation, usually idempotent.
- Can use the same or cached input (e.g., for retry or audit).

### `POST /revert`
- Rollback handler.
- Called when a job fails and needs to reverse prior operations.
- Can be a no-op (`{ status: "noop" }`) or undo a real action.

---

## Why This Matters

This model lets you build **decoupled**, **flexible**, and **future-proof** services:

- ✅ **Composable** — any conforming service can be used in any job.
- ✅ **Pluggable** — no need to write glue code or adapters.
- ✅ **Safe** — revert provides rollback capability for regulated or critical environments.
- ✅ **Uniform** — the `job-control` orchestrator can treat every service the same.

---

## Example: The Uppercase Service

`service-a` is a simple text transformer. It exposes:

- `POST /execute` — `{ input: "hello" } → { result: "HELLO" }`
- `POST /repeat` — same input/output contract
- `POST /revert` — always responds `{ status: "noop" }`

Despite its simplicity, it can be used in jobs, rolled back, and audited — **just like any complex service**.

---

## The Payoff

This pattern enables a world where services are:
- Discoverable
- Composable
- Reversible

And best of all — **they never have to know they're in a job**.

