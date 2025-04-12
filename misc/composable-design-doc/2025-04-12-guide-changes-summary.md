# Change Summary: Composable Design Document Guide (2025-04-12)

This document highlights the changes made to the developer guide for the Composable Design Document Format.

---

## ✅ New Additions

### 1. `x-*` Extension Field Support
- Added support for fields prefixed with `x-` at the **top-level** and inside each **command**.
- Examples: `x-docId`, `x-preview`, `x-generatedBy`
- **Purpose**: Tooling hints, metadata, and experimental annotations.
- **Caution**: These are ignored by runtime engines and must not affect behavior.

---

## 🛠 Schema Evolvability Updates

### 2. Relaxed `authorization` Block
- Now allows future properties like `scopes`, `expressions`, etc.
- Schema no longer restricts `authorization` to just `roles`.

---

## ⚙️ Behavioral Clarifications

### 3. Defaulting Behavior for `output.statusCode`
- `statusCode` is now optional.
- Defaults:
  - `200` for `returns: "object"` or `"array"`
  - `204` for `returns: "none"`

---

## 🚦 Validation Caveats and Runtime Warnings

- `commands` block must be present, but may be empty (discouraged).
- `resourceSchema` must not be omitted, though it may be empty.
- Every `inputs` block must include `required` and `optional` arrays (even if both are empty).
- Field names in `resourceSchema` must follow strict naming rules (e.g., no `1name`, `$email`).

---

## ✳️ Best Practices Emphasized
- Always include `transitionType`, `description`, and `statusCode` explicitly.
- Avoid relying on `x-*` for runtime logic.
- Use `x-*` for documentation, testing, or internal pipeline integration.