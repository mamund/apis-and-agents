# Composable Command Message Specification

Version: **1.1**  
Last Updated: **2025-04-11**  
Schema: [composable-command-message.schema.json](composable-command-message.schema.json)

---

## 🧭 Overview

The Composable Command Message is a structured, portable JSON format used to drive actions in services that follow the `execute`, `repeat`, and `revert` interface model. It enables the orchestration of decoupled services in composable job workflows.

This specification defines the message format, command types, and filtering behavior.

---

## 🧱 Message Format

Each message is a JSON object with the following fields:

| Field     | Type     | Required | Description |
|-----------|----------|----------|-------------|
| `command` | `string` | ✅       | Action to perform (`create`, `read`, `update`, `delete`, `list`, `filter`) |
| `resource`| `string` | ✅       | Logical name of the resource (e.g. `todo`, `user`) |
| `id`      | `string` | ❌       | Required for `read`, `update`, and `delete` |
| `payload` | `object` | ❌       | Required for `create`, `update`, and `filter` |
| `metadata`| `object` | ❌       | Optional contextual information (e.g. `requestId`, `initiator`) |

---

## ⚙️ Command Behaviors

| Command  | Requires `id` | Requires `payload` | Description |
|----------|----------------|--------------------|-------------|
| `create` | ❌ (optional)  | ✅                 | Create a new resource. If `id` is provided, it must not already exist. If `id` is omitted, the service generates one.
| `read`   | ✅             | ❌                 | Retrieve a resource by ID |
| `update` | ✅             | ✅                 | Update a resource by ID |
| `delete` | ✅             | ❌                 | Delete a resource by ID |
| `list`   | ❌             | ❌                 | Retrieve all resources of a type |
| `filter` | ❌             | ✅                 | Retrieve matching resources using criteria |

---

## 🔍 Filtering Semantics

The `filter` command uses the `payload` field to express filter parameters.

- **String values**: case-insensitive `contains` match  
  (e.g. `"name": "mi"` matches `"Mike"`, `"Emily"`)
- **Numbers, booleans, null**: strict equality
- **Missing fields in record**: considered non-matches
- **Date strings**: treated as plain strings

### Example: Filter Message

```json
{
  "command": "filter",
  "resource": "user",
  "payload": {
    "name": "mi",
    "active": true
  },
  "metadata": {
    "requestId": "abc123"
  }
}
```

---

## ✅ Examples

### Create a TODO item

```json
{
  "command": "create",
  "resource": "todo",
  "payload": {
    "title": "Buy milk",
    "done": false
  }
}
```

### Read a TODO item

```json
{
  "command": "read",
  "resource": "todo",
  "id": "abc123"
}
```

### Update a TODO item

```json
{
  "command": "update",
  "resource": "todo",
  "id": "abc123",
  "payload": {
    "done": true
  }
}
```

### Delete a TODO item

```json
{
  "command": "delete",
  "resource": "todo",
  "id": "abc123"
}
```

### List all TODOs

```json
{
  "command": "list",
  "resource": "todo"
}
```


---

## 🔁 Repeat Semantics

All `repeat` calls must be **idempotent** — running the same message multiple times should result in the same system state.

- For `create` commands:
  - If an `id` is provided, the service overwrites any existing resource with that ID.
  - If no `id` was originally provided, the service generates one and returns it.
  - It is the caller’s responsibility (e.g. job-control) to capture the generated `id` and **include it in future `repeat` calls** to maintain idempotence.

- For `update`, `delete`, and `filter`:
  - Repeating the same message will apply the same effect or result.



---

## 🚫 Collision Handling for `create`

To prevent unintended overwrites, services must implement the following collision policy:

- If a `create` command includes an `id` and a resource with that ID already exists, the service MUST reject the request.
- The recommended response is an HTTP 409 Conflict (or equivalent error).

Example error response:

```json
{
  "error": "Resource with ID 'abc123' already exists.",
  "status": 409
}
```

This rule ensures safe `create` behavior. Overwriting existing resources should be done via `update` or `repeat` (with intent).


---

## 🧑‍💻 Developer Notes

- All services must expose `/execute`, `/repeat`, and `/revert` endpoints.
- This message format is used uniformly across all three interface methods.
- Services should validate incoming messages using the official schema.
- Services that support filtering must follow the specified filter rules.
- Services may return a list of results for `list` and `filter` commands.

---

## 📎 Resources

- [JSON Schema: composable-command-message.schema.json](composable-command-message.schema.json)

