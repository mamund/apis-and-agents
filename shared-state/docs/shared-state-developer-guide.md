# Shared-State Developer Guide

This guide is for developers who want to **use** the shared-state service as part of their orchestration or service composition workflows.

---

## Overview

The shared-state service provides ephemeral, JSON-based storage for coordinating distributed processes. Each document is addressable by an ID and supports flexible updates and observability.

---

## Common Operations

### 1. Create a Shared State Document
```bash
curl -X POST http://localhost:4500/state -d '{ "message": "hello" }' -H "Content-Type: application/json"
```

### 2. Read a Shared State Document
```bash
curl http://localhost:4500/state/<id>
```

### 3. Update or Merge Fields
```bash
curl -X POST http://localhost:4500/state/<id> -d '{ "status": "ok" }' -H "Content-Type: application/json"
```

### 4. Apply Patch Operation
```bash
curl -X PATCH http://localhost:4500/state/<id> -d '{ "op": "add", "path": "/new/field", "value": 123 }' -H "Content-Type: application/json"
```

---

## Metadata and Observability

- Each document tracks:
  - `createdAt` and `lastModified` timestamps
- You can list all known state entries:
```bash
curl http://localhost:4500/state
```

- You can retrieve metadata for a single doc:
```bash
curl http://localhost:4500/state/<id>?meta
```

---

## Notes

- State is stored in-memory and will not persist across restarts.
- Clients **cannot see** metadata when retrieving the document contents via `/state/:id`.
