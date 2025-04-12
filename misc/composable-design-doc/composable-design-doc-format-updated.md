# Developer Documentation: Composable Design Document Format (v1.0.0)

This document defines the format and semantics of the Composable Design Document used by the composable-service engine. It serves as the contract between design authors, engine implementors, and generator tooling.

---

## Top-Level Structure

| Field               | Type              | Required | Description                                                  |
|---------------------|-------------------|----------|--------------------------------------------------------------|
| `title`             | `string`          | ✅       | Human-readable name of the service                           |
| `resourceType`      | `string`          | ✅       | Logical identifier used for routing and storage              |
| `version`           | `string`          | ✅       | Version of the design spec format                            |
| `description`       | `string`          | optional | Summary of what the service does *(best practice)*           |
| `resourceSchema`    | `object`          | ✅       | Schema definition of the resource type                       |
| `commands`          | `object`          | ✅       | Detailed behavior for each command                           |
| `authorization`     | `object`          | optional | Top-level default authorization policy                       |

> **Best Practice**: Provide a top-level `description` of the service to improve readability, documentation generation, and onboarding.

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
| `description`      | `string`                   | optional | Short summary of what the command does *(best practice)*     |
| `transitionType`   | `object`                   | optional | Behavior semantics *(strongly recommended)*                  |
| `inputs`           | `object`                   | ✅       | Declares required, optional, default fields                  |
| `output`           | `object`                   | ✅       | What this command returns                                    |
| `authorization`    | `object`                   | optional | Which roles are allowed to invoke this command               |
| `errors`           | `array[object]`            | optional | Declares expected error cases                                |

> **Best Practice**: Provide a `description` and `transitionType` for each command. These improve readability, enhance developer tooling, and support documentation, validation, and test generation.

### `transitionType`
```json
"transitionType": {
  "safe": true | false,
  "idempotent": true | false,
  "reversible": true | false
}
```
If `transitionType` is missing:
- The engine assumes a **conservative default**, equivalent to unsafe, one-shot behavior:
  ```json
  { "safe": false, "idempotent": false, "reversible": false }
  ```
- This mirrors the behavior of HTTP `POST` operations.

> ⚠️ **Caution**: Commands that are actually safe (e.g., `read`, `filter`, `list`) may be misinterpreted if `transitionType` is omitted. It is strongly recommended to include this field explicitly for accurate orchestration, validation, and runtime behavior.

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

If a top-level `authorization` block is present, it is treated as the default for all commands **unless a specific command-level `authorization` block is defined**, in which case the command-level one takes precedence.

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

- **Missing `transitionType`** → default to `{ safe: false, idempotent: false, reversible: false }`
- **Missing `statusCode`** → default to `200` if returning content
- **Missing `errors`** → fallback to a default error map
- **Missing `authorization`** → allow all users (or inherit from top-level)
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

---

## Schema Extensions and Evolvability

The design document format supports a balance between strict validation and forward compatibility.

### `x-*` Extension Fields

To support custom metadata, experimental features, and tool-specific annotations:

- **Top-level**: Custom fields prefixed with `x-` are allowed.  
  ✅ Example: `x-sourceRepo`, `x-generatedBy`, `x-docTags`

- **Within each command**: Fields prefixed with `x-` are allowed.  
  ✅ Example: `x-notes`, `x-preview`, `x-doc-id`

> ⚠️ **Caution**: These `x-*` fields are ignored by the runtime engine. They are intended for documentation, tooling, or internal metadata only. Do not rely on them for core behavior.

All other fields not explicitly allowed by the schema will be rejected. This prevents drift and ensures design integrity.

---

## Notes on Evolvability

- The `authorization` block is expected to evolve. It currently supports `roles`, but future extensions (e.g., `scopes`, `expressions`, `policyId`) are allowed via open-ended fields.
- The schema **enforces naming conventions** on resource fields to avoid invalid or unsafe identifiers.
- The schema **requires**:
  - At least one `resourceSchema` block (cannot be omitted)
  - At least one `command` (empty `commands` is technically allowed but discouraged)
  - Each `command` must include an `inputs` block with both `required` and `optional` arrays, even if empty
- The `output.statusCode` is optional:
  - Defaults to `200` if `returns` is `"object"` or `"array"`
  - Defaults to `204` if `returns` is `"none"`

> ⚠️ **Best Practice**: Always include `transitionType`, `description`, and `statusCode` explicitly to aid in documentation, validation, and runtime consistency.