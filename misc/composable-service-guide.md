# Composable Service Developer Guide

This guide defines the required interface and behavior for building services compatible with the composable job-control system.

## ✅ Service Requirements

### 1. Core Interface Endpoints

Every service **must** implement the following endpoints:

- `POST /execute`
- `POST /repeat`
- `POST /revert`

These endpoints all accept a **Composable Command Message** that includes:
```json
{
  "command": "create | read | update | delete | list | filter",
  "resource": "your-resource-name",
  "id": "optional string",
  "payload": { "any valid JSON object" },
  "metadata": { "optional contextual data" }
}
```

### 2. Forms Endpoint

Services must implement a `GET /forms` endpoint that returns:

- The resource type
- A summary of available `command` types
- Required and optional fields for each command
- A description of the overall message structure

Example:
```json
{
  "resource": "todo",
  "messageStructure": {
    "command": "string",
    "resource": "string",
    "id": "string (optional)",
    "payload": {
      "title": "string",
      "done": "boolean"
    },
    "metadata": "object (optional)"
  },
  "affordances": [
    {
      "command": "create",
      "requiredFields": ["title"]
    },
    {
      "command": "update",
      "requiredFields": ["id", "title"]
    },
    {
      "command": "filter",
      "optionalFields": ["title", "done"]
    }
  ]
}
```

### 3. Discovery Registration

Services must register with the discovery service at startup:

```http
POST http://localhost:4000/register
Content-Type: application/json
```

Example payload:
```json
{
  "name": "todo-service",
  "url": "http://localhost:4001",
  "endpoints": ["/execute", "/repeat", "/revert", "/forms"],
  "resources": ["todo"]
}
```

This allows the system to discover and compose services dynamically.

---

## 🔁 Repeat and Revert Behavior

### Repeat (`/repeat`)
Must be **idempotent**:
- `create`: client must provide the same `id` as the original request
- `update`, `delete`, `filter`: repeating the same message = same result

### Revert (`/revert`)
Should perform a logical inverse of the original action:
- `create` → `delete`
- `update` → undo to previous state
- `delete` → reinsert prior value

> Revert logic can be implemented incrementally as needed.

---

## 💡 Summary

To be composable, a service must:
- Expose `execute`, `repeat`, and `revert` interfaces
- Describe itself via `/forms`
- Register with the discovery service on startup
- Use the agreed message format and filtering behavior

