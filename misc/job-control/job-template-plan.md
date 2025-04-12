# 🧰 Job Template Plan for Composable Service Ecosystem

This document outlines the structure and contents of a developer-friendly template for writing jobs that orchestrate composable services using the job-control system.

---

## ✅ Template Inclusions

### 1. Base Job JSON Structure

A minimal working example:

```json
{
  "name": "Example Job",
  "steps": [
    {
      "mode": "execute",
      "tasks": [
        {
          "service": "http://localhost:3001",
          "endpoint": "/execute",
          "input": { "foo": "bar" },
          "storeResultAt": [{ "targetPath": "$.results.foo" }]
        }
      ]
    }
  ]
}
```

---

### 2. Variable Interpolation Support

Teach developers how to:

- Reference shared state: `$state.foo`
- Reference previous results: `$results.step1.task1.data`
- Chain results across multiple steps

---

### 3. Field Cheat Sheet

| Field           | Purpose                                 |
|----------------|------------------------------------------|
| `mode`          | How to run the step (`execute`, `test`) |
| `tasks`         | Array of service calls in parallel      |
| `service`       | Base URL of the service                 |
| `endpoint`      | Relative path (e.g., `/execute`)        |
| `input`         | Payload to send                         |
| `storeResultAt` | Where to store results in state         |

---

### 4. Common Patterns

Pre-built job definitions to illustrate:

- ✅ Single task job
- 🔁 Parallel multi-task job
- 🔄 Retry on failure using `repeat`
- ↩️ Rollback with `revert`
- 📥 State chaining across steps

---

### 5. Starter Job Pack (Suggested Layout)

```
jobs/
  - hello-world.json
  - fan-out-multiple-services.json
  - db-seed-and-verify.json
```

---

### 6. README and CLI Usage

Include guidance on:

- How to write and structure a job file
- How to run a job via the orchestrator:
  ```bash
  curl -X POST http://localhost:3000/job-control/run -d @jobs/hello-world.json
  ```
- How to use dry-run or test mode
- Debugging and logging tips

---

## 🌱 Optional Add-Ons

- JSON Schema for IDE validation
- VS Code snippets or job template generator
- Future: Job editor GUI for visual orchestration

---

This template simplifies job authoring, accelerates testing, and enables developers to safely compose powerful workflows from modular services.
