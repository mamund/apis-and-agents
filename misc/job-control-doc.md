# 🧭 Job Control: Declarative, Dynamic Job Orchestration

## 🧠 What Is It?
The `job-control` service lets you define **multi-step jobs** composed of **parallel tasks** using a simple JSON structure. You don't need to write code — just declare the job and let the system handle:

- Service discovery
- Input resolution from shared state
- Parallel execution
- State updates
- Reversion logic on failure

---

## 🚦 What Can a Job Do?

Each **job** is a list of **steps**, and each step contains multiple **tasks** that run in parallel.

```json
{
  "sharedStateURL": "http://localhost:4500/state/my-job-state",
  "steps": [
    {
      "tasks": [
        { "tag": "fetch-user", "input": { "userId": "42" } },
        { "tag": "fetch-metadata", "input": {} }
      ]
    },
    {
      "tasks": [
        {
          "tag": "send-email",
          "input": {
            "to": { "$fromState": "user.email" },
            "body": "Welcome!"
          }
        }
      ]
    }
  ]
}
```

---

## 🧰 Available Features

| Feature                | Description |
|------------------------|-------------|
| **Sequential Steps**   | Each step waits for the previous one to complete |
| **Parallel Tasks**     | Tasks within a step run in parallel |
| **Dynamic Input**      | Use `$fromState` to pull values from shared state |
| **storeResultAt**      | Automatically write task results into shared state |
| **Revert Support**     | Automatically calls `/revert` on services if a job fails |
| **Discovery-Aware**    | Finds services using a central discovery service (`/find?tag=`) |
| **Non-JSON Resilience**| Wraps non-JSON responses as `_raw` with content-type |
| **Conditional Writes** | `onlyOnStatus` controls when a result is stored |

---

## 🧪 Example with Result-to-State Wiring

```json
{
  "tag": "uppercase",
  "input": { "input": "hello world" },
  "storeResultAt": [
    { "targetPath": "/results/full" },
    { "sourcePath": "/result", "targetPath": "/results/textOnly" }
  ]
}
```

This task:
- Sends `"hello world"` to the `uppercase` service.
- Stores the full response at `/results/full`
- Stores just the `result` value at `/results/textOnly`

---

## 🛠 Bonus Capabilities in Progress

- `onlyOnStatus` — selectively write to state
- Future: retry policies, conditional logic, task transform hooks, loops and mappers

---

## 📣 Why Is This Cool?

Because you get:
- ⚡ Declarative, clean job logic
- 🧱 Modular microservice orchestration
- 🧠 State-based affordance tracking
- 🧘‍♀️ No glue code. No hard-wiring.

You're orchestrating behavior — not just calling APIs.

---

## 🧠 Is This Orchestration or Choreography?

This is **orchestration**. The `job-control` service is the central conductor that:
- Runs each step in order
- Resolves and calls services
- Handles rollbacks
- Updates shared state

In contrast, **choreography** would mean services act independently, reacting to events or state changes without a central controller.

### TL;DR
✅ Orchestration = centralized, traceable, rollback-safe  
🔄 Choreography = decentralized, event-driven, emergent

---

