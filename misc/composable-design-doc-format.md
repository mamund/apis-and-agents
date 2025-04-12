# Developer Documentation: Composable Design Document Format (v1.0.0)

This document defines the format and semantics of the Composable Design Document used by the composable-service engine. It serves as the contract between design authors, engine implementors, and generator tooling.

---

## Top-Level Structure

| Field               | Type              | Required | Description                                                  |
|---------------------|-------------------|----------|--------------------------------------------------------------|
| `title`             | `string`          | ✅       | Human-readable name of the service                           |
| `resourceType`      | `string`          | ✅       | Logical identifier used for routing and storage              |
| `version`           | `string`          | ✅       | Version of the design spec format                            |
| `description`       | `string`          | ✅       | Summary of what the service does                             |
| `supportedCommands` | `array[string]`   | ✅       | List of command names this service supports                  |
| `resourceSchema`    | `object`          | ✅       | Schema definition of the resource type                       |
| `filters`           | `array[string]`   | ✅       | List of fields that can be used with the `filter` command    |
| `commands`          | `object`          | ✅       | Detailed behavior for each command                           |

---

## `resourceSchema`
Each key in `resourceSchema` defines the shape of one resource type.

### Field Schema Format:
```json
"fieldName": {
  "type": "string" | "number" | "boolean" | "object" | "array",
  "enum": ["value1", "value2"],      // optional
  "format": "ISO8601" | "email"      // optional
}
```

---

## `commands` Section
Each command in `commands` includes the following fields:

### Common Fields
| Field              | Type                       | Required | Description                                                  |
|--------------------|----------------------------|----------|--------------------------------------------------------------|
| `description`      | `string`                   | ✅       | What this command does                                       |
| `transitionType`   | `object`                   | ✅       | Behavior semantics                                            |
| `inputs`           | `object`                   | ✅       | Declares required, optional, default fields                  |
| `output`           | `object`                   | ✅       | What this command returns                                    |
| `authorization`    | `object`                   | ✅       | Which roles are allowed to invoke this command               |
| `errors`           | `array[object]`            | optional | Declares expected error cases                                |

### `transitionType`
```json
"transitionType": {
  "safe": true | false,
  "idempotent": true | false,
  "reversible": true | false
}
```

### `inputs`
```json
"inputs": {
  "required": ["field1"],
  "optional": ["field2"],
  "defaults": { "field3": "value" },
  "rules": [{ "id": "generateIfMissing" }]
}
```

### `output`
```json
"output": {
  "type": "person",
  "returns": "object" | "array" | "none",
  "statusCode": 200 | 201 | 204
}
```
If `statusCode` is not provided:
- Use `200` for `object` or `array`
- `204` must be explicitly declared if nothing is returned

### `authorization`
```json
"authorization": {
  "roles": ["admin", "editor"]
}
```
If the list is empty or missing, the command is assumed to be public.

### `errors`
```json
"errors": [
  { "statusCode": 400, "when": "Missing required fields" },
  { "statusCode": 404, "when": "Record not found" }
]
```
If empty or missing, the engine applies a defaultErrorMap.

---

## Design-Time Defaults

- **Missing `statusCode`** → default to `200` if returning content
- **Missing `errors`** → fallback to a default error map
- **Missing `authorization`** → allow all users
- **Unrecognized commands** → may be interpreted using default patterns (e.g. `status` → `update`)

---

## Summary
This format provides a declarative, versioned contract for designing portable, composable, and reversible services.

It can power:
- Runtime engines
- CLI generators
- Test case generation
- Documentation tooling

The Composable Design Document format is meant to evolve safely, with backward-compatible extensions, plugin points, and optional fields to support a growing ecosystem.