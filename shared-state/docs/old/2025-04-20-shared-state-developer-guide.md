# Shared-State Service – Developer Guide

This guide is for developers who want to **use** the Shared-State Service to manage shared data across jobs and composable services.

## Overview

The Shared-State Service provides a lightweight, document-based storage mechanism for coordinating data between services. Each state document is:
- Addressed by a unique ID
- Patchable via JSON merge semantics
- Used to store intermediate or final values during job execution

---

## Core Concepts

- Each shared-state document is a JSON object
- Paths use slash-style JSON Pointer notation (e.g., `/results/task1`)
- Documents are modified using `PATCH` or `PUT`

---

## API Endpoints

### Create a State Document

```bash
curl -X POST http://localhost:4500/state \
  -H "Content-Type: application/json" \
  -d '{ "initial": "value" }'
```

**Returns:**
```json
{ "id": "<uuid>", "status": "created" }
```

---

### Read a State Document

```bash
curl http://localhost:4500/state/<id>
```

Returns the entire state document.

---

### Patch a State Document

Used to update (merge) parts of a document.

```bash
curl -X PATCH http://localhost:4500/state/<id> \
  -H "Content-Type: application/json" \
  -d '{
    "op": "merge",
    "value": {
      "results": {
        "task1": "complete"
      }
    }
  }'
```

### Replace a State Document

Use PUT to overwrite the entire document:
```bash
curl -X PUT http://localhost:4500/state/<id> \
  -H "Content-Type: application/json" \
  -d '{ "new": "state" }'
```

---

## Best Practices

- Treat shared-state as **ephemeral** — jobs should clean up after use if needed.
- Use nested paths to organize results by step/task (e.g., `/results/step1`)
- Avoid excessive size or deeply nested structures
- Only use PATCH for additive/merge operations — not deletion

---

## Example Workflow with Job-Control

1. Create a shared-state document
2. Insert shared inputs (or let the job-control merge inline `sharedState`)
3. Use `$fromState` to pull values during job execution
4. Use `storeResultAt` to write values back

---

## Notes

- The service currently stores data in-memory
- Future versions may support persistent backends like Redis or MongoDB
- Error responses include appropriate status codes and messages